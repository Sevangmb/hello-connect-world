import React from 'react';
import { useParams } from 'react-router-dom';
import { useShopItem } from '@/hooks/useShop';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"
import { Link } from 'react-router-dom';

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { shopItem, isLoading, error } = useShopItem(id || '');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!shopItem) {
    return <div>Shop item not found.</div>;
  }

  const { name, description, price, image, shop_id } = shopItem;
  const shop = shopItem.shop;

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-center">
            <Avatar className="mx-auto" size="lg" src={shop.image_url || ""} name={shop.name} />
          </div>
          <div className="text-center">
            <Badge variant="secondary">Price: ${price}</Badge>
          </div>
          <Separator />
          <div className="text-center">
            <p>Shop: {shop.name}</p>
            <p>Owner: {shop.profiles?.full_name || 'N/A'}</p>
          </div>
          <Separator />
          <div className="flex justify-center">
            <Link to={`/shops/${shop_id}`}>
              <Button>View Shop</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopDetail;
