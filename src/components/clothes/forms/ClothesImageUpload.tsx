
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, ScanLine } from "lucide-react";

interface ClothesImageUploadProps {
  onImageUrlChange: (url: string | null) => void;
  onUploadStateChange: (uploading: boolean) => void;
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

export const ClothesImageUpload = ({ onImageUrlChange, onUploadStateChange }: ClothesImageUploadProps) => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    onUploadStateChange(true);
    // Simulate image upload
    setTimeout(() => {
      onImageUrlChange("https://example.com/placeholder.jpg");
      onUploadStateChange(false);
    }, 1000);
  };

  const handleScanLabel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    onUploadStateChange(true);
    // Simulate label scanning
    setTimeout(() => {
      onUploadStateChange(false);
    }, 1000);
  };

  return (
    <div className="space-y-2">
      <Label>Images</Label>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <UploadButton uploading={false} onChange={handleImageUpload} />
          <ScanButton scanning={false} onChange={handleScanLabel} />
        </div>
      </div>
    </div>
  );
};
