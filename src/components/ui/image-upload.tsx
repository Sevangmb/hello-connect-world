import React, { useState } from 'react';

export interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onUploading: (isUploading: boolean) => void;
}

export function ImageUpload({
  value,
  onChange,
  onUploading,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      if (onUploading) onUploading(true);

      // Upload logic would go here
      const file = files[0];
      // Mock upload for example
      setTimeout(() => {
        const mockUrl = URL.createObjectURL(file);
        setPreview(mockUrl);
        onChange(mockUrl);
        setUploading(false);
        if (onUploading) onUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
      if (onUploading) onUploading(false);
    }
  };

  return (
    <div className={`relative`}>
      {preview ? (
        <div className="relative w-full h-40 rounded-md overflow-hidden">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
            onClick={() => {
              setPreview('');
              onChange('');
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 2MB)</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}
