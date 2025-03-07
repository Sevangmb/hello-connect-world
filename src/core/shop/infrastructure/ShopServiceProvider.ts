
import { IShopService } from "../application/interfaces/IShopService";
import { ShopServiceImpl } from "./ShopServiceImpl";
import { ShopRepository } from "./repositories/ShopRepository";
import { ShopItemRepository } from "./repositories/ShopItemRepository";
import { ShopReviewRepository } from "./repositories/ShopReviewRepository";
import { OrderRepository } from "./repositories/OrderRepository";

/**
 * Factory function to create and provide a ShopService instance
 */
export const provideShopService = (): IShopService => {
  const shopRepository = new ShopRepository();
  const shopItemRepository = new ShopItemRepository();
  const shopReviewRepository = new ShopReviewRepository();
  const orderRepository = new OrderRepository();

  return new ShopServiceImpl(
    shopRepository,
    shopItemRepository,
    shopReviewRepository,
    orderRepository
  );
};
