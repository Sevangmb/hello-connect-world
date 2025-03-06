
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "Une erreur est survenue",
  message = "Nous n'avons pas pu charger les données. Veuillez réessayer.",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800/30">
      <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">{title}</h3>
      <p className="text-sm text-red-600 dark:text-red-300 mb-4">{message}</p>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="mt-2 border-red-200 hover:bg-red-100 dark:border-red-800/50 dark:hover:bg-red-900/30"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      )}
    </div>
  );
};
