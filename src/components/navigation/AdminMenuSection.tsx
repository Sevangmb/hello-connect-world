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
  const {
    navigateTo
  } = useNavigation();

  // Retourner null si l'utilisateur n'est pas admin
  if (!isUserAdmin) {
    return null;
  }

  // Utiliser le hook de navigation pour la navigation
  const handleNavigateToAdmin = (event: React.MouseEvent) => {
    navigateTo('/admin', event);
  };
  return <>
      <CategoryGroup title="Administration" category="admin" />
      
    </>;
};
export default AdminMenuSection;