
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  imageUrl: string | null;
  onImageUpload: (file: File) => Promise<void>;
  loading?: boolean;
  className?: string;
}

export const ImageUploader = ({ label, imageUrl, onImageUpload, loading = false, className = "" }: ImageUploaderProps) => {
  const inputId = `upload-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImageUpload(file);
        }}
        className="hidden"
        id={inputId}
      />
      {imageUrl ? (
        <div className="relative aspect-square">
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-full object-cover rounded-lg"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-2 right-2"
            disabled={loading}
            asChild
          >
            <label htmlFor={inputId}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </label>
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full aspect-square"
          asChild
        >
          <label htmlFor={inputId} className="cursor-pointer">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <>Télécharger {label}</>
            )}
          </label>
        </Button>
      )}
    </div>
  );
};
