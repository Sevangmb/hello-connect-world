import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FriendsList } from "@/components/friends/FriendsList";
import { AddFriend } from "@/components/friends/AddFriend";

const Friends = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold">Amis</h1>
          <AddFriend />
          <FriendsList />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Friends;
