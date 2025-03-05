
import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-col space-y-2" : "space-x-6",
          className
        )}
        role="group"
        {...props}
      />
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup };
