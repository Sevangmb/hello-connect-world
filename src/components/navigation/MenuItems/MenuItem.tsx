
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MenuItemProps {
  label: string;
  path: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  variant?: "default" | "horizontal";
}

/**
 * Reusable menu item component for both MainMenu and UnifiedRightMenu
 */
export const MenuItem: React.FC<MenuItemProps> = ({ 
  label, 
  icon, 
  active, 
  onClick,
  variant = "default"
}) => {
  if (variant === "horizontal") {
    return (
      <Button
        variant={active ? "default" : "ghost"}
        size="sm"
        className={cn(
          active ? "bg-primary/10 text-primary" : ""
        )}
        onClick={onClick}
      >
        {label}
      </Button>
    );
  }

  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      className={cn(
        "w-full justify-start gap-2",
        active ? "bg-primary/10 text-primary" : ""
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

export default MenuItem;
