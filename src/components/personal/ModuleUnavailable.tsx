
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ModuleUnavailableProps {
  name: string;
}

export const ModuleUnavailable: React.FC<ModuleUnavailableProps> = ({ name }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <ShieldAlert className="w-12 h-12 text-amber-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Module non disponible</h2>
      <p className="text-muted-foreground mb-6">
        Le module "{name}" n'est pas activé. Contactez votre administrateur pour activer cette fonctionnalité.
      </p>
      <Button onClick={() => navigate('/personal')}>
        Retour à mon univers
      </Button>
    </div>
  );
};
