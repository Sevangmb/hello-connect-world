
import { Compass, Search, Hash, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function ExploreSection() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Compass className="mr-2 h-5 w-5" />
        Explorer
      </Button>
      
      {isExpanded && (
        <div className="ml-6 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/search")}
          >
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/hashtags")}
          >
            <Hash className="mr-2 h-4 w-4" />
            Hashtags
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/suggestions")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Suggestions
          </Button>
        </div>
      )}
    </div>
  );
}
