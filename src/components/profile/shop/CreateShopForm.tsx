import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { useShop } from "@/hooks/useShop";
import { Shop } from "@/core/shop/domain/types";

const CreateShopForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const createShop = useMutation(
    async (shopData: { name: string; description: string; image_url?: string }) => {
      return await shopApiGateway.createShop(shopData);
    },
    {
      onSuccess: () => {
        toast({
          title: "Shop created successfully!",
          description: "Your shop is now pending approval.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Failed to create shop",
          description: error.message,
          variant: "destructive",
        });
      },
    }
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isUploading) {
      toast({
        description: "Please wait for the image to finish uploading",
        variant: "destructive",
      });
      return;
    }
    
    createShop.mutate({
      name,
      description,
      image_url: imageUrl,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
          Shop Name
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter shop name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
          Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter shop description"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
          Image
        </label>
        <ImageUpload 
          value={imageUrl}
          onChange={(value) => setImageUrl(value)}
          onUploading={setIsUploading}
        />
      </div>
      <Button disabled={createShop.isLoading}>
        {createShop.isLoading ? "Creating..." : "Create Shop"}
      </Button>
    </form>
  );
};

export default CreateShopForm;
