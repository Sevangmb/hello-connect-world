
// Note: Ceci est un exemple de mise à jour de la fonction handle-stripe-webhook existante.
// Ajoutez ce code à votre fonction existante pour gérer la génération automatique de factures.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Stripe } from 'https://esm.sh/stripe@12.18.0'
import { corsHeaders } from '../_shared/cors.ts'

// Configuration de Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
})

// Configuration Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req) => {
  // Gestion CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response(JSON.stringify({ error: 'No signature found' }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // Obtenir le corps de la requête
    const body = await req.text()
    
    // Vérifier et construire l'événement
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    
    // Créer un client Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Traiter l'événement en fonction de son type
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      // Récupérer les métadonnées de la session
      const metadata = session.metadata || {}
      const orderIds = metadata.orderIds ? JSON.parse(metadata.orderIds) : []
      const buyerId = metadata.userId
      
      // Pour chaque commande, mettre à jour son statut et créer un enregistrement de paiement
      for (const orderId of orderIds) {
        // Mettre à jour le statut de la commande
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            payment_status: 'completed',
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            confirmed_at: new Date().toISOString()
          })
          .eq('id', orderId)
          .select('seller_id, total_amount')
          .single()
        
        if (orderError) {
          console.error(`Erreur lors de la mise à jour de la commande ${orderId}:`, orderError)
          continue
        }
        
        // Créer un enregistrement de paiement
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            order_id: orderId,
            buyer_id: buyerId,
            seller_id: order.seller_id,
            amount: order.total_amount,
            stripe_payment_intent_id: session.payment_intent,
            stripe_payment_method_id: session.payment_method,
            status: 'completed'
          })
        
        if (paymentError) {
          console.error(`Erreur lors de la création du paiement pour la commande ${orderId}:`, paymentError)
        }
        
        // Générer automatiquement la facture
        try {
          // Appeler la fonction edge pour générer la facture
          const fetchResponse = await fetch(`${supabaseUrl}/functions/v1/generate-invoice`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify({ orderId })
          })
          
          const responseData = await fetchResponse.json()
          console.log(`Résultat de la génération de facture pour ${orderId}:`, responseData)
          
          // Créer une notification pour informer l'acheteur et le vendeur
          await supabase
            .from('transaction_notifications')
            .insert([
              {
                user_id: buyerId,
                order_id: orderId,
                type: 'payment_received',
                message: 'Votre paiement a été reçu et votre facture est disponible.'
              },
              {
                user_id: order.seller_id,
                order_id: orderId,
                type: 'payment_received',
                message: 'Un paiement a été reçu pour votre article vendu.'
              }
            ])
          
        } catch (invoiceError) {
          console.error(`Erreur lors de la génération de la facture pour la commande ${orderId}:`, invoiceError)
        }
      }
      
      return new Response(JSON.stringify({ received: true }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Traiter d'autres types d'événements Stripe si nécessaire...
    
    // Réponse par défaut
    return new Response(JSON.stringify({ received: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (err) {
    console.error('Erreur dans le webhook Stripe:', err)
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
