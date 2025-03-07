
import React from "react";
import { Card } from "@/components/ui/card";

export const CalendarSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Calendrier d'utilisation</h2>
    <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
      <p className="text-gray-500">Calendrier à venir</p>
    </div>
  </Card>
);
