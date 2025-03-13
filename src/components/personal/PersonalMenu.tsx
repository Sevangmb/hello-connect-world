
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/navigation/useNavigation';
import { Shirt, Layers, Briefcase, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const PersonalMenu = () => {
  const { navigateTo, isActivePath } = useNavigation();

  const menuItems = [
    {
      id: 'wardrobe',
      label: 'Garde-robe',
      path: '/wardrobe',
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      id: 'outfits',
      label: 'Mes Tenues',
      path: '/outfits',
      icon: <Layers className="h-4 w-4" />,
    },
    {
      id: 'suitcases',
      label: 'Mes Valises',
      path: '/suitcases',
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      id: 'favorites',
      label: 'Mes Favoris',
      path: '/favorites',
      icon: <Heart className="h-4 w-4" />,
    },
    {
      id: 'profile',
      label: 'Mon Profil',
      path: '/profile',
      icon: <User className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex flex-col gap-1 w-full max-w-xs mx-auto">
      <div className="flex items-center justify-center py-3 mb-2 rounded-full bg-blue-100 text-blue-600 font-medium">
        <User className="h-4 w-4 mr-2" />
        Mon Univers
      </div>
      
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 rounded-md py-2 px-3",
            isActivePath(item.path) && "bg-blue-50 text-blue-600"
          )}
          onClick={() => navigateTo(item.path)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </div>
  );
};

export default PersonalMenu;
