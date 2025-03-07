
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CategoryGroup from "./CategoryGroup";

interface AdminMenuSectionProps {
  isUserAdmin: boolean;
}

export const AdminMenuSection: React.FC<AdminMenuSectionProps> = ({ isUserAdmin }) => {
  const navigate = useNavigate();

  if (!isUserAdmin) {
    return null;
  }

  const handleNavigateToAdmin = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate('/admin');
  };

  return (
    <>
      <CategoryGroup title="Administration" category="admin" />
      <div className="px-3 py-2 mt-2">
        <Button 
          onClick={handleNavigateToAdmin}
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
