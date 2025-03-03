
import React from "react";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <div className={`font-bold ${sizeClasses[size]} ${className}`}>
      Wardrobe<span className="text-blue-600">App</span>
    </div>
  );
};
