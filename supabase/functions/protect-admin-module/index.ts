
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Créer un client Supabase avec la clé de service pour contourner la RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Vérification et protection des modules admin...')

    // 1. S'assurer que le module "admin" est toujours actif
    const { data: adminModule, error: adminModuleError } = await supabaseClient
      .from('app_modules')
      .select('*')
      .eq('code', 'admin')
      .single()

    if (adminModuleError && adminModuleError.code !== 'PGRST116') {
      console.error('Erreur lors de la vérification du module admin:', adminModuleError)
      throw adminModuleError
    }

    if (adminModule && adminModule.status !== 'active') {
      console.log('Module admin trouvé inactif. Réactivation...')
      const { error: updateError } = await supabaseClient
        .from('app_modules')
        .update({ 
          status: 'active', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', adminModule.id)

      if (updateError) {
        console.error('Erreur lors de la réactivation du module admin:', updateError)
        throw updateError
      }
      console.log('Module admin réactivé avec succès')
    }

    // 2. S'assurer que toutes les fonctionnalités du module admin sont toujours activées
    const { data: adminFeatures, error: adminFeaturesError } = await supabaseClient
      .from('module_features')
      .select('*')
      .eq('module_code', 'admin')

    if (adminFeaturesError) {
      console.error('Erreur lors de la vérification des fonctionnalités admin:', adminFeaturesError)
      throw adminFeaturesError
    }

    const disabledFeatures = adminFeatures?.filter(feature => !feature.is_enabled) || []
    
    if (disabledFeatures.length > 0) {
      console.log(`${disabledFeatures.length} fonctionnalités admin trouvées désactivées. Réactivation...`)
      
      for (const feature of disabledFeatures) {
        const { error: updateError } = await supabaseClient
          .from('module_features')
          .update({ 
            is_enabled: true, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', feature.id)

        if (updateError) {
          console.error(`Erreur lors de la réactivation de la fonctionnalité ${feature.feature_code}:`, updateError)
        }
      }
      
      console.log('Toutes les fonctionnalités admin ont été réactivées')
    }

    return new Response(
      JSON.stringify({
        message: 'Protection des modules admin effectuée avec succès',
        modulesProtected: adminModule ? 1 : 0,
        featuresProtected: disabledFeatures.length
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('Erreur lors de la protection des modules admin:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})
