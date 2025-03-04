
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gestion des requêtes CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Création du client Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Récupération des données du corps de la requête
    const requestData = await req.json();
    const { email, name, reason } = requestData;

    // Validation des données
    if (!email) {
      return new Response(
        JSON.stringify({ error: "L'email est requis" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Vérification si l'email existe déjà
    const { data: existingUser, error: existingError } = await supabaseClient
      .from("waitlist")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          message: "Vous êtes déjà inscrit sur notre liste d'attente",
          already_registered: true
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Insertion dans la table waitlist
    const { data, error } = await supabaseClient
      .from("waitlist")
      .insert([
        {
          email,
          name: name || null,
          reason: reason || null,
          status: "pending",
        },
      ]);

    if (error) {
      console.error("Erreur d'insertion:", error);
      throw new Error("Erreur lors de l'enregistrement");
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Votre demande a été enregistrée avec succès!" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Erreur:", error.message);
    return new Response(
      JSON.stringify({ error: "Une erreur est survenue lors de votre inscription" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
