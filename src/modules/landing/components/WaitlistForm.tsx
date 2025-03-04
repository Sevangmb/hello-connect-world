
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface WaitlistFormProps {
  onSubmitSuccess: () => void;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ onSubmitSuccess }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir votre adresse email",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('waitlist-subscribe', {
        body: { email, name, reason }
      });

      if (error) throw error;
      
      if (data.already_registered) {
        toast({
          title: "Déjà inscrit",
          description: data.message,
        });
      } else {
        toast({
          title: "Inscription réussie",
          description: data.message,
        });
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleWaitlistSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-center mb-4">Rejoindre la liste d'attente</h3>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nom (optionnel)
        </label>
        <Input
          id="name"
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="reason" className="block text-sm font-medium mb-1">
          Pourquoi êtes-vous intéressé par FRING? (optionnel)
        </label>
        <Textarea
          id="reason"
          placeholder="Dites-nous pourquoi vous êtes intéressé par notre application..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : "Rejoindre la liste d'attente"}
      </Button>

      <div className="text-center mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Déjà inscrit ?</p>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/auth")}
        >
          Se connecter
        </Button>
      </div>
    </form>
  );
};
