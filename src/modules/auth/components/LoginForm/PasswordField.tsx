
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordFieldProps {
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ 
  password, 
  onChange, 
  isSubmitting 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={onChange}
          placeholder="••••••••"
          required
          className="pr-10"
          disabled={isSubmitting}
        />
        <button
          type="button" 
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          disabled={isSubmitting}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <div className="text-right">
        <a href="#" className="text-xs text-primary hover:underline">
          Mot de passe oublié?
        </a>
      </div>
    </div>
  );
};
