
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

export interface OutfitInteractionsProps {
  outfitId?: string;
  outfit?: any; // Pour la compatibilité avec le code existant
  likesCount?: number;
  commentsCount?: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  isLiked?: boolean;
}

export const OutfitInteractions: React.FC<OutfitInteractionsProps> = ({
  outfitId,
  outfit,
  likesCount = 0,
  commentsCount = 0,
  onLike,
  onComment,
  onShare,
  isLiked = false
}) => {
  // Si nous recevons un outfit complet, extrayons les données nécessaires
  const effectiveOutfitId = outfitId || outfit?.id;
  const effectiveLikesCount = likesCount || outfit?.likes_count || 0;
  const effectiveCommentsCount = commentsCount || outfit?.comments_count || 0;

  const handleLike = () => {
    if (onLike) onLike();
  };

  const handleComment = () => {
    if (onComment) onComment();
  };

  const handleShare = () => {
    if (onShare) onShare();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center ${isLiked ? 'text-red-500' : ''}`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 mr-1 ${isLiked ? 'fill-current' : ''}`} />
          <span>{effectiveLikesCount}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center"
          onClick={handleComment}
        >
          <MessageCircle className="h-5 w-5 mr-1" />
          <span>{effectiveCommentsCount}</span>
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center"
        onClick={handleShare}
      >
        <Share2 className="h-5 w-5 mr-1" />
        <span>Partager</span>
      </Button>
    </div>
  );
};
