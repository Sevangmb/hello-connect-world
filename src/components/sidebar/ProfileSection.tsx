
import { UserCircle, Settings, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function ProfileSection() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <UserCircle className="mr-2 h-5 w-5" />
        Profil
      </Button>
      
      {isExpanded && (
        <div className="ml-6 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/profile/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Paramètres du profil
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/help")}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Aide
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/support")}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Support
          </Button>
        </div>
      )}
    </div>
  );
}
