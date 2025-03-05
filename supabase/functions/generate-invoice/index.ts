
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1'

// Configuration CORS pour permettre les appels depuis le frontend
Deno.serve(async (req) => {
  // Gérer les requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { orderId } = await req.json()

    if (!orderId) {
      throw new Error('ID de commande manquant')
    }

    // Récupérer les détails de la commande, les articles, et les informations vendeur/acheteur
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        buyer:buyer_id(id, email, profiles:profiles(full_name, billing_address)),
        seller:seller_id(id, email, profiles:profiles(full_name)),
        seller_account:seller_id(seller_accounts(*)),
        order_items(*, shop_item:shop_item_id(*)),
        order_shipments(*)
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !orderData) {
      throw new Error(`Erreur lors de la récupération de la commande: ${orderError?.message || 'Commande non trouvée'}`)
    }

    // Générer la facture
    const pdfBytes = await generateInvoicePDF(orderData)

    // Créer une nouvelle entrée dans la table invoices si elle n'existe pas déjà
    let invoiceId = orderData.invoice_id

    if (!invoiceId) {
      // Calculer les montants pour la facture
      const subtotal = orderData.order_items.reduce(
        (sum: number, item: any) => sum + (item.price_at_time * item.quantity), 
        0
      )
      const shippingCost = orderData.order_shipments.length > 0 ? 
        orderData.order_shipments[0].shipping_cost || 0 : 0
      const platformFee = subtotal * (orderData.commission_rate || 0.1)
      const vatRate = orderData.vat_rate || 0.2
      const vatAmount = platformFee * vatRate
      const totalAmount = subtotal + shippingCost

      // Créer l'enregistrement de facture
      const { data: invoiceData, error: invoiceError } = await supabaseClient
        .from('invoices')
        .insert({
          order_id: orderId,
          buyer_id: orderData.buyer_id,
          seller_id: orderData.seller_id,
          subtotal,
          shipping_cost: shippingCost,
          platform_fee: platformFee,
          vat_amount: vatAmount,
          vat_rate: vatRate,
          total_amount: totalAmount,
          status: 'created'
        })
        .select('id')
        .single()

      if (invoiceError) {
        throw new Error(`Erreur lors de la création de la facture: ${invoiceError.message}`)
      }

      invoiceId = invoiceData.id

      // Mettre à jour la commande avec l'ID de la facture
      await supabaseClient
        .from('orders')
        .update({ invoice_id: invoiceId })
        .eq('id', orderId)

      // Créer l'enregistrement de commission
      await supabaseClient
        .from('platform_fees')
        .insert({
          invoice_id: invoiceId,
          order_id: orderId,
          seller_id: orderData.seller_id,
          fee_amount: platformFee,
          fee_percentage: orderData.commission_rate || 0.1,
          vat_amount: vatAmount,
          vat_rate: vatRate
        })
    } else {
      // Récupérer les détails de la facture existante
      const { data: invoiceData, error: invoiceError } = await supabaseClient
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single()

      if (invoiceError) {
        throw new Error(`Erreur lors de la récupération de la facture: ${invoiceError.message}`)
      }
    }

    // Enregistrer le PDF dans le bucket 'invoices'
    // Vérifier si le bucket existe, sinon le créer
    const { data: buckets } = await supabaseClient
      .storage
      .listBuckets()

    const invoiceBucketExists = buckets?.some(bucket => bucket.name === 'invoices')
    
    if (!invoiceBucketExists) {
      await supabaseClient
        .storage
        .createBucket('invoices', {
          public: false, // Les factures ne doivent pas être publiques
          fileSizeLimit: 5242880 // 5MB
        })
    }

    const fileName = `invoice_${invoiceId}.pdf`
    const { error: uploadError } = await supabaseClient
      .storage
      .from('invoices')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      throw new Error(`Erreur lors de l'upload de la facture: ${uploadError.message}`)
    }

    // Créer une URL signée pour accéder à la facture
    const { data: signedUrlData } = await supabaseClient
      .storage
      .from('invoices')
      .createSignedUrl(fileName, 60 * 60 * 24) // URL valide 24h

    // Mettre à jour l'URL de la facture dans la table invoices
    await supabaseClient
      .from('invoices')
      .update({
        pdf_url: signedUrlData?.signedUrl,
        status: 'generated'
      })
      .eq('id', invoiceId)

    // Retourner l'URL de la facture au client
    return new Response(
      JSON.stringify({
        invoiceId,
        pdfUrl: signedUrlData?.signedUrl,
        success: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Erreur dans la génération de facture:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

// Fonction pour générer le PDF de la facture
async function generateInvoicePDF(orderData: any): Promise<Uint8Array> {
  // Créer un nouveau document PDF
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // Format A4
  
  // Obtenir la police standard
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const { width, height } = page.getSize()
  const margin = 50

  // En-tête: Logo et informations FRING!
  page.drawText('FRING!', {
    x: margin,
    y: height - margin,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0)
  })
  
  page.drawText('Facture', {
    x: width - margin - 100,
    y: height - margin,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0)
  })

  // Informations de la facture
  const invoiceNumber = orderData.invoice_id ? 
    `FRING-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}` : 
    'Provisoire'
  
  page.drawText(`N° facture: ${invoiceNumber}`, {
    x: width - margin - 200,
    y: height - margin - 30,
    size: 10,
    font
  })
  
  page.drawText(`Date: ${new Date().toLocaleDateString('fr-FR')}`, {
    x: width - margin - 200,
    y: height - margin - 45,
    size: 10,
    font
  })

  // Informations du vendeur et de l'acheteur
  const sellerName = orderData.seller.profiles.full_name || 'Vendeur FRING!'
  const buyerName = orderData.buyer.profiles.full_name || 'Acheteur FRING!'
  let buyerAddress = 'Adresse non spécifiée'
  
  if (orderData.buyer.profiles.billing_address) {
    const addr = orderData.buyer.profiles.billing_address
    buyerAddress = `${addr.street || ''}\n${addr.postalCode || ''} ${addr.city || ''}\n${addr.country || ''}`
  }

  // Informations vendeur
  page.drawText('Vendeur:', {
    x: margin,
    y: height - margin - 80,
    size: 12,
    font: boldFont
  })
  
  page.drawText(sellerName, {
    x: margin,
    y: height - margin - 95,
    size: 10,
    font
  })

  // Informations acheteur
  page.drawText('Acheteur:', {
    x: margin + 200,
    y: height - margin - 80,
    size: 12,
    font: boldFont
  })
  
  page.drawText(buyerName, {
    x: margin + 200,
    y: height - margin - 95,
    size: 10,
    font
  })
  
  let yPos = height - margin - 110
  buyerAddress.split('\n').forEach(line => {
    page.drawText(line, {
      x: margin + 200,
      y: yPos,
      size: 10,
      font
    })
    yPos -= 15
  })

  // Tableau des articles
  yPos = height - margin - 170
  
  // En-tête du tableau
  page.drawText('Description', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont
  })
  
  page.drawText('Quantité', {
    x: margin + 200,
    y: yPos,
    size: 10,
    font: boldFont
  })
  
  page.drawText('Prix unitaire', {
    x: margin + 270,
    y: yPos,
    size: 10,
    font: boldFont
  })
  
  page.drawText('Total', {
    x: margin + 370,
    y: yPos,
    size: 10,
    font: boldFont
  })
  
  yPos -= 20

  // Contenu du tableau
  let subtotal = 0
  
  orderData.order_items.forEach((item: any) => {
    const itemDesc = item.shop_item.clothes_id ? 'Article de mode' : 'Article'
    const quantity = item.quantity
    const price = item.price_at_time
    const total = quantity * price
    subtotal += total
    
    page.drawText(itemDesc, {
      x: margin,
      y: yPos,
      size: 10,
      font
    })
    
    page.drawText(quantity.toString(), {
      x: margin + 200,
      y: yPos,
      size: 10,
      font
    })
    
    page.drawText(`${price.toFixed(2)} €`, {
      x: margin + 270,
      y: yPos,
      size: 10,
      font
    })
    
    page.drawText(`${total.toFixed(2)} €`, {
      x: margin + 370,
      y: yPos,
      size: 10,
      font
    })
    
    yPos -= 20
  })

  // Ligne de séparation
  page.drawLine({
    start: { x: margin, y: yPos + 10 },
    end: { x: width - margin, y: yPos + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  })
  
  yPos -= 20

  // Totaux
  const shippingCost = orderData.order_shipments.length > 0 ? 
    orderData.order_shipments[0].shipping_cost || 0 : 0
  
  const total = subtotal + shippingCost
  
  // Sous-total
  page.drawText('Sous-total:', {
    x: margin + 270,
    y: yPos,
    size: 10,
    font: boldFont
  })
  
  page.drawText(`${subtotal.toFixed(2)} €`, {
    x: margin + 370,
    y: yPos,
    size: 10,
    font
  })
  
  yPos -= 20

  // Frais de livraison
  if (shippingCost > 0) {
    page.drawText('Frais de livraison:', {
      x: margin + 270,
      y: yPos,
      size: 10,
      font: boldFont
    })
    
    page.drawText(`${shippingCost.toFixed(2)} €`, {
      x: margin + 370,
      y: yPos,
      size: 10,
      font
    })
    
    yPos -= 20
  }

  // Total
  page.drawText('Total:', {
    x: margin + 270,
    y: yPos,
    size: 12,
    font: boldFont
  })
  
  page.drawText(`${total.toFixed(2)} €`, {
    x: margin + 370,
    y: yPos,
    size: 12,
    font: boldFont
  })

  // Détails de la commission FRING!
  yPos -= 40
  
  page.drawText('Détails des frais de service FRING!:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont
  })
  
  yPos -= 20
  
  const commissionRate = orderData.commission_rate || 0.1
  const commission = subtotal * commissionRate
  
  page.drawText(`Commission (${(commissionRate * 100).toFixed(0)}%):`, {
    x: margin,
    y: yPos,
    size: 10,
    font
  })
  
  page.drawText(`${commission.toFixed(2)} €`, {
    x: margin + 200,
    y: yPos,
    size: 10,
    font
  })
  
  yPos -= 20
  
  const vatRate = orderData.vat_rate || 0.2
  const vat = commission * vatRate
  
  page.drawText(`TVA sur commission (${(vatRate * 100).toFixed(0)}%):`, {
    x: margin,
    y: yPos,
    size: 10,
    font
  })
  
  page.drawText(`${vat.toFixed(2)} €`, {
    x: margin + 200,
    y: yPos,
    size: 10,
    font
  })

  // Pied de page avec conditions
  yPos = margin + 80
  
  page.drawText('Conditions:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont
  })
  
  yPos -= 15
  
  const conditions = [
    'Transaction entre particuliers via la plateforme FRING!.',
    'Des frais de service sont appliqués par FRING! pour la mise en relation.',
    'Pour toute question, contactez support@fring.fr'
  ]
  
  conditions.forEach(line => {
    page.drawText(line, {
      x: margin,
      y: yPos,
      size: 8,
      font
    })
    yPos -= 12
  })

  // Générer le PDF et retourner les bytes
  return await pdfDoc.save()
}
