
import { Button } from "@/components/ui/button";
import { UserSearch } from "@/components/users/UserSearch";

interface ClothesCalendarHeaderProps {
  selectedFriend: { id: string; username: string } | null;
  onSelectFriend: (friend: { id: string; username: string } | null) => void;
}

export const ClothesCalendarHeader = ({ selectedFriend, onSelectFriend }: ClothesCalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold leading-none tracking-tight">
        {selectedFriend 
          ? `Calendrier de ${selectedFriend.username}`
          : "Mon calendrier de garde-robe"
        }
      </h2>
      <div className="flex items-center gap-4">
        <UserSearch 
          placeholder="Rechercher un ami..."
          onSelect={(friend) => onSelectFriend(friend)}
        />
        {selectedFriend && (
          <Button 
            variant="outline" 
            onClick={() => onSelectFriend(null)}
          >
            Revenir à mon calendrier
          </Button>
        )}
      </div>
    </div>
  );
};
