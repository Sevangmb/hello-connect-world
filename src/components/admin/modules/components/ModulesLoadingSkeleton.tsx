
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ModulesLoadingSkeleton: React.FC = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </CardContent>
    </Card>
  );
};
