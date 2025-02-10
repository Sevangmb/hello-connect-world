import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Shop() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();

  const { data: shop, isLoading, isError } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: async () => {
      if (!shopId) throw new Error("Shop ID is missing");

      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("id", shopId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!shopId,
  });

  useEffect(() => {
    if (isError) {
      const timeout = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Chargement...</p>
      </div>
    );
  }

  if (isError || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Boutique introuvable</h1>
          <p className="text-muted-foreground mb-4">
            La boutique que vous essayez de consulter n'existe pas ou a été supprimée.
          </p>
          <p className="text-muted-foreground mb-4">
            Vous serez redirigé vers la page d'accueil dans quelques secondes.
          </p>
          <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <div className="max-w-4xl mx-auto pt-24 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">{shop.name}</h1>
          <p className="text-gray-600 mb-4">{shop.description}</p>
          {shop.address && (
            <p className="text-gray-600 mb-2">
              <strong>Adresse:</strong> {shop.address}
            </p>
          )}
          {shop.phone && (
            <p className="text-gray-600 mb-2">
              <strong>Téléphone:</strong> {shop.phone}
            </p>
          )}
          {shop.website && (
            <p className="text-gray-600">
              <strong>Site web:</strong>{" "}
              <a
                href={shop.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {shop.website}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
