
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// Cette fonction est invoquée périodiquement pour s'assurer que le module Admin
// reste toujours actif dans la base de données, empêchant ainsi toute désactivation accidentelle

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Gestion des requêtes OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Créer un client Supabase en utilisant les variables d'environnement
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Trouver le module Admin
    const { data: adminModule, error: findError } = await supabase
      .from('app_modules')
      .select('id, code, status')
      .eq('code', 'admin')
      .single()

    if (findError) {
      console.error('Erreur lors de la recherche du module Admin:', findError)
      throw findError
    }

    // Si le module Admin n'est pas actif, le réactiver
    if (adminModule && adminModule.status !== 'active') {
      const { error: updateError } = await supabase
        .from('app_modules')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString() 
        })
        .eq('id', adminModule.id)

      if (updateError) {
        console.error('Erreur lors de la réactivation du module Admin:', updateError)
        throw updateError
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Module Admin réactivé avec succès',
          module: adminModule.code
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Vérifier également les fonctionnalités du module Admin
    const { data: features, error: featuresError } = await supabase
      .from('module_features')
      .select('id, module_code, feature_code, is_enabled')
      .eq('module_code', 'admin')

    if (featuresError) {
      console.error('Erreur lors de la récupération des fonctionnalités du module Admin:', featuresError)
      throw featuresError
    }

    // Réactiver toutes les fonctionnalités désactivées du module Admin
    const disabledFeatures = features.filter(f => !f.is_enabled)
    
    if (disabledFeatures.length > 0) {
      const featureIds = disabledFeatures.map(f => f.id)
      
      const { error: updateFeaturesError } = await supabase
        .from('module_features')
        .update({ 
          is_enabled: true,
          updated_at: new Date().toISOString() 
        })
        .in('id', featureIds)

      if (updateFeaturesError) {
        console.error('Erreur lors de la réactivation des fonctionnalités du module Admin:', updateFeaturesError)
        throw updateFeaturesError
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Fonctionnalités du module Admin réactivées avec succès',
          module: 'admin',
          featuresCount: disabledFeatures.length
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Si tout est déjà correctement configuré
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Le module Admin est déjà actif et toutes ses fonctionnalités sont activées',
        module: 'admin'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Erreur lors de la protection du module Admin:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Erreur lors de la protection du module Admin',
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
