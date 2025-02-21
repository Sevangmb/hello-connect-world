
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import Stripe from 'https://esm.sh/stripe@12.4.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Create Checkout Function Started");

serve(async (req) => {
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Get the request body
    const { cartItems, userId } = await req.json();

    if (!cartItems?.length || !userId) {
      console.error('Missing required parameters:', { cartItems, userId });
      throw new Error('Missing required parameters');
    }

    console.log("Received request:", { cartItems, userId });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get Stripe secret key
    const { data: secretData, error: secretError } = await supabaseClient
      .from('secrets')
      .select('value')
      .eq('key', 'STRIPE_SECRET_KEY')
      .single();

    if (secretError || !secretData?.value) {
      console.error('Error getting Stripe secret:', secretError);
      throw new Error('Could not retrieve Stripe secret key');
    }

    console.log("Successfully retrieved Stripe secret key");

    const stripe = new Stripe(secretData.value);

    // Fetch detailed cart items with correct relationship specification
    const { data: items, error: itemsError } = await supabaseClient
      .from('cart_items')
      .select(`
        id,
        quantity,
        shop_items!shop_item_id (
          id,
          price,
          clothes!clothes_id (
            name,
            image_url
          )
        )
      `)
      .in('id', cartItems.map(item => item.id));

    if (itemsError) {
      console.error('Error fetching cart items:', itemsError);
      throw itemsError;
    }

    if (!items?.length) {
      console.error('No items found in cart');
      throw new Error('No items found in cart');
    }

    console.log("Retrieved cart items:", items);

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.shop_items.price * item.quantity);
    }, 0);

    // Create order first
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        buyer_id: userId,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'pending',
        transaction_type: 'online',
        payment_type: 'stripe'
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    console.log('Created order:', order);

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      shop_item_id: item.shop_items.id,
      quantity: item.quantity,
      price_at_time: item.shop_items.price
    }));

    const { error: orderItemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('Error creating order items:', orderItemsError);
      throw orderItemsError;
    }

    console.log("Creating Stripe session...");

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
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
      success_url: `${req.headers.get('origin')}/payment-success?order_id=${order.id}`,
      cancel_url: `${req.headers.get('origin')}/payment-cancelled`,
      metadata: {
        order_id: order.id
      }
    });

    console.log("Successfully created Stripe session:", session.url);

    // Clear cart after successful session creation
    const { error: clearCartError } = await supabaseClient
      .from('cart_items')
      .delete()
      .in('id', cartItems.map(item => item.id));

    if (clearCartError) {
      console.error('Error clearing cart:', clearCartError);
      // Don't throw here, as the order is already created
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in create-checkout:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

