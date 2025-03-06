
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFieldProps {
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

export const EmailField = ({ email, onChange, isSubmitting }: EmailFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-sm font-medium">
        Email
      </Label>
      <Input
        id="email"
        type="email"
        placeholder="nom@exemple.com"
        value={email}
        onChange={onChange}
        disabled={isSubmitting}
        className="w-full"
        required
        autoComplete="email"
        autoFocus
      />
    </div>
  );
};
