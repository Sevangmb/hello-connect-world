
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ClothesForm from '@/components/clothes/ClothesForm';
import { ClothesFormData } from '@/components/clothes/types';
import { PlusCircle } from 'lucide-react';

const Clothes = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ClothesFormData>({
    name: '',
    description: '',
    category: '',
    image_url: null,
    brand: '',
    size: '',
    material: '',
    color: '',
    style: '',
    price: null,
    purchase_date: '',
    is_for_sale: false,
    needs_alteration: false,
    weather_categories: [],
  });

  const handleFormChange = (field: keyof ClothesFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    setDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mes vêtements</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className="mr-2 h-5 w-5" />
              Ajouter un vêtement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogTitle>Ajouter un nouveau vêtement</DialogTitle>
            <ClothesForm 
              formData={formData}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
              onSuccess={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* The rest of the Clothes page content */}
    </div>
  );
};

export default Clothes;
