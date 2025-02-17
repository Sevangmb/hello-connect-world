import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, ScanLine } from "lucide-react";
import { ClothesFormData } from "../types";
import { useLabelScanner } from "@/hooks/useLabelScanner";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ClothesImageUploadProps {
  formData: ClothesFormData;
  onFormChange: (field: keyof ClothesFormData, value: any) => void;
}

const ImagePreview = ({ imageUrl }: { imageUrl: string }) => (
  <img
    src={imageUrl}
    alt="Preview"
    className="w-20 h-20 object-cover rounded-md"
  />
);

const UploadButton = ({ uploading, onChange }: { uploading: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <Input
      type="file"
      accept="image/*"
      onChange={onChange}
      disabled={uploading}
      className="hidden"
      id="image-upload"
    />
    <Button
      type="button"
      variant="outline"
      asChild
      disabled={uploading}
    >
      <label htmlFor="image-upload" className="cursor-pointer">
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Chargement...
          </>
        ) : (
          <>
            <Camera className="w-4 h-4 mr-2" />
            Ajouter une image
          </>
        )}
      </label>
    </Button>
  </div>
);

const ScanButton = ({ scanning, onChange }: { scanning: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <Input
      type="file"
      accept="image/*"
      onChange={onChange}
      disabled={scanning}
      className="hidden"
      id="label-scan"
    />
    <Button
      type="button"
      variant="outline"
      asChild
      disabled={scanning}
    >
      <label htmlFor="label-scan" className="cursor-pointer">
        {scanning ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyse...
          </>
        ) : (
          <>
            <ScanLine className="w-4 h-4 mr-2" />
            Scanner l'étiquette
          </>
        )}
      </label>
    </Button>
  </div>
);

export const ClothesImageUpload = ({ formData, onFormChange }: ClothesImageUploadProps) => {
  const { scanLabel, scanning } = useLabelScanner(onFormChange);
  const { uploadImage, uploading } = useImageUpload((url) => onFormChange('image_url', url));

  return (
    <div className="space-y-2">
      <Label>Images</Label>
      <div className="flex items-center gap-4">
        {formData.image_url && <ImagePreview imageUrl={formData.image_url} />}
        <div className="flex gap-2">
          <UploadButton uploading={uploading} onChange={uploadImage} />
          <ScanButton scanning={scanning} onChange={scanLabel} />
        </div>
      </div>
    </div>
  );
};
