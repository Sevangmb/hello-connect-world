
import React from "react";

export const WaitlistSuccess: React.FC = () => {
  return (
    <div className="text-center py-4 space-y-4">
      <div className="bg-primary/10 text-primary p-3 rounded-lg inline-block dark:bg-primary/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold dark:text-white">Merci pour votre inscription!</h3>
      <p className="text-gray-600 dark:text-gray-300">
        Nous vous contacterons dès que notre application sera disponible.
      </p>
    </div>
  );
};
