
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { stripe } from '../_shared/stripe.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface CartItem {
  id: string;
  quantity: number;
  shop_items: {
    id: string;
    price: number;
    clothes: {
      name: string;
    };
  };
}

interface ShippingDetails {
  carrierName: string;
  basePrice: number;
  estimatedDays: {
    min: number;
    max: number;
  };
}

interface RequestBody {
  cartItems: CartItem[];
  shippingDetails: ShippingDetails;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request body
    const { cartItems, shippingDetails } = await req.json() as RequestBody;

    // Get session to identify user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
    );

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Create line items for Stripe
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.shop_items.clothes.name,
        },
        unit_amount: Math.round(item.shop_items.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item
    if (shippingDetails.basePrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Livraison - ${shippingDetails.carrierName}`,
          },
          unit_amount: Math.round(shippingDetails.basePrice * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('Origin')}/payment-success`,
      cancel_url: `${req.headers.get('Origin')}/payment-cancelled`,
      metadata: {
        user_id: user.id,
        cart_items: JSON.stringify(cartItems.map(item => ({
          id: item.id,
          shop_item_id: item.shop_items.id,
          quantity: item.quantity
        }))),
        shipping_details: JSON.stringify(shippingDetails)
      }
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
