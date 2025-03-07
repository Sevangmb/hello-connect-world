
import React, { useState } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MenuItemForm } from "./MenuItemForm";
import { CreateMenuItemParams } from "@/services/menu/types";

interface MenuHeaderProps {
  onAddItem: (item: CreateMenuItemParams) => Promise<void>;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({ onAddItem }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Gestion des Menus</CardTitle>
        <Button onClick={handleOpenForm}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un élément
        </Button>
      </CardHeader>

      <MenuItemForm 
        open={isFormOpen} 
        onClose={handleCloseForm} 
        onSave={onAddItem} 
      />
    </>
  );
};
