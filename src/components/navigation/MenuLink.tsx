
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { useNavigation } from './hooks/useNavigation';

interface MenuLinkProps {
  path: string;
  name: string;
  icon?: string | null;
  isActive?: boolean;
  className?: string;
}

/**
 * Composant MenuLink - lien de menu avancé avec gestion d'état actif
 */
export const MenuLink: React.FC<MenuLinkProps> = ({
  path,
  name,
  icon = null,
  isActive: forcedActiveState,
  className
}) => {
  const { navigateTo, isActivePath } = useNavigation();
  
  // Utiliser l'état actif fourni ou le calculer
  const active = forcedActiveState !== undefined 
    ? forcedActiveState 
    : isActivePath(path);
  
  // Récupérer l'icône Lucide si spécifiée
  const getIcon = () => {
    if (!icon) return null;
    
    // @ts-ignore - Les icônes sont dynamiques
    const IconComponent = LucideIcons[icon];
    return IconComponent ? <IconComponent className="h-5 w-5 mr-2" /> : null;
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Si on est déjà sur ce chemin, forcer un rafraîchissement
    navigateTo(path, { forceRefresh: isActivePath(path) });
  };
  
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "justify-start font-medium",
        active ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-primary/5",
        className
      )}
      onClick={handleClick}
    >
      {getIcon()}
      <span>{name}</span>
    </Button>
  );
};

export default MenuLink;
