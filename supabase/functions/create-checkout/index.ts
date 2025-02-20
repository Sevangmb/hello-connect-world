
import { createClient } from 'npm:@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'npm:stripe@14.16.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate request body
    const { cartItems, userId } = await req.json();
    console.log('Received request:', { cartItems, userId });

    if (!cartItems?.length || !userId) {
      console.error('Missing required parameters:', { cartItems, userId });
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Fetch detailed cart items information
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        shop_items (
          id,
          shop_id,
          price,
          clothes (
            name,
            image_url
          )
        )
      `)
      .eq('user_id', userId)
      .in('id', cartItems.map(item => item.id));

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
      return new Response(
        JSON.stringify({ error: 'Error fetching cart items' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!items?.length) {
      console.error('No items found for cart:', cartItems);
      return new Response(
        JSON.stringify({ error: 'No items found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    console.log('Fetched items:', items);

    // Calculate total amount and get seller ID
    const totalAmount = items.reduce((sum, item) => sum + (item.shop_items.price * item.quantity), 0);
    const sellerId = items[0].shop_items.shop_id;

    console.log('Creating Stripe session with amount:', totalAmount);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.shop_items.clothes.name,
            images: item.shop_items.clothes.image_url ? [item.shop_items.clothes.image_url] : [],
          },
          unit_amount: Math.round(item.shop_items.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/payment-cancelled`,
      metadata: {
        userId,
        cartItems: JSON.stringify(cartItems.map(item => ({ 
          id: item.id, 
          quantity: item.quantity 
        }))),
      },
    });

    console.log('Created Stripe session:', session.id);

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: userId,
        seller_id: sellerId,
        total_amount: totalAmount,
        stripe_session_id: session.id,
        status: 'pending',
        payment_status: 'pending',
        payment_type: 'online',
        transaction_type: 'p2p'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Error creating order' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Created order:', order);

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      shop_item_id: item.shop_items.id,
      quantity: item.quantity,
      price_at_time: item.shop_items.price,
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('Error creating order items:', orderItemsError);
      return new Response(
        JSON.stringify({ error: 'Error creating order items' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Return the Stripe checkout URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in create-checkout:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
