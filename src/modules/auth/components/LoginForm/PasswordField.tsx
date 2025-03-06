
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordFieldProps {
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

export const PasswordField = ({ password, onChange, isSubmitting }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="password" className="text-sm font-medium">
          Mot de passe
        </Label>
        <a 
          href="/auth/reset-password"
          className="text-xs text-primary hover:underline"
        >
          Mot de passe oublié?
        </a>
      </div>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={onChange}
          disabled={isSubmitting}
          className="w-full pr-10"
          required
          autoComplete="current-password"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>
    </div>
  );
};
