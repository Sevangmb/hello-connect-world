
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ModuleUnavailableProps {
  moduleCode: string;
}

export function ModuleUnavailable({ moduleCode }: ModuleUnavailableProps) {
  return (
    <div className="p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Module indisponible</AlertTitle>
        <AlertDescription>
          Le module <strong>{moduleCode}</strong> est actuellement désactivé. Contactez l'administrateur pour plus d'informations.
        </AlertDescription>
      </Alert>
    </div>
  );
}
