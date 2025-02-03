import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-white z-50">
      <div className="container h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/public/lovable-uploads/9a2d6f53-d074-4690-bd16-a9c6c1e5f3c5.png"
            alt="FRING!"
            className="h-12 w-12 rounded-full"
          />
          <span className="text-xl font-bold text-custom-rust">FRING!</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/explore">Explorer</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/personal">Mon Univers</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/friends">Social</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}