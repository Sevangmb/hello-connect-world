
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      webhookSecret
    );

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Mettre à jour le statut de la commande
        const { error: orderError } = await supabase
          .from('orders')
          .update({ 
            status: 'paid',
            stripe_payment_intent_id: session.payment_intent as string 
          })
          .eq('stripe_session_id', session.id);

        if (orderError) {
          console.error('Error updating order:', orderError);
          throw orderError;
        }

        // Récupérer les informations de la commande
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_session_id', session.id)
          .single();

        if (order) {
          // Si c'est une commande shop_online, on génère un QR code
          if (order.transaction_type === 'shop_online') {
            const qrCode = `${order.id}-${Math.random().toString(36).substring(7)}`;
            await supabase
              .from('orders')
              .update({ qr_code: qrCode })
              .eq('id', order.id);
          }
        }

        // Mettre à jour le statut des articles
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('shop_item_id')
          .eq('order_id', session.metadata?.order_id);

        if (orderItems) {
          const { error: itemsError } = await supabase
            .from('shop_items')
            .update({ status: 'sold' })
            .in('id', orderItems.map(item => item.shop_item_id));

          if (itemsError) {
            console.error('Error updating shop items:', itemsError);
            throw itemsError;
          }
        }

        break;
      }
      
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const { error } = await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('stripe_session_id', session.id);

        if (error) {
          console.error('Error updating order:', error);
          throw error;
        }
        
        break;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
