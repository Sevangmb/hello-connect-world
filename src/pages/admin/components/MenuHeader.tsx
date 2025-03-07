
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MenuHeaderProps {
  onAddItem: () => void;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({ onAddItem }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-bold">Gestion des Menus</CardTitle>
      <Button onClick={onAddItem}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un élément
      </Button>
    </CardHeader>
  );
};
