
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ModuleUnavailableProps {
  name: string;
}

export const ModuleUnavailable = ({ name }: ModuleUnavailableProps) => (
  <Card className="p-6 bg-amber-50 border-amber-200">
    <div className="flex items-center gap-2 text-amber-800 font-semibold mb-2">
      <AlertTriangle className="h-5 w-5" />
      <h2>Module {name} indisponible</h2>
    </div>
    <p className="text-amber-700">
      Ce module est actuellement désactivé ou en cours de maintenance.
    </p>
  </Card>
);
