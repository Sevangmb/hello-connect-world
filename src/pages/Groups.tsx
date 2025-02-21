
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { GroupChannel } from "@/components/groups/GroupChannel";
import { GroupSidebar } from "@/components/groups/GroupSidebar";
import { ChannelSidebar } from "@/components/groups/ChannelSidebar";
import { CreateChannelDialog } from "@/components/groups/CreateChannelDialog";
import { supabase } from "@/integrations/supabase/client";

const Groups = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateChannelDialog, setShowCreateChannelDialog] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-[1400px] mx-auto bg-white rounded-lg shadow">
          <div className="flex h-[calc(100vh-8rem)]">
            <GroupSidebar
              groups={groups}
              selectedGroup={selectedGroup}
              onGroupSelect={setSelectedGroup}
              onCreateGroup={() => setShowCreateDialog(true)}
            />

            {selectedGroup && (
              <ChannelSidebar
                selectedGroup={selectedGroup}
                channels={channels}
                selectedChannel={selectedChannel}
                onChannelSelect={setSelectedChannel}
                onCreateChannel={() => setShowCreateChannelDialog(true)}
              />
            )}

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
          onGroupCreated={fetchGroups}
        />

        {selectedGroup && (
          <CreateChannelDialog
            groupId={selectedGroup.id}
            open={showCreateChannelDialog}
            onOpenChange={setShowCreateChannelDialog}
            onChannelCreated={() => fetchChannels(selectedGroup.id)}
          />
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Groups;
