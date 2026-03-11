import { supabase } from "../lib/supabaseClient";

export async function addUserCoins(amount: number):Promise<void>{
    const {error} = await supabase.rpc("add_user_coins", {p_amount: amount,});

    if(error){
        throw new Error(error.message);
    }
}