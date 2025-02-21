
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ChallengeBasicInfoProps {
  title: string;
  description: string;
  rules: string;
  rewardDescription: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onRulesChange: (value: string) => void;
  onRewardDescriptionChange: (value: string) => void;
}

export function ChallengeBasicInfo({
  title,
  description,
  rules,
  rewardDescription,
  onTitleChange,
  onDescriptionChange,
  onRulesChange,
  onRewardDescriptionChange,
}: ChallengeBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Décrivez le thème du défi..."
        />
      </div>

      <div>
        <Label htmlFor="rules">Règles du défi</Label>
        <Textarea
          id="rules"
          value={rules}
          onChange={(e) => onRulesChange(e.target.value)}
          placeholder="Listez les règles du défi..."
        />
      </div>

      <div>
        <Label htmlFor="rewardDescription">Description des récompenses</Label>
        <Textarea
          id="rewardDescription"
          value={rewardDescription}
          onChange={(e) => onRewardDescriptionChange(e.target.value)}
          placeholder="Décrivez les récompenses..."
        />
      </div>
    </div>
  );
}
