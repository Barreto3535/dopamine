import { supabase } from "../lib/supabaseClient";

export async function updateUserStreak(): Promise<void> {
  const { error } = await supabase.rpc("update_user_streak");

  if (error) {
    throw new Error(error.message);
  }

}

export async function checkUserStreak(): Promise<void>{
    const {error} = await supabase.rpc("check_user_streak");

    if(error){
        throw new Error(error.message);
    }
}