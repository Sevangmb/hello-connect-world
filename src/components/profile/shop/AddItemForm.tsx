import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useShop } from '@/hooks/useShop';
import { Loader2 } from 'lucide-react';

interface AddItemFormProps {
  shopId: string;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  description: z.string().optional(),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number',
  }),
  stock: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Stock must be a non-negative number',
  }),
  image_url: z.string().optional(),
});

export const AddItemForm: React.FC<AddItemFormProps> = ({ shopId, onSuccess }) => {
  const { toast } = useToast();
  const { useCreateShopItem } = useShop();
  const { mutate: createItem, isPending } = useCreateShopItem();
  const [imageUploading, setImageUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '1',
      image_url: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createItem({
      shop_id: shopId,
      name: values.name,
      description: values.description || '',
      price: Number(values.price),
      stock: Number(values.stock),
      image_url: values.image_url || '',
      status: 'available',
    }, {
      onSuccess: () => {
        toast({
          title: 'Item created',
          description: 'Your item has been added to your shop',
        });
        onSuccess();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: `Failed to create item: ${error.message}`,
          variant: 'destructive',
        });
      },
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      // Image upload logic would go here
      // For now, just simulate a delay and set a placeholder URL
      await new Promise(resolve => setTimeout(resolve, 1000));
      const imageUrl = URL.createObjectURL(file);
      
      form.setValue('image_url', imageUrl);
      toast({
        title: 'Image uploaded',
        description: 'Your image has been uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Add New Item</h2>
        <p className="text-sm text-muted-foreground">
          Fill out the form below to add a new item to your shop.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Item name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your item" 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0.01" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="1" 
                      placeholder="1" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                    />
                    <Input 
                      type="text" 
                      placeholder="Or enter image URL" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {form.watch('image_url') && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Preview:</p>
              <img 
                src={form.watch('image_url')} 
                alt="Preview" 
                className="w-full max-h-40 object-contain border rounded-md" 
              />
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onSuccess()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || imageUploading}
            >
              {(isPending || imageUploading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Item
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
