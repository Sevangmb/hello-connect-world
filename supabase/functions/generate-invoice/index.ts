
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { PDFDocument, rgb, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib@1.17.1'

// Types
interface InvoiceInput {
  orderId: string;
}

interface InvoiceData {
  invoiceId: string;
  invoiceNumber: string;
  buyerName: string;
  sellerName: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  commission: number;
  vatAmount: number;
  total: number;
  date: string;
}

serve(async (req) => {
  // Gestion CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Créer un client Supabase avec les clés de service
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Extraire les données de l'ordre de la requête
    const { orderId } = await req.json() as InvoiceInput

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: 'ID de commande manquant' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Récupérer les données de l'ordre
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        id, 
        buyer_id, 
        seller_id, 
        total_amount, 
        shipping_cost, 
        commission_amount, 
        status,
        shipping_address,
        order_items(
          id, 
          shop_item_id, 
          quantity, 
          price_at_time
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !orderData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Commande introuvable' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Récupérer les informations sur les articles
    const shopItemIds = orderData.order_items.map(item => item.shop_item_id)
    
    const { data: shopItems, error: shopItemsError } = await supabase
      .from('shop_items')
      .select(`
        id,
        clothes_id,
        clothes:clothes_id(name)
      `)
      .in('id', shopItemIds)

    if (shopItemsError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Erreur lors de la récupération des articles' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Récupérer les informations sur l'acheteur et le vendeur
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .in('id', [orderData.buyer_id, orderData.seller_id])

    if (profilesError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Erreur lors de la récupération des profils' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const buyerProfile = profiles.find(p => p.id === orderData.buyer_id)
    const sellerProfile = profiles.find(p => p.id === orderData.seller_id)

    // Vérifier si une facture existe déjà pour cette commande
    const { data: existingInvoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('id, invoice_number, pdf_url')
      .eq('order_id', orderId)
      .maybeSingle()

    // Si la facture existe déjà et a une URL PDF, la retourner directement
    if (existingInvoice && existingInvoice.pdf_url) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          invoiceId: existingInvoice.id, 
          pdfUrl: existingInvoice.pdf_url,
          invoiceNumber: existingInvoice.invoice_number,
          message: 'Facture existante récupérée'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Préparer les données pour la facture
    const items = orderData.order_items.map(item => {
      const shopItem = shopItems.find(si => si.id === item.shop_item_id)
      return {
        name: shopItem?.clothes?.name || 'Article sans nom',
        price: item.price_at_time,
        quantity: item.quantity
      }
    })

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = orderData.shipping_cost || 0
    const commission = orderData.commission_amount || (subtotal * 0.10) // 10% par défaut si non défini
    const vatRate = 0.20 // 20% TVA
    const vatAmount = commission * vatRate // TVA uniquement sur la commission

    // Créer une entrée de facture si elle n'existe pas déjà
    let invoiceId = existingInvoice?.id
    let invoiceNumber = existingInvoice?.invoice_number

    if (!existingInvoice) {
      const { data: newInvoice, error: createError } = await supabase
        .from('invoices')
        .insert({
          order_id: orderId,
          buyer_id: orderData.buyer_id,
          seller_id: orderData.seller_id,
          subtotal,
          shipping_cost: shipping,
          platform_fee: commission,
          vat_amount: vatAmount,
          vat_rate: vatRate,
          total_amount: subtotal + shipping,
          status: 'created'
        })
        .select('id, invoice_number')
        .single()

      if (createError) {
        return new Response(
          JSON.stringify({ success: false, error: 'Erreur lors de la création de la facture' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      invoiceId = newInvoice.id
      invoiceNumber = newInvoice.invoice_number
    }

    // Préparer les données complètes pour la génération PDF
    const invoiceData: InvoiceData = {
      invoiceId: invoiceId!,
      invoiceNumber: invoiceNumber!,
      buyerName: buyerProfile?.full_name || buyerProfile?.username || 'Acheteur',
      sellerName: sellerProfile?.full_name || sellerProfile?.username || 'Vendeur',
      items,
      subtotal,
      shipping,
      commission,
      vatAmount,
      total: subtotal + shipping,
      date: new Date().toLocaleDateString('fr-FR')
    }

    // Générer le PDF
    const pdfBytes = await generateInvoicePDF(invoiceData)

    // Stocker le PDF dans le bucket de stockage
    const pdfFileName = `invoice_${invoiceNumber?.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    
    // Créer le bucket s'il n'existe pas
    const { data: bucketExists } = await supabase
      .storage
      .getBucket('invoices')
      
    if (!bucketExists) {
      await supabase
        .storage
        .createBucket('invoices', {
          public: false
        })
    }
    
    const { data: fileData, error: uploadError } = await supabase
      .storage
      .from('invoices')
      .upload(pdfFileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Erreur lors du téléchargement de la facture' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Créer une URL signée pour le téléchargement
    const { data: urlData } = await supabase
      .storage
      .from('invoices')
      .createSignedUrl(pdfFileName, 60 * 60 * 24 * 7) // URL valide 7 jours

    // Mettre à jour la facture avec l'URL du PDF
    await supabase
      .from('invoices')
      .update({
        pdf_url: urlData?.signedUrl,
        status: 'completed'
      })
      .eq('id', invoiceId)

    // Retourner l'URL du PDF
    return new Response(
      JSON.stringify({ 
        success: true, 
        invoiceId, 
        pdfUrl: urlData?.signedUrl,
        invoiceNumber,
        message: 'Facture générée avec succès' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function generateInvoicePDF(data: InvoiceData): Promise<Uint8Array> {
  // Créer un nouveau document PDF
  const pdfDoc = await PDFDocument.create()
  
  // Ajouter une page
  const page = pdfDoc.addPage([595.28, 841.89]) // Format A4
  
  // Charger les polices
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  // Définir les marges et dimensions
  const margin = 50
  const width = page.getWidth() - 2 * margin
  const lineHeight = 20
  
  // En-tête de la facture
  page.drawText('FRING!', {
    x: margin,
    y: page.getHeight() - margin,
    size: 24,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  })
  
  page.drawText('Facture', {
    x: margin,
    y: page.getHeight() - margin - lineHeight - 10,
    size: 16,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  })
  
  // Informations de la facture
  let y = page.getHeight() - margin - 3 * lineHeight - 20
  
  page.drawText(`Facture n° : ${data.invoiceNumber}`, {
    x: margin,
    y: y,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  
  y -= lineHeight
  
  page.drawText(`Date : ${data.date}`, {
    x: margin,
    y: y,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  
  // Informations de l'acheteur et du vendeur
  y -= lineHeight * 2
  
  page.drawText('Acheteur :', {
    x: margin,
    y: y,
    size: 12,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  })
  
  y -= lineHeight
  
  page.drawText(data.buyerName, {
    x: margin,
    y: y,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  
  page.drawText('Vendeur :', {
    x: margin + width / 2,
    y: y + lineHeight,
    size: 12,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  })
  
  page.drawText(data.sellerName, {
    x: margin + width / 2,
    y: y,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  
  // Tableau des articles
  y -= lineHeight * 3
  
  // En-tête du tableau
  page.drawText('Description', {
    x: margin,
    y: y,
    size: 12,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  })
  
  page.drawText('Quantité', {
    x: margin + width * 0.6,
    y: y,
    size: 12,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  })
  
  page.drawText('Prix unitaire', {
    x: margin + width * 0.75,
    y: y,
    size: 12,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  })
  
  page.drawText('Total', {
    x: margin + width * 0.9,
    y: y,
    size: 12,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  })
  
  y -= lineHeight
  
  // Ligne sous l'en-tête
  page.drawLine({
    start: { x: margin, y: y + lineHeight / 2 },
    end: { x: margin + width, y: y + lineHeight / 2 },
    thickness: 1,
    color: rgb(0, 0, 0)
  })
  
  // Corps du tableau (articles)
  for (const item of data.items) {
    y -= lineHeight
    
    page.drawText(item.name, {
      x: margin,
      y: y,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0)
    })
    
    page.drawText(item.quantity.toString(), {
      x: margin + width * 0.6,
      y: y,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0)
    })
    
    page.drawText(`${item.price.toFixed(2)} €`, {
      x: margin + width * 0.75,
      y: y,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0)
    })
    
    page.drawText(`${(item.price * item.quantity).toFixed(2)} €`, {
      x: margin + width * 0.9,
      y: y,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0)
    })
  }
  
  // Ligne après les articles
  y -= lineHeight
  
  page.drawLine({
    start: { x: margin, y: y + lineHeight / 2 },
    end: { x: margin + width, y: y + lineHeight / 2 },
    thickness: 1,
    color: rgb(0, 0, 0)
  })
  
  // Récapitulatif
  y -= lineHeight
  
  // Sous-total
  page.drawText('Sous-total :', {
    x: margin + width * 0.7,
    y: y,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  
  page.drawText(`${data.subtotal.toFixed(2)} €`, {
    x: margin + width * 0.9,
    y: y,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  
  // Frais de livraison
  y -= lineHeight
  
  page.drawText('Frais de livraison :', {
    x: margin + width * 0.7,
    y: y,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  
  page.drawText(`${data.shipping.toFixed(2)} €`, {
    x: margin + width * 0.9,
    y: y,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  
  // Commission FRING!
  y -= lineHeight
  
  page.drawText('Commission FRING! :', {
    x: margin + width * 0.7,
    y: y,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  
  page.drawText(`${data.commission.toFixed(2)} €`, {
    x: margin + width * 0.9,
    y: y,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  
  // TVA sur la commission
  y -= lineHeight
  
  page.drawText('TVA (20%) :', {
    x: margin + width * 0.7,
    y: y,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  
  page.drawText(`${data.vatAmount.toFixed(2)} €`, {
    x: margin + width * 0.9,
    y: y,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  
  // Total
  y -= lineHeight * 1.5
  
  page.drawLine({
    start: { x: margin + width * 0.7, y: y + lineHeight / 2 },
    end: { x: margin + width, y: y + lineHeight / 2 },
    thickness: 1,
    color: rgb(0, 0, 0)
  })
  
  y -= lineHeight
  
  page.drawText('Total :', {
    x: margin + width * 0.7,
    y: y,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  })
  
  page.drawText(`${(data.total + data.commission + data.vatAmount).toFixed(2)} €`, {
    x: margin + width * 0.9,
    y: y,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  })
  
  // Pied de page
  y -= lineHeight * 5
  
  page.drawText('FRING! SAS - 123 rue de la Mode, 75000 Paris', {
    x: margin,
    y: y,
    size: 10,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5)
  })
  
  y -= lineHeight
  
  page.drawText('SIRET : 123 456 789 00000 - TVA : FR12345678900', {
    x: margin,
    y: y,
    size: 10,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5)
  })
  
  y -= lineHeight
  
  page.drawText('Ce document tient lieu de facture. Tous les prix sont en euros.', {
    x: margin,
    y: y,
    size: 10,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5)
  })
  
  // Sérialiser le document en bytes
  return await pdfDoc.save()
}
