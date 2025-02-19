
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function CommunitySection() {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={() => navigate("/community")}
    >
      <Users className="mr-2 h-5 w-5" />
      Communauté
    </Button>
  );
}
