
import { IMenuRepository } from "@/services/menu/domain/interfaces/IMenuRepository";
import { menuRepository } from "@/services/menu/infrastructure/SupabaseMenuRepository";
import { Module } from "@/hooks/modules/types";

export const fetchMenuItems = async () => {
  try {
    const menuItems = await menuRepository.getAllMenuItems();
    return menuItems;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
};
