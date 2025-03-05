
import { Dispatch, SetStateAction } from 'react';

export interface ImageUploadProps {
  onChange: (url: string) => void;
  onUploading: Dispatch<SetStateAction<boolean>>;
  defaultValue?: string;
  currentImageUrl?: string;
  bucket?: string;
  folder?: string;
}

export declare const ImageUpload: React.FC<ImageUploadProps>;
