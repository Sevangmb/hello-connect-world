
import React from "react";
import { Button } from "@/components/ui/button";
import CategoryGroup from "./CategoryGroup";
import { useNavigation } from "./hooks/useNavigation";

interface AdminMenuSectionProps {
  isUserAdmin: boolean;
}

export const AdminMenuSection: React.FC<AdminMenuSectionProps> = ({
  isUserAdmin
}) => {
  const { navigateTo } = useNavigation();

  // Retourner null si l'utilisateur n'est pas admin
  if (!isUserAdmin) {
    return null;
  }

  // Gérer le clic sur le bouton de console d'administration
  const handleAdminConsoleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log("Navigation vers la console d'admin");
    navigateTo('/admin/dashboard', event);
  };

  return (
    <>
      <CategoryGroup title="Administration" category="admin" />
      <div className="px-3 py-2 mt-2">
        <Button 
          onClick={handleAdminConsoleClick}
          variant="outline" 
          className="w-full bg-primary/5 hover:bg-primary/10 text-primary"
        >
          Console d'administration
        </Button>
      </div>
    </>
  );
};

export default AdminMenuSection;
