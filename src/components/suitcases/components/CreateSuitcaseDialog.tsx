
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateSuitcaseForm } from '../forms/CreateSuitcaseForm';
import { CreateSuitcaseData } from '../types';

interface CreateSuitcaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSuitcaseData) => void;
  isLoading?: boolean;
}

export const CreateSuitcaseDialog: React.FC<CreateSuitcaseDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
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
          onSuccess={onClose}
          isSubmitting={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
