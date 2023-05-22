import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/types_db';
import { ProductWithPrice } from '@/types/user';
import * as FingerprintJS from '@/utils/app/finterprinter';
import { createClient } from '@supabase/supabase-js';
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_KEY, NO_ACCOUNT_TIMES, FREE_TIMES, PAID_TIMES } from './const';
import moment from 'moment';

export const supabase = createBrowserSupabaseClient<Database>();
const supabaseAdmin = createClient<Database>(
  NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_KEY || ''
);

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export const getUserInfo = async (user: User) => {
  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('email', user.email)
  if (error) {
    console.log(error.message);
  }
  return (data as any) || [];
}

export const getSubscriptions = async (user: User) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.email)
  if (error) {
    console.log(error.message);
  }
  return (data as any) || [];
}

export const getUserTimes = async (user: User|null) => {

  const fp = await FingerprintJS.load({ debug: true })
  const { visitorId } = await fp.get();
  let times = 0;
  if(!user) {
    const { data, error } = await supabase
    .from('free')
    .select('*')
    .eq('visitorId', visitorId)
    .order("id");

    if(data) {
      if(data.length == 0) {
        times = NO_ACCOUNT_TIMES ;
        const { data, error } = await supabase
        .from('free')
        .insert([{
          times: times,
          visitorId: visitorId
        }])
      } else {
        times = data[0].times;
      }
    }
  }

  if(user){
    const subscription = await supabase
    .from('subscriptions')
    .select('*')
    .gte('current_period_end', moment().format("YYYY-MM-D"));
    times = FREE_TIMES;
    if(subscription.data) {
      if(subscription.data?.length > 0) {
        times = PAID_TIMES;
      } 
    }
    
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .eq('chat_date', moment().format("MM/DD/YYYY"));

    if(data && data.length > 0) {
      times = data[0].times;
    } else {
      const { data, error } = await supabase
      .from('users')
      .update([{
        "chat_date": moment().format("MM/DD/YYYY"),
        "times": times
      }])
      .eq('id', user.id);
      times = times;
    }
  }
  return times;
}

export const reducerUserTimes = async (user: User|null) => {
  const userTimes = await getUserTimes(user);

  if(userTimes == 0) {
    return;
  }

  const fp = await FingerprintJS.load({ debug: true })
  const { visitorId } = await fp.get();
  if(!user) {
    const { error } = await supabaseAdmin
    .from('free')
    .update([{
      visitorId: visitorId,
      times: Number(userTimes) - 1
    }]).eq("visitorId", visitorId);
    if (error) {
      console.log(error);
    }
  } else {  
    const { error } = await supabaseAdmin
    .from('users')
    .update([{
      times: Number(userTimes) - 1
    }]).eq("id", user.id);
    if (error) {
      console.log(error);
    }
  }
}

export const chkIsSubscription = async(user: User| null) => {
  if(!user) return false;
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .gte('current_period_end', moment().format("YYYY-MM-D"));

  if(data) {
    if(data.length > 0) {
      return true;
    }
  }
  return false;
}

