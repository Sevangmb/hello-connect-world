
import React from "react";

export const LoginFooter: React.FC = () => {
  return (
    <p className="text-center text-sm text-gray-600 mt-4">
      Pas encore de compte? {" "}
      <a href="/waitlist" className="text-primary hover:underline font-medium">
        Rejoindre la liste d'attente
      </a>
    </p>
  );
};
