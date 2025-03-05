
import { Dispatch, SetStateAction } from 'react';

export interface ImageUploadProps {
  onChange: (url: string) => void;
  onUploading: Dispatch<SetStateAction<boolean>>;
  currentImageUrl?: string;
}
