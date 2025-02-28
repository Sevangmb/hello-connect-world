
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { OutfitSuggestion } from "../types/weather";
import { fetchExistingSuggestion, fetchUserClothes, createOutfitWithSuggestion } from "./outfit-suggestion/api";
import { generateAISuggestion } from "./outfit-suggestion/aiService";
import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Shirt } from "lucide-react";

export const useOutfitSuggestion = (temperature: number, description: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [toastId, setToastId] = useState<string | null>(null);

  const result = useQuery({
    queryKey: ["outfit-suggestion", temperature, description],
    queryFn: async () => {
      try {
        console.log("Fetching outfit suggestion for:", { temperature, description });
        
        // Toast de chargement initial
        const { id, dismiss } = toast({
          title: "Préparation de votre tenue",
          description: "Nous recherchons la tenue idéale pour aujourd'hui...",
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          duration: 60000, // 1 minute max
        });
        setToastId(id);
        
        // Vérifier si l'utilisateur est connecté
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("User not authenticated");
          dismiss();
          toast({
            variant: "destructive",
            title: "Non connecté",
            description: "Vous devez être connecté pour voir les suggestions de tenues.",
            icon: <AlertCircle className="h-4 w-4" />
          });
          throw new Error("User not authenticated");
        }

        // Toast de mise à jour
        toast({
          id,
          title: "Analyse de vos vêtements",
          description: "Analyse de votre garde-robe pour la météo actuelle...",
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          duration: 60000,
        });

        // Vérifier s'il existe déjà une suggestion récente
        const { existingSuggestion, suggestionError } = await fetchExistingSuggestion(user.id, temperature, description);
        
        if (!suggestionError && existingSuggestion?.outfits) {
          console.log("Using existing suggestion:", existingSuggestion);
          
          dismiss();
          toast({
            title: "Tenue trouvée",
            description: "Voici une tenue adaptée à la météo actuelle",
            icon: <Shirt className="h-4 w-4 text-blue-500" />,
            duration: 5000,
          });
          
          return {
            top: existingSuggestion.outfits.top,
            bottom: existingSuggestion.outfits.bottom,
            shoes: existingSuggestion.outfits.shoes,
            explanation: existingSuggestion.outfits.description || 
              `Pour ${temperature}°C avec un temps ${description}, cette tenue est appropriée.`,
            temperature,
            description
          } as OutfitSuggestion;
        }

        // Toast de mise à jour
        toast({
          id,
          title: "Accès à votre garde-robe",
          description: "Récupération de vos vêtements...",
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          duration: 60000,
        });

        // Récupérer les vêtements de l'utilisateur
        const { data: clothes, error: clothesError } = await fetchUserClothes(user.id);

        if (clothesError) {
          console.error("Error fetching clothes:", clothesError);
          dismiss();
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible d'accéder à votre garde-robe",
            icon: <AlertCircle className="h-4 w-4" />
          });
          throw clothesError;
        }

        if (!clothes || clothes.length === 0) {
          dismiss();
          toast({
            variant: "destructive",
            title: "Aucun vêtement",
            description: "Vous devez d'abord ajouter des vêtements à votre garde-robe.",
            icon: <AlertCircle className="h-4 w-4" />
          });
          throw new Error("No clothes available");
        }

        // Toast de mise à jour
        toast({
          id,
          title: "Création d'une tenue",
          description: "Notre IA génère une suggestion adaptée à la météo...",
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          duration: 60000,
        });

        // Générer une nouvelle suggestion avec l'IA
        const { suggestion, error: aiError } = await generateAISuggestion(
          clothes,
          temperature,
          description
        );

        if (aiError || !suggestion) {
          dismiss();
          toast({
            variant: "destructive",
            title: "Erreur de suggestion",
            description: "Impossible de générer une suggestion de tenue",
            icon: <AlertCircle className="h-4 w-4" />
          });
          throw aiError || new Error("Failed to generate suggestion");
        }

        // Toast de mise à jour
        toast({
          id,
          title: "Finalisation",
          description: "Enregistrement de votre tenue personnalisée...",
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          duration: 60000,
        });

        // Enregistrer la suggestion dans la base de données
        const { outfit, error: saveError } = await createOutfitWithSuggestion(
          user.id,
          temperature,
          description,
          suggestion.explanation,
          suggestion.top?.id || null,
          suggestion.bottom?.id || null,
          suggestion.shoes?.id || null
        );

        if (saveError) {
          console.error("Error saving suggestion:", saveError);
          dismiss();
          toast({
            variant: "destructive",
            title: "Erreur d'enregistrement",
            description: "Impossible d'enregistrer la suggestion de tenue",
            icon: <AlertCircle className="h-4 w-4" />
          });
          throw saveError;
        }

        // Toast final de succès
        dismiss();
        toast({
          title: "Tenue créée",
          description: "Voici votre tenue idéale pour aujourd'hui !",
          icon: <Shirt className="h-4 w-4 text-green-500" />,
          duration: 5000,
        });

        // Retourner la suggestion avec les informations détaillées sur la tenue
        return {
          top: outfit?.top || null,
          bottom: outfit?.bottom || null,
          shoes: outfit?.shoes || null,
          explanation: suggestion.explanation,
          temperature,
          description
        } as OutfitSuggestion;

      } catch (error) {
        console.error("Error in outfit suggestion query:", error);
        if (toastId) {
          toast({
            id: toastId,
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la génération de la suggestion.",
            icon: <AlertCircle className="h-4 w-4" />
          });
        }
        throw error;
      } finally {
        setToastId(null);
      }
    },
    enabled: Boolean(temperature) && Boolean(description),
    retry: 1,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Nettoyage du toast lors du démontage
  useEffect(() => {
    return () => {
      if (toastId) {
        toast({
          id: toastId,
          title: "",
          description: ""
        });
      }
    };
  }, [toastId, toast]);

  return result;
};
