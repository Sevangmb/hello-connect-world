
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MenuLoadingStateProps {
  count?: number;
  className?: string;
}

export const MenuLoadingState: React.FC<MenuLoadingStateProps> = ({
  count = 3,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center space-x-2 p-2 h-9">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
      ))}
    </div>
  );
};
