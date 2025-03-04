
import React from "react";
import { Input } from "@/components/ui/input";

interface EmailFieldProps {
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

export const EmailField: React.FC<EmailFieldProps> = ({
  email,
  onChange,
  isSubmitting
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium">Email</label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={onChange}
        placeholder="votre@email.com"
        required
        disabled={isSubmitting}
      />
    </div>
  );
};
