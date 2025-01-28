import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PostProps {
  author: string;
  content: string;
  image?: string;
  likes: number;
}

export const Post = ({ author, content, image, likes: initialLikes }: PostProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  return (
    <Card className="p-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div>
          <h3 className="font-semibold">{author}</h3>
          <p className="text-sm text-gray-500">Il y a 2 heures</p>
        </div>
      </div>
      
      <p className="mb-4">{content}</p>
      
      {image && (
        <img 
          src={image} 
          alt="Post content" 
          className="w-full rounded-lg mb-4 object-cover max-h-96"
        />
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${isLiked ? 'text-facebook-primary' : ''}`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          {likes}
        </Button>
      </div>
    </Card>
  );
};