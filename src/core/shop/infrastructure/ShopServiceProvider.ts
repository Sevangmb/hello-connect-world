
import { ShopRepository } from "./ShopRepository";
import { ShopService } from "../application/ShopService";

// Créer des instances uniques pour l'application
const shopRepository = new ShopRepository();
const shopService = new ShopService(shopRepository);

// Exporter le service
export const getShopService = () => shopService;
