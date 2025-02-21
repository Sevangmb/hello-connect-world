
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GroupSidebarProps {
  groups: any[];
  selectedGroup: any;
  onGroupSelect: (group: any) => void;
  onCreateGroup: () => void;
}

export const GroupSidebar = ({
  groups,
  selectedGroup,
  onGroupSelect,
  onCreateGroup,
}: GroupSidebarProps) => {
  return (
    <div className="w-64 border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Groupes</h2>
        <Button variant="ghost" size="icon" onClick={onCreateGroup}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-full">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => onGroupSelect(group)}
            className={`w-full text-left p-3 hover:bg-muted transition-colors ${
              selectedGroup?.id === group.id ? 'bg-muted' : ''
            }`}
          >
            <p className="font-medium">{group.name}</p>
            <p className="text-sm text-muted-foreground">
              {group.members?.length || 0} membres
            </p>
          </button>
        ))}
      </ScrollArea>
    </div>
  );
};
