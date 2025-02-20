
import { stripe } from 'npm:stripe@14.16.0';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing checkout request...");
    
    const stripeClient = new stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { cartItems, userId } = await req.json();

    console.log("Received request with:", { cartItems, userId });

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
      console.error("Error fetching items:", itemsError);
      throw itemsError;
    }

    console.log("Fetched items:", items);

    if (!items?.length) {
      throw new Error('No items found');
    }

    // Create Stripe checkout session
    const session = await stripeClient.checkout.sessions.create({
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
      success_url: `${new URL(req.url).origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(req.url).origin}/payment-cancelled`,
      metadata: {
        userId,
      },
    });

    console.log("Created Stripe session:", session.id);

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: items.reduce((sum, item) => sum + (item.shop_items.price * item.quantity), 0),
        stripe_session_id: session.id,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw orderError;
    }

    console.log("Created order:", order);

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
      console.error("Error creating order items:", orderItemsError);
      throw orderItemsError;
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
