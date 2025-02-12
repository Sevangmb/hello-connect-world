export interface ClothesFormData {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  color: string;
  material: string;
  size: string; // Ajoutez cette ligne
  image_url: string;
  is_for_sale: boolean;
  needs_alteration: boolean;
  archived: boolean;
  created_at: string;
  user_id: string;
  price: number;
}
