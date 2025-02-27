
import { Loader2 } from "lucide-react";

export const LoadingSuitcases = () => {
  return (
    <div className="flex justify-center py-16">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement de vos valises...</p>
      </div>
    </div>
  );
};
