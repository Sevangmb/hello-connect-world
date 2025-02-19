import { stripe } from 'https://esm.sh/stripe@13.10.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 })
  }

  try {
    const stripe = new stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object

        // Update order status
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'processing',
            stripe_payment_intent_id: session.payment_intent,
          })
          .eq('stripe_session_id', session.id)

        if (orderError) {
          throw orderError
        }

        // Clear user's cart
        const { error: cartError } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', session.metadata.userId)

        if (cartError) {
          throw cartError
        }

        break
      }
      // Add more event handlers as needed
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
})
