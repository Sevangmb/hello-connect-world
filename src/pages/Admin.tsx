import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data: isAdmin } = await supabase.rpc('is_admin', {
          user_id: user.id
        });

        if (!isAdmin) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        navigate("/auth");
      }
    };

    checkAdminAccess();
  }, [navigate]);

  return null; // This component now only handles authentication, routing is managed by App.tsx
}
