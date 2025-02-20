
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Hash, X } from "lucide-react";

interface HashtagInputProps {
  currentHashtags: string[];
  onAddHashtag: (hashtag: string) => void;
  onRemoveHashtag: (hashtag: string) => void;
}

export const HashtagInput = ({
  currentHashtags,
  onAddHashtag,
  onRemoveHashtag,
}: HashtagInputProps) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const hashtag = input.trim().replace(/^#/, "");
      if (hashtag && !currentHashtags.includes(hashtag)) {
        onAddHashtag(hashtag);
        setInput("");
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {currentHashtags.map((hashtag) => (
          <Badge
            key={hashtag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            <Hash className="h-3 w-3" />
            {hashtag}
            <button
              onClick={() => onRemoveHashtag(hashtag)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ajouter des hashtags (appuyez sur Entrée)"
        className="max-w-sm"
      />
    </div>
  );
};
