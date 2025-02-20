
import { createClient } from 'npm:@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'npm:stripe@14.16.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { cartItems, userId } = await req.json();
    console.log('Received request:', { cartItems, userId });

    if (!cartItems?.length || !userId) {
      throw new Error('Missing required parameters');
    }

    // Modifier la requête pour utiliser la bonne relation
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        shop_items (
          id,
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
      console.error('Error fetching cart items:', itemsError);
      throw new Error('Error fetching cart items');
    }

    console.log('Fetched cart items:', items);

    if (!items?.length) {
      throw new Error('No items found in cart');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.shop_items.clothes.name,
            images: item.shop_items.clothes.image_url ? [item.shop_items.clothes.image_url] : [],
          },
          unit_amount: Math.round(item.shop_items.price * 100), // Convertir en centimes
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      metadata: {
        userId,
        cartItems: JSON.stringify(cartItems),
      },
    });

    console.log('Created Stripe session:', session.id);

    // Créer la commande dans la base de données
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.shop_items.price * item.quantity);
    }, 0);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: userId,
        total_amount: totalAmount,
        stripe_session_id: session.id,
        status: 'pending',
        payment_status: 'pending',
        payment_type: 'online',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Error creating order');
    }

    console.log('Created order:', order);

    // Créer les lignes de commande
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
      throw new Error('Error creating order items');
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-checkout:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
