
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { stripe } from '../_shared/stripe.ts';
import { corsHeaders } from '../_shared/cors.ts';

console.log('Stripe Webhook Handler Started');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the stripe signature from headers
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    const body = await req.text();
    console.log('Received webhook payload');

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    // Verify the event
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log('Webhook event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderIds = JSON.parse(session.metadata.order_ids);
      const userId = session.metadata.user_id;

      console.log('Processing completed checkout for orders:', orderIds);

      // Update all associated orders
      for (const orderId of orderIds) {
        const { error: orderError } = await supabaseClient
          .from('orders')
          .update({
            status: 'paid',
            payment_status: 'completed',
            stripe_payment_intent_id: session.payment_intent
          })
          .eq('id', orderId);

        if (orderError) {
          console.error(`Error updating order ${orderId}:`, orderError);
          continue;
        }

        // Créer un enregistrement de paiement
        const { data: orderData } = await supabaseClient
          .from('orders')
          .select('total_amount, buyer_id, seller_id')
          .eq('id', orderId)
          .single();

        if (orderData) {
          const { data: paymentData, error: paymentError } = await supabaseClient
            .from('payments')
            .insert({
              order_id: orderId,
              buyer_id: orderData.buyer_id,
              seller_id: orderData.seller_id,
              amount: orderData.total_amount,
              stripe_payment_intent_id: session.payment_intent,
              status: 'completed'
            })
            .select('id')
            .single();

          if (paymentError) {
            console.error(`Error creating payment record for order ${orderId}:`, paymentError);
          } else if (paymentData) {
            // Mettre à jour l'order avec l'id du paiement
            await supabaseClient
              .from('orders')
              .update({ payment_id: paymentData.id })
              .eq('id', orderId);
          }
        }

        // Générer automatiquement la facture
        try {
          // Appeler la fonction de génération de facture
          const invoiceResponse = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-invoice`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
              },
              body: JSON.stringify({ orderId })
            }
          );

          if (!invoiceResponse.ok) {
            const errorData = await invoiceResponse.json();
            console.error(`Error generating invoice for order ${orderId}:`, errorData);
          } else {
            console.log(`Invoice generated for order ${orderId}`);
          }
        } catch (invoiceError) {
          console.error(`Exception when generating invoice for order ${orderId}:`, invoiceError);
        }

        // Update shipment status
        const { error: shipmentError } = await supabaseClient
          .from('order_shipments')
          .update({ status: 'preparing' })
          .eq('order_id', orderId);

        if (shipmentError) {
          console.error(`Error updating shipment for order ${orderId}:`, shipmentError);
        }

        // Créer une notification de transaction
        const { error: notificationError } = await supabaseClient
          .from('transaction_notifications')
          .insert({
            user_id: userId,
            order_id: orderId,
            type: 'payment_received',
            message: 'Votre paiement a été reçu et confirmé.',
            metadata: { payment_intent: session.payment_intent }
          });

        if (notificationError) {
          console.error('Error creating transaction notification:', notificationError);
        }
      }

      // Clear cart items for the user
      const { error: cartError } = await supabaseClient
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (cartError) {
        console.error('Error clearing cart:', cartError);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in webhook handler:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
