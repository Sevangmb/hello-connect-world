
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { MessagesList } from "@/components/messages/MessagesList";

const Messages = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <h1 className="text-2xl font-bold mb-6">Messagerie</h1>
          <MessagesList />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Messages;
