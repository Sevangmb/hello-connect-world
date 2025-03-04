
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        setSubmitted(true);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/9a2d6f53-d074-4690-bd16-a9c6c1e5f3c5.png" 
                alt="FRING Logo" 
                className="h-16 w-16 rounded-full"
              />
            </div>
            <h1 className="text-2xl font-bold">Bienvenue sur FRING</h1>
            <p className="text-gray-600 mt-2">
              Nous sommes en cours de préparation pour le lancement. Inscrivez-vous pour être informé dès que nous serons prêts!
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="bg-primary/10 text-primary p-3 rounded-lg inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Merci pour votre inscription!</h3>
              <p className="text-gray-600">
                Nous vous contacterons dès que notre application sera disponible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Waitlist;
