
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export function ShopSection() {
  const navigate = useNavigate();
  const { data: shop, isLoading } = useQuery({
    queryKey: ['myShop'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!shop) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Vous n'avez pas encore de boutique</h3>
          <p className="text-muted-foreground mb-4">
            Créez votre boutique pour commencer à vendre vos vêtements
          </p>
          <Button onClick={() => navigate("/shops/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Créer ma boutique
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{shop.name}</h3>
            <p className="text-muted-foreground">{shop.description}</p>
          </div>
          <Button onClick={() => navigate(`/shops/${shop.id}`)}>
            Voir ma boutique
          </Button>
        </div>
      </div>
    </Card>
  );
}
