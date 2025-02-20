
export interface ClothesFormData {
  id?: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  image_url: string | null;
  brand: string;
  size: string;
  material: string;
  color: string;
  style: string;
  price: number | null;
  purchase_date: string;
  is_for_sale: boolean;
  needs_alteration: boolean;
}
