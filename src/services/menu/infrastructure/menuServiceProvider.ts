
import { SupabaseMenuRepository } from "./SupabaseMenuRepository";
import { MenuUseCase } from "../application/MenuUseCase";

// Singleton instance du repository
const menuRepository = new SupabaseMenuRepository();

// Singleton instance du use case
const menuUseCase = new MenuUseCase(menuRepository);

// Fonction pour obtenir l'instance du use case
export const getMenuUseCase = () => menuUseCase;
