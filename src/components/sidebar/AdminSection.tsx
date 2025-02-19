
import { Shield, Users, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AdminSection() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(!!profile?.is_admin);
      }
    };
    
    checkAdmin();
  }, []);

  if (!isAdmin) return null;
  
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Shield className="mr-2 h-5 w-5" />
        Admin
      </Button>
      
      {isExpanded && (
        <div className="ml-6 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/admin/users")}
          >
            <Users className="mr-2 h-4 w-4" />
            Gestion utilisateurs
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/admin/content")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Gestion contenu
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/admin/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Paramètres admin
          </Button>
        </div>
      )}
    </div>
  );
}
