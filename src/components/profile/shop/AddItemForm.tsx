
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ui/image-upload';
import { useShop } from '@/hooks/useShop';
import { useNavigate } from 'react-router-dom';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useClothes } from '@/hooks/useClothes';

const AddItemForm = ({ shop }) => {
  const { toast } = useToast();
  const { addShopItem } = useShop();
  const { clothes: userClothes, isLoading: isLoadingClothes } = useClothes();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [selectedClothing, setSelectedClothing] = useState('');
  const [isNewItem, setIsNewItem] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set item details from selected clothing
  useEffect(() => {
    if (selectedClothing && !isNewItem) {
      const clothing = userClothes.find(c => c.id === selectedClothing);
      if (clothing) {
        setName(clothing.name || '');
        setDescription(clothing.description || '');
        setImageUrl(clothing.image_url || '');
        // Set a default price if no price is set
        if (clothing.price) {
          setPrice(clothing.price.toString());
          // Set original price slightly higher for demonstration
          setOriginalPrice((clothing.price * 1.2).toFixed(2));
        }
      }
    }
  }, [selectedClothing, userClothes, isNewItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de l'article est requis",
        variant: "destructive",
      });
      return;
    }

    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez spécifier un prix valide",
        variant: "destructive",
      });
      return;
    }

    if (isUploading) {
      toast({
        title: "Attention",
        description: "Veuillez attendre la fin du téléchargement de l'image",
      });
      return;
    }

    if (!shop || !shop.id) {
      toast({
        title: "Erreur",
        description: "Information de boutique manquante",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const itemData = {
        name,
        description,
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : undefined,
        stock: Number(stock),
        shop_id: shop.id,
        clothes_id: isNewItem ? null : selectedClothing,
        image_url: imageUrl
      };
      
      await addShopItem(itemData);
      
      toast({
        title: "Succès",
        description: "L'article a été ajouté à votre boutique",
      });
      
      // Redirect to shop dashboard
      navigate(`/profile/shop`);
    } catch (error) {
      console.error("Error adding shop item:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'article",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Ajouter un article</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-x-4 flex">
          <Button 
            type="button" 
            variant={isNewItem ? "default" : "outline"}
            onClick={() => setIsNewItem(true)}
            className="flex-1"
          >
            Nouvel article
          </Button>
          <Button 
            type="button" 
            variant={!isNewItem ? "default" : "outline"}
            onClick={() => setIsNewItem(false)}
            className="flex-1"
          >
            À partir de ma garde-robe
          </Button>
        </div>

        {!isNewItem && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Sélectionner un vêtement
            </label>
            <Select 
              value={selectedClothing} 
              onValueChange={setSelectedClothing}
              disabled={isLoadingClothes}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un vêtement" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingClothes ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : userClothes && userClothes.length > 0 ? (
                  userClothes.map((clothing) => (
                    <SelectItem key={clothing.id} value={clothing.id}>
                      {clothing.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty" disabled>Aucun vêtement disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Nom de l'article
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de l'article"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'article"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium">
                Prix (€)
              </label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="39.99"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="originalPrice" className="block text-sm font-medium">
                Prix original (optionnel)
              </label>
              <Input
                id="originalPrice"
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="49.99"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="stock" className="block text-sm font-medium">
              Quantité en stock
            </label>
            <Input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="1"
              min="1"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Image de l'article
            </label>
            <ImageUpload
              onChange={(url) => setImageUrl(url)}
              onUploading={setIsUploading}
              bucket="shop_items"
              folder="images"
              currentImageUrl={imageUrl}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? 'Ajout en cours...' : 'Ajouter l\'article'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddItemForm;
