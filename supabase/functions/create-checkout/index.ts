
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
      throw new Error('STRIPE_SECRET_KEY is not set');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request body
    const { cartItems, userId } = await req.json();
    console.log('Received request:', { cartItems, userId });

    if (!cartItems?.length || !userId) {
      throw new Error('Missing required parameters');
    }

    // Fetch detailed cart items information
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        shop_items!inner (
          id,
          price,
          clothes!inner (
            name,
            image_url
          )
        )
      `)
      .eq('user_id', userId)
      .in('id', cartItems.map(item => item.id));

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
      throw itemsError;
    }

    if (!items?.length) {
      throw new Error('No items found');
    }

    console.log('Fetched items:', items);

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.shop_items.price * item.quantity), 0);

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
      },
    });

    console.log('Created Stripe session:', session.id);

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: userId,
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
      throw orderError;
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
      throw orderItemsError;
    }

    // Clear the user's cart after successful checkout
    const { error: clearCartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (clearCartError) {
      console.error('Error clearing cart:', clearCartError);
      // Don't throw here as the order has been created successfully
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in create-checkout:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
