
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { items, order_id } = await req.json()
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Invalid items provided')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Get user information if logged in
    let customerEmail = undefined
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      )
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabaseClient.auth.getUser(token)
      if (user?.email) {
        customerEmail = user.email
      }
    }

    console.log('Creating checkout session...')
    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      metadata: {
        order_id: order_id
      },
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            description: item.description,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
        },
        quantity: item.quantity || 1,
      })),
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-success?order_id=${order_id}`,
      cancel_url: `${req.headers.get('origin')}/payment-cancelled?order_id=${order_id}`,
    })

    console.log('Checkout session created:', session.id)
    
    // Update order with Stripe session ID
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    await supabaseAdmin
      .from('orders')
      .update({ 
        stripe_session_id: session.id,
      })
      .eq('id', order_id)

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
