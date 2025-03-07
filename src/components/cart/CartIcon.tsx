
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CartSidebar } from './CartSidebar';
import { useCart } from '@/hooks/cart';
import { useAuth } from '@/hooks/useAuth';

interface CartIconProps {
  className?: string;
}

export function CartIcon({
  className
}: CartIconProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();
  const { cartCount, isCartLoading } = useCart(user?.id || null);
  
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);

  // Fermer le panier avec la touche Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCart}
        className={className}
        aria-label="Ouvrir le panier"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center text-xs"
          >
            {cartCount}
          </Badge>
        )}
      </Button>
      
      {isCartOpen && <CartSidebar onClose={closeCart} />}
    </>
  );
}
