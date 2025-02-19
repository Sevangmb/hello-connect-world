
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { stripe } from 'https://esm.sh/stripe@13.10.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripe = new stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { cartItems, userId } = await req.json()

    if (!cartItems?.length || !userId) {
      throw new Error('Missing required parameters')
    }

    // Fetch details for all cart items
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        shop_items!inner (
          id,
          price,
          shop_id,
          clothes!inner (
            name,
            image_url
          )
        )
      `)
      .eq('user_id', userId)

    if (itemsError) {
      throw itemsError
    }

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
    })

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: userId,
        seller_id: items[0].shop_items.shop_id, // For simplicity, using first item's shop
        total_amount: items.reduce((sum, item) => sum + (item.shop_items.price * item.quantity), 0),
        stripe_session_id: session.id,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      shop_item_id: item.shop_items.id,
      quantity: item.quantity,
      price_at_time: item.shop_items.price,
    }))

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (orderItemsError) {
      throw orderItemsError
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
