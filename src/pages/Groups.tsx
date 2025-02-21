
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { GroupChannel } from "@/components/groups/GroupChannel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const Groups = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateChannelDialog, setShowCreateChannelDialog] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchChannels(selectedGroup.id);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          members:group_members(
            profiles(username, avatar_url),
            role
          )
        `);

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchChannels = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_channels')
        .select('*')
        .eq('group_id', groupId)
        .order('name');

      if (error) throw error;
      setChannels(data || []);
      if (data && data.length > 0 && !selectedChannel) {
        setSelectedChannel(data[0]);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const createChannel = async () => {
    if (!selectedGroup) return;
    
    try {
      const { error } = await supabase
        .from('group_channels')
        .insert({
          group_id: selectedGroup.id,
          name: newChannelName,
          description: newChannelDescription
        });

      if (error) throw error;

      toast({
        title: "Canal créé",
        description: "Le canal a été créé avec succès",
      });

      setShowCreateChannelDialog(false);
      setNewChannelName("");
      setNewChannelDescription("");
      fetchChannels(selectedGroup.id);
    } catch (error) {
      console.error('Error creating channel:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le canal",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-[1400px] mx-auto bg-white rounded-lg shadow">
          <div className="flex h-[calc(100vh-8rem)]">
            {/* Groups sidebar */}
            <div className="w-64 border-r">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold">Groupes</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-full">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
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

            {/* Channels sidebar */}
            {selectedGroup && (
              <div className="w-64 border-r">
                <div className="p-4 border-b">
                  <h3 className="font-semibold mb-2">{selectedGroup.name}</h3>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setShowCreateChannelDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Channel
                  </Button>
                </div>
                <ScrollArea className="h-full">
                  <div className="space-y-1 p-2">
                    {channels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel)}
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
            )}

            {/* Channel content */}
            {selectedChannel ? (
              <GroupChannel
                channelId={selectedChannel.id}
                channelName={selectedChannel.name}
                groupId={selectedGroup.id}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Sélectionnez un groupe et un canal pour commencer
              </div>
            )}
          </div>
        </div>

        <CreateGroupDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onGroupCreated={() => {
            fetchGroups();
          }}
        />

        <Dialog open={showCreateChannelDialog} onOpenChange={setShowCreateChannelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau canal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  placeholder="Nom du canal"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Description (optionnelle)"
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={createChannel} disabled={!newChannelName.trim()}>
                  Créer le canal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <BottomNav />
    </div>
  );
};

export default Groups;

