
import { useQuery } from '@tanstack/react-query';
import { cartRepository } from '@/core/shop/infrastructure/repositories/CartRepository';

export function useCartCount(userId: string | null) {
  const {
    data: cartCount = 0,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['cartCount', userId],
    queryFn: async () => {
      if (!userId) return 0;
      return await cartRepository.getCartCount(userId);
    },
    enabled: !!userId,
  });

  return {
    cartCount,
    isLoading,
    refetch
  };
}
