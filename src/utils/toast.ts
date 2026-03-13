import toast from 'react-hot-toast';
import type { ToastOptions } from 'react-hot-toast';

type ToastPromiseMessages = {
  loading: string;
  success: string;
  error: string;
};

// Estilos base para todos os toasts (em formato de objeto, não JSX)
const baseStyle: ToastOptions['style'] = {
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-3) var(--space-4)',
  fontSize: '0.95rem',
  fontWeight: '500',
  boxShadow: 'var(--shadow-md)',
};

export const toastHelpers = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      icon: '✅',
      style: baseStyle,
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      icon: '❌',
      style: baseStyle,
    });
  },

  info: (message: string, icon?: string) => {
    toast(message, {
      icon: icon || 'ℹ️',
      duration: 3000,
      style: baseStyle,
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: baseStyle,
    });
  },

  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },

  promise: async <T,>(
    promise: Promise<T>,
    messages: ToastPromiseMessages
  ): Promise<T> => {
    return toast.promise(promise, messages, {
      loading: {
        icon: '⏳',
        style: baseStyle,
      },
      success: {
        icon: '🎉',
        duration: 3000,
        style: {
          ...baseStyle,
          borderLeft: '4px solid var(--color-success)',
        },
      },
      error: {
        icon: '❌',
        duration: 4000,
        style: {
          ...baseStyle,
          borderLeft: '4px solid var(--color-danger)',
        },
      },
    });
  },

  // ⚠️ IMPORTANTE: Este método NÃO retorna o toast diretamente
  // Ele só retorna uma Promise e quem chama que precisa lidar com o componente
  confirm: (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Apenas preparamos a Promise, o componente React vai usar
      window.__toastConfirmCallback = (confirmed: boolean) => {
        resolve(confirmed);
      };
      
      // Disparamos um evento customizado para o componente escutar
      window.dispatchEvent(new CustomEvent('showConfirmToast', { 
        detail: { message } 
      }));
    });
  },
};

// Para TypeScript reconhecer nossa propriedade global
declare global {
  interface Window {
    __toastConfirmCallback?: (confirmed: boolean) => void;
  }
}