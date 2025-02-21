
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ChallengeDatesProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export function ChallengeDates({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: ChallengeDatesProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="startDate">Date de début</Label>
        <Input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="endDate">Date de fin</Label>
        <Input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
}
