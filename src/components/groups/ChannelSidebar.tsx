
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Hash } from "lucide-react";

interface ChannelSidebarProps {
  selectedGroup: any;
  channels: any[];
  selectedChannel: any;
  onChannelSelect: (channel: any) => void;
  onCreateChannel: () => void;
}

export const ChannelSidebar = ({
  selectedGroup,
  channels,
  selectedChannel,
  onChannelSelect,
  onCreateChannel,
}: ChannelSidebarProps) => {
  return (
    <div className="w-64 border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">{selectedGroup.name}</h3>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onCreateChannel}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-full">
        <div className="space-y-1 p-2">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => onChannelSelect(channel)}
              className={`w-full text-left p-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2 ${
                selectedChannel?.id === channel.id ? 'bg-muted' : ''
              }`}
            >
              <Hash className="h-4 w-4" />
              {channel.name}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
