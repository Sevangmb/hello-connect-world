
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { stripe } from '../_shared/stripe.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface CartItem {
  id: string;
  quantity: number;
  shop_items: {
    id: string;
    price: number;
    seller_id: string;
    clothes: {
      name: string;
    };
  };
}

interface ShippingDetails {
  carrierName: string;
  basePrice: number;
  estimatedDays: {
    min: number;
    max: number;
  };
}

interface RequestBody {
  cartItems: CartItem[];
  shippingDetails: ShippingDetails;
}

console.log('Create Checkout Function Started');

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request body
    const { cartItems, shippingDetails } = await req.json() as RequestBody;
    console.log('Received request:', { cartItems, shippingDetails });

    // Get session to identify user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
    );

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    console.log('Authenticated user:', user.id);

    // Group items by seller
    const itemsBySeller = cartItems.reduce((acc, item) => {
      const sellerId = item.shop_items.seller_id;
      if (!acc[sellerId]) {
        acc[sellerId] = [];
      }
      acc[sellerId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    // Create order records first
    const orderIds = [];
    for (const [sellerId, items] of Object.entries(itemsBySeller)) {
      const orderTotal = items.reduce((sum, item) => sum + (item.shop_items.price * item.quantity), 0);
      
      const { data: orderData, error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          buyer_id: user.id,
          seller_id: sellerId,
          total_amount: orderTotal,
          status: 'pending',
          payment_status: 'pending'
        })
        .select('id')
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw new Error('Failed to create order');
      }

      console.log('Created order:', orderData.id);
      orderIds.push(orderData.id);

      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        shop_item_id: item.shop_items.id,
        quantity: item.quantity,
        price: item.shop_items.price
      }));

      const { error: itemsError } = await supabaseClient
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        throw new Error('Failed to create order items');
      }

      // Create shipping record
      const { error: shipmentError } = await supabaseClient
        .from('order_shipments')
        .insert({
          order_id: orderData.id,
          shipping_method: shippingDetails.carrierName,
          shipping_cost: shippingDetails.basePrice,
          status: 'pending'
        });

      if (shipmentError) {
        console.error('Error creating shipment:', shipmentError);
        throw new Error('Failed to create shipment record');
      }
    }

    // Create line items for Stripe
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.shop_items.clothes.name,
        },
        unit_amount: Math.round(item.shop_items.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if there's a cost
    if (shippingDetails.basePrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Livraison - ${shippingDetails.carrierName}`,
          },
          unit_amount: Math.round(shippingDetails.basePrice * 100),
        },
        quantity: 1,
      });
    }

    console.log('Creating Stripe checkout session with line items:', lineItems);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('Origin')}/payment-success`,
      cancel_url: `${req.headers.get('Origin')}/cart`,
      metadata: {
        user_id: user.id,
        order_ids: JSON.stringify(orderIds)
      }
    });

    console.log('Stripe session created:', session.id);

    // Update orders with Stripe session ID
    for (const orderId of orderIds) {
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ stripe_session_id: session.id })
        .eq('id', orderId);

      if (updateError) {
        console.error(`Error updating order ${orderId} with Stripe session:`, updateError);
      }
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in create-checkout:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
