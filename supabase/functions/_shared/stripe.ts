
import Stripe from 'https://esm.sh/stripe@14.12.0?target=deno';

export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  // This is needed to use the Fetch API rather than Node's http package
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});
