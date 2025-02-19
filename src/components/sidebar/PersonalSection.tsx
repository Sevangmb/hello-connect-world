
import { User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export function PersonalSection() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => navigate("/personal")}
      >
        <User className="mr-2 h-5 w-5" />
        Personnel
      </Button>
    </div>
  );
}
