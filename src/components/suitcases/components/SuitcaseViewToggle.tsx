
import { Button } from "@/components/ui/button";
import { LayoutGrid, GripVertical, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuitcaseViewToggleProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export const SuitcaseViewToggle = ({
  viewMode,
  setViewMode,
}: SuitcaseViewToggleProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => setViewMode("grid")}
        title="Vue en grille"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => setViewMode("list")}
        title="Vue en liste"
      >
        <GripVertical className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate("/suitcase-calendar")}
        title="Vue calendrier"
      >
        <CalendarDays className="h-4 w-4" />
      </Button>
    </div>
  );
};
