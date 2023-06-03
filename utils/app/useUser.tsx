import { useEffect, useState, createContext, useContext } from 'react';
import {
  useUser as useSupaUser,
  useSessionContext,
  User
} from '@supabase/auth-helpers-react';

import { UserDetails, Subscription, ProductWithPrice } from '@/types/user';
import { chkIsSubscription, getActiveProductsWithPrices } from './supabase-client';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';

export type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
  products: ProductWithPrice[];
  isSubscriptionActive: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase
  } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);

  const getUserDetails = () => supabase.from('users').select('*').single();
  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();

  let isLoadingData_ = isLoadingData
  let userDetails_ = userDetails
  let subscription_ = subscription
  let products_ = products
  let isSubscriptionActive_ = isSubscriptionActive

  useEffect(() => {
    if (user &&   !isLoadingData &&  /* isLoadingData && */!userDetails && !subscription ) {
      isLoadingData_ = true
      userDetails_ = null
      subscription_ = null
      products_ = []
      isSubscriptionActive_ = false
      setIsloadingData(isLoadingData_);
      setUserDetails(userDetails_);
      setSubscription(subscription_);
      setProducts(products_);
      setIsSubscriptionActive(isSubscriptionActive_);
      Promise.allSettled([getUserDetails(), getSubscription(), getActiveProductsWithPrices()]).then(
        (results) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];
          const productsPromise = results[2];

          if (userDetailsPromise.status === 'fulfilled')
            setUserDetails(userDetailsPromise.value.data as UserDetails);

          if (subscriptionPromise.status === 'fulfilled')
          {
            setSubscription(subscriptionPromise.value.data as Subscription);
            setIsSubscriptionActive(subscriptionPromise.value.data !== null);
          }

          if (productsPromise.status === 'fulfilled')
            setProducts(productsPromise.value as ProductWithPrice[]);

          setIsloadingData(false);
        }
      );
    } else if (!user && !isLoadingUser && !isLoadingData) {
      userDetails_ = null
      subscription_ = null
      products_ = []
      isSubscriptionActive_ = false
      setUserDetails(userDetails_);
      setSubscription(subscription_);
      setProducts(products_);
      setIsSubscriptionActive(isSubscriptionActive_);
    }
  }, [user, isLoadingUser]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData_ || (user && !userDetails),
    subscription: subscription_,
    products: products_,
    isSubscriptionActive: isSubscriptionActive_
  };
    return <UserContext.Provider value={value} {...props} />;
};

export const useUser = (userData:UserContextType|null = null) => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  if (userData) {
    context.accessToken = userData.accessToken;
    context.user = userData.user;
    context.userDetails = userData.userDetails;
    context.isLoading = userData.isLoading;
    context.subscription = userData.subscription;
    context.products = userData.products;
    context.isSubscriptionActive = userData.isSubscriptionActive;
  }
  return context;
};

export const getServerUser = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };

  const accessToken = session?.access_token ?? null;

  const getUserDetails = () => supabase.from('users').select('*').single();

  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();

  const getActiveProductsWithPrices_ = () =>
    supabase
      .from('products')
      .select('*, prices(*)')
      .eq('active', true)
      .eq('prices.active', true)
      .order('unit_amount', { foreignTable: 'prices' });

  let userDetails: UserDetails|null = null;
  let subscription: Subscription|null = null;
  let products: ProductWithPrice[] = [];
  let isSubscriptionActive = false;

  let results = await Promise.allSettled([getUserDetails(), getSubscription(), getActiveProductsWithPrices_()])

  const userDetailsPromise = results[0];
  const subscriptionPromise = results[1];
  const productsPromise = results[2];

  if (userDetailsPromise.status === 'fulfilled')
    userDetails = userDetailsPromise.value.data as UserDetails;

  if (subscriptionPromise.status === 'fulfilled') {
    subscription = subscriptionPromise.value.data as Subscription;
    isSubscriptionActive = subscriptionPromise.value.data !== null;
  }

  if (productsPromise.status === 'fulfilled')
    products = productsPromise.value.data as ProductWithPrice[];

  const value = {
    accessToken,
    user: session.user,
    userDetails,
    isLoading: false,
    subscription,
    products,
    isSubscriptionActive
  };

  return {
    props: {
      initialSession: session,
      user: session.user,
      userData: value
    }
  };
};



