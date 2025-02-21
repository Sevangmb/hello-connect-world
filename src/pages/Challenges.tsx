
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CreateChallenge } from "@/components/challenges/CreateChallenge";
import { ChallengesList } from "@/components/challenges/ChallengesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Challenges = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold">Défis</h1>
          
          <Tabs defaultValue="ongoing" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="ongoing">En cours</TabsTrigger>
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
              <TabsTrigger value="completed">Terminés</TabsTrigger>
              <TabsTrigger value="create">Créer un défi</TabsTrigger>
            </TabsList>

            <TabsContent value="ongoing" className="mt-6">
              <ChallengesList filter="ongoing" />
            </TabsContent>

            <TabsContent value="upcoming" className="mt-6">
              <ChallengesList filter="upcoming" />
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <ChallengesList filter="completed" />
            </TabsContent>

            <TabsContent value="create" className="mt-6">
              <CreateChallenge />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Challenges;
