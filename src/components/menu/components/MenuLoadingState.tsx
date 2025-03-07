
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const MenuLoadingState: React.FC = () => {
  return (
    <div className="space-y-2 p-1">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-full rounded" />
      ))}
    </div>
  );
};
