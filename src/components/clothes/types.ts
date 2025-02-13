
export interface ClothesFormData {
  id?: string;
  name: string;
  description: string;
  category: string;
  image_url: string | null;
  brand: string;
  size: string;
  material: string;
  color: string;
  style: string;
  price: string | number;
  purchase_date: string;
  is_for_sale: boolean;
  needs_alteration: boolean;
}

