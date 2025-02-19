
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ProfileSection() {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={() => navigate("/profile")}
    >
      <User className="mr-2 h-5 w-5" />
      Profil
    </Button>
  );
}
