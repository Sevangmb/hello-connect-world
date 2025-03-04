
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("waitlist-subscribe", {
        body: { email, name, reason },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.already_registered) {
        toast({
          title: "Déjà inscrit",
          description: data.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Inscription réussie !",
          description: "Nous vous contacterons dès que le site sera ouvert.",
          variant: "default",
        });

        // Réinitialiser le formulaire
        setEmail("");
        setName("");
        setReason("");
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-white p-4">
      <div className="max-w-md w-full">
        <Card className="border shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">FRING - Liste d'attente</CardTitle>
            <CardDescription>
              Notre plateforme est actuellement en phase de développement. Inscrivez-vous pour être parmi les premiers à y accéder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nom (optionnel)</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Pourquoi êtes-vous intéressé(e) ? (optionnel)</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Partagez votre intérêt pour notre plateforme..."
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  "S'inscrire à la liste d'attente"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            <p>
              En vous inscrivant, vous acceptez de recevoir des emails concernant le lancement de notre plateforme.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Waitlist;
