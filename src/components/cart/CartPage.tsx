
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/cart';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { CheckoutButton } from '@/components/shop/CheckoutButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    cartItems,
    isCartLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal
  } = useCart(user?.id || null);

  const handleClearCart = () => {
    if (user) {
      clearCart.mutate(user.id);
    }
  };

  if (isCartLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Chargement de votre panier</h2>
          <p className="text-muted-foreground">Veuillez patienter...</p>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Votre panier est vide</h2>
          <p className="text-muted-foreground mb-6">
            Explorez notre marketplace pour découvrir des produits uniques et commencer à remplir votre panier.
          </p>
          <Button onClick={() => navigate('/boutiques')}>
            Découvrir des produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Mon panier</h1>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto text-destructive"
          onClick={handleClearCart}
          disabled={clearCart.isPending}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Vider le panier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-32 h-32 shrink-0">
                    {item.shop_items.image_url ? (
                      <img
                        src={item.shop_items.image_url}
                        alt={item.shop_items.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <ShoppingCart className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex-1">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{item.shop_items.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          Boutique: {item.shop?.name || "Inconnue"}
                        </p>
                        <p className="text-xl font-bold mt-2">
                          {formatPrice(item.shop_items.price)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={updateQuantity.isPending}
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity.mutate({
                                  cartItemId: item.id,
                                  quantity: item.quantity - 1
                                });
                              }
                            }}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={updateQuantity.isPending}
                            onClick={() => 
                              updateQuantity.mutate({
                                cartItemId: item.id,
                                quantity: item.quantity + 1
                              })
                            }
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeFromCart.mutate(item.id)}
                          disabled={removeFromCart.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span>Calculés à la prochaine étape</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <CheckoutButton 
                cartItems={cartItems.map(item => ({ 
                  id: item.id, 
                  quantity: item.quantity 
                }))}
                isLoading={isCartLoading}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
