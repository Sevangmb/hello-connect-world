
import type { ClothesItem } from "@/components/clothes/types";

export interface SuitcaseItemsManagerHookReturn {
  isAdding: boolean;
  isRemoving: boolean;
  addItem: (clothesId: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}
