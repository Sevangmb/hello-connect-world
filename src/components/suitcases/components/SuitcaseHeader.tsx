
import { CreateSuitcaseDialog } from "@/components/suitcases/CreateSuitcaseDialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface SuitcaseHeaderProps {
  onRefresh: () => void;
}

export const SuitcaseHeader = ({ onRefresh }: SuitcaseHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Mes Valises</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos valises et organisez vos vêtements pour chaque voyage
        </p>
      </div>
      
      <div className="flex gap-2">
        <CreateSuitcaseDialog />
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefresh}
          title="Rafraîchir"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
