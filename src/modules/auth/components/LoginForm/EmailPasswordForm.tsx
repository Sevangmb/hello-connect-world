
import React from "react";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { LoginButton } from "./LoginButton";
import { LoginFooter } from "./LoginFooter";

interface EmailPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const EmailPasswordForm: React.FC<EmailPasswordFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <EmailField 
        email={email} 
        onChange={(e) => setEmail(e.target.value)} 
        isSubmitting={isSubmitting} 
      />
      <PasswordField 
        password={password} 
        onChange={(e) => setPassword(e.target.value)} 
        isSubmitting={isSubmitting} 
      />
      <LoginButton isSubmitting={isSubmitting} />
      <LoginFooter />
    </form>
  );
};
