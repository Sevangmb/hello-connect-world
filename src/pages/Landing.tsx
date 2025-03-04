
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Login } from "@/modules/auth/components/Login";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [waitlistOpen, setWaitlistOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Si l'utilisateur est déjà connecté, le rediriger vers l'application
  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  // Vérifier si les inscriptions sont ouvertes
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'registration_open')
          .single();
        
        if (error) {
          console.error("Erreur lors de la vérification du statut des inscriptions:", error);
          return;
        }
        
        if (data && typeof data.value === 'object' && data.value !== null) {
          setWaitlistOpen(data.value.is_open === false);
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    
    checkRegistrationStatus();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Section de présentation */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Bienvenue sur FRING!
              </h1>
              <p className="text-xl text-gray-600">
                Découvrez une nouvelle façon de gérer votre garde-robe, de créer des tenues et de partager votre style.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Fonctionnalités principales</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <span className="text-primary font-semibold">✓</span>
                  </span>
                  <span>Organisez votre garde-robe virtuelle</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <span className="text-primary font-semibold">✓</span>
                  </span>
                  <span>Recevez des suggestions de tenues personnalisées</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <span className="text-primary font-semibold">✓</span>
                  </span>
                  <span>Participez à des défis de mode et récoltez des votes</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <span className="text-primary font-semibold">✓</span>
                  </span>
                  <span>Créez des valises intelligentes pour vos voyages</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Formulaire d'authentification ou préinscription */}
          <div className="w-full max-w-md mt-8 md:mt-0">
            <Card className="border shadow-lg">
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <img 
                    src="/lovable-uploads/9a2d6f53-d074-4690-bd16-a9c6c1e5f3c5.png" 
                    alt="FRING!" 
                    className="h-16 w-16 rounded-full"
                  />
                </div>
                
                {waitlistOpen ? (
                  <>
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
                      </form>
                    )}
                  </>
                ) : (
                  <Login />
                )}
              </div>
            </Card>
          </div>
        </div>
        
        {/* Section supplémentaire de présentation */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Comment ça fonctionne</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold mb-2">Créez votre garde-robe</h3>
              <p className="text-gray-600">Prenez en photo ou importez vos vêtements pour constituer votre garde-robe virtuelle.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold mb-2">Recevez des suggestions</h3>
              <p className="text-gray-600">Notre IA analyse votre style et la météo pour vous suggérer des tenues parfaites.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold mb-2">Partagez votre style</h3>
              <p className="text-gray-600">Participez à la communauté en partageant vos tenues et en découvrant celles des autres.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
