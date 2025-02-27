
export interface SuitcaseItemsManagerHookReturn {
  isAdding: boolean;
  isRemoving: boolean;
  isAddingBulk: boolean;
  addItem: (clothesId: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  addSuggestedClothes: (clothesIds: string[]) => Promise<void>;
}
