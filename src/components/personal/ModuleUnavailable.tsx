
import React from "react";
import { Card } from "@/components/ui/card";

interface ModuleUnavailableProps {
  name: string;
}

export const ModuleUnavailable = ({ name }: ModuleUnavailableProps) => (
  <Card className="p-6 bg-amber-50 border-amber-200">
    <h2 className="text-amber-800 font-semibold mb-2">Module {name} indisponible</h2>
    <p className="text-amber-700">
      Ce module est actuellement désactivé ou en cours de maintenance.
    </p>
  </Card>
);
