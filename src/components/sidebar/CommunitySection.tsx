
import { Users, MessageSquare, Store, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function CommunitySection() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Users className="mr-2 h-5 w-5" />
        Communauté
      </Button>
      
      {isExpanded && (
        <div className="ml-6 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/messages")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/shops")}
          >
            <Store className="mr-2 h-4 w-4" />
            Boutiques
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </div>
      )}
    </div>
  );
}
