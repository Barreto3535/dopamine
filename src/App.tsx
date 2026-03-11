import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabaseClient";

import MainLayout from "./layouts/MainLayout";
import AppLayout from "./layouts/AppLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Focus from "./pages/Focus";
import Progress from "./pages/Progress";

import { checkUserStreak } from "./services/streakService";

type GuardProps = {
  session: Session | null;
  children: ReactNode;
};

function ProtectedRoute({ session, children }: GuardProps) {
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicOnlyRoute({ session, children }: GuardProps) {
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        try {
          await checkUserStreak();
        } catch (error) {
          console.error("Erro ao verificar streak:", error);
        }
      }

      if (isMounted) {
        setSession(session);
        setLoading(false);
      }
    }

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);

      if (nextSession) {
        checkUserStreak().catch((error) => {
          console.error("Erro ao verificar streak:", error);
        });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route
          path="/login"
          element={
            <PublicOnlyRoute session={session}>
              <Login />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicOnlyRoute session={session}>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute session={session}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:taskId" element={<TaskDetails />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/progress" element={<Progress />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={session ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}