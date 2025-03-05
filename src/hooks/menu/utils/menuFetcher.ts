import { IMenuRepository } from "@/services/menu/domain/interfaces/IMenuRepository";
import { MenuRepository } from "@/services/menu/infrastructure/MenuRepository";
import { Module } from "@/hooks/modules/types";

const menuRepository: IMenuRepository = new MenuRepository();

export const fetchMenuItems = async () => {
  try {
    const menuItems = await menuRepository.getAllMenuItems();
    return menuItems;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
};
