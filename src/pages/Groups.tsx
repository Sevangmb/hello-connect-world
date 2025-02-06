import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { GroupsList } from "@/components/groups/GroupsList";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { SearchGroups } from "@/components/groups/SearchGroups";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Groups = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Groupes</h2>
          
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="list">Mes groupes</TabsTrigger>
              <TabsTrigger value="search">Rechercher</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <GroupsList onChatSelect={(group) => console.log("Selected group:", group)} />
            </TabsContent>

            <TabsContent value="search" className="space-y-6">
              <SearchGroups onSelect={(group) => console.log("Selected group:", group)} />
            </TabsContent>

            <TabsContent value="discussions">
              <div className="text-center text-muted-foreground py-8">
                Les discussions de groupe seront bientôt disponibles
              </div>
            </TabsContent>
          </Tabs>

          <CreateGroupDialog 
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onGroupCreated={() => {
              // Refresh groups list
            }}
          />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Groups;
