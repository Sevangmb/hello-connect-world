
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Login } from "@/modules/auth/components/Login";
import { WaitlistForm } from "./WaitlistForm";
import { WaitlistSuccess } from "./WaitlistSuccess";

interface AuthCardProps {
  waitlistOpen: boolean;
}

export const AuthCard: React.FC<AuthCardProps> = ({ waitlistOpen }) => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="border shadow-lg">
      <div className="p-6">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/9a2d6f53-d074-4690-bd16-a9c6c1e5f3c5.png" 
            alt="FRING!" 
            className="h-16 w-16 rounded-full"
          />
        </div>
        
        {waitlistOpen ? (
          <>
            {submitted ? (
              <WaitlistSuccess />
            ) : (
              <WaitlistForm onSubmitSuccess={() => setSubmitted(true)} />
            )}
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-4">Accéder à votre compte</h3>
            <Login />
          </div>
        )}
      </div>
    </Card>
  );
};
