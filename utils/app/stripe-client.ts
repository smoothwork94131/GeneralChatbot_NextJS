import { loadStripe, Stripe } from '@stripe/stripe-js';
import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY} from '@/utils/app/const';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
        ''
    );
  }

  return stripePromise;
};


