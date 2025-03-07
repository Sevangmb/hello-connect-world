
import React from "react";
import { Shield } from "lucide-react";
import { DynamicMenu } from "@/components/menu/DynamicMenu";

interface AdminMenuSectionProps {
  isUserAdmin: boolean;
}

const AdminMenuSection: React.FC<AdminMenuSectionProps> = ({ isUserAdmin }) => {
  if (!isUserAdmin) return null;
  
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="px-3 py-2 mb-2 flex items-center text-sm font-semibold text-primary">
        <Shield className="h-4 w-4 mr-2" />
        <span>Administration</span>
      </div>
      
      <DynamicMenu 
        category="admin" 
        moduleCode="admin" 
        className="px-1" 
        hierarchical={true} 
      />
    </div>
  );
};

export default AdminMenuSection;
