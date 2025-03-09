
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateSuitcaseForm } from './forms/CreateSuitcaseForm';

interface CreateSuitcaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const CreateSuitcaseDialog: React.FC<CreateSuitcaseDialogProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle valise</DialogTitle>
        </DialogHeader>
        <CreateSuitcaseForm 
          onSubmit={onSubmit} 
          onCancel={onClose}
          isSubmitting={false}
        />
      </DialogContent>
    </Dialog>
  );
};
