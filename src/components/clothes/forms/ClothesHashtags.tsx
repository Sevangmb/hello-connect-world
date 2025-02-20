
import { HashtagInput } from "@/components/hashtags/HashtagInput";
import { useHashtags } from "@/hooks/useHashtags";

interface ClothesHashtagsProps {
  initialHashtags?: string[];
  onHashtagsChange: (hashtags: string[]) => void;
}

export const ClothesHashtags = ({
  initialHashtags = [],
  onHashtagsChange,
}: ClothesHashtagsProps) => {
  const { hashtags, addHashtag, removeHashtag } = useHashtags(initialHashtags);

  const handleAddHashtag = async (hashtag: string) => {
    await addHashtag(hashtag);
    onHashtagsChange(hashtags);
  };

  const handleRemoveHashtag = (hashtag: string) => {
    removeHashtag(hashtag);
    onHashtagsChange(hashtags.filter(h => h !== hashtag));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Hashtags</label>
      <HashtagInput
        currentHashtags={hashtags}
        onAddHashtag={handleAddHashtag}
        onRemoveHashtag={handleRemoveHashtag}
      />
    </div>
  );
};
