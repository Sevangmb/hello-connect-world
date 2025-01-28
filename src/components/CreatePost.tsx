import { Image } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export const CreatePost = () => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Post content:", content);
    setContent("");
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder="Que voulez-vous partager ?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4 resize-none"
        />
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" className="gap-2">
            <Image className="h-5 w-5" />
            Photo
          </Button>
          <Button type="submit" className="bg-facebook-primary hover:bg-facebook-hover">
            Publier
          </Button>
        </div>
      </form>
    </Card>
  );
};