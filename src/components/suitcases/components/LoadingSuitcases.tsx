
import { Loader2 } from "lucide-react";

interface LoadingSuitcasesProps {
  message?: string;
}

export const LoadingSuitcases = ({ 
  message = "Chargement de vos valises..."
}: LoadingSuitcasesProps) => {
  return (
    <div className="flex justify-center py-16">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
