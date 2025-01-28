import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/admin/login");
          return;
        }

        const { data: isAdmin, error } = await supabase.rpc('is_admin', {
          user_id: user.id
        });

        if (error || !isAdmin) {
          console.error("Erreur de vérification admin:", error);
          navigate("/admin/login");
        }
      } catch (error) {
        console.error("Erreur de vérification admin:", error);
        navigate("/admin/login");
      }
    };

    checkAdminAccess();
  }, [navigate]);

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}