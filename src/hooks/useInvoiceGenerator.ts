
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { eventBus } from "@/core/event-bus/EventBus";

export function useInvoiceGenerator() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generateInvoice = async (orderId: string) => {
    if (!orderId) {
      toast({
        title: "Erreur",
        description: "ID de commande manquant",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsGenerating(true);

      // Appeler la fonction edge pour générer la facture
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { orderId }
      });

      if (error) {
        console.error('Erreur lors de la génération de la facture:', error);
        toast({
          title: "Erreur",
          description: "Impossible de générer la facture. Veuillez réessayer.",
          variant: "destructive",
        });
        return null;
      }

      if (!data.success) {
        throw new Error(data.error || 'Erreur inconnue');
      }

      // Stocker l'URL du PDF pour le téléchargement
      setPdfUrl(data.pdfUrl);
      
      // Publier un événement pour informer que la facture a été générée
      eventBus.publish('invoice:generated', {
        invoiceId: data.invoiceId,
        orderId,
        pdfUrl: data.pdfUrl
      });

      toast({
        title: "Facture générée",
        description: "La facture a été générée avec succès",
        variant: "default",
      });

      return data;

    } catch (error) {
      console.error('Erreur dans le processus de génération de facture:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la facture. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadInvoice = (url: string, filename = "facture.pdf") => {
    // Créer un lien temporaire pour télécharger le fichier
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    generateInvoice,
    downloadInvoice,
    isGenerating,
    pdfUrl
  };
}
