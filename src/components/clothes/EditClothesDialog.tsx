import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditClothesForm } from "./EditClothesForm";

type Clothes = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
};

type EditClothesDialogProps = {
  clothes: Clothes;
  trigger: React.ReactNode;
};

export const EditClothesDialog = ({ clothes, trigger }: EditClothesDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le vêtement</DialogTitle>
        </DialogHeader>
        <EditClothesForm
          clothesId={clothes.id}
          initialData={{
            name: clothes.name,
            description: clothes.description || "",
            category: clothes.category,
            image_url: clothes.image_url,
          }}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
