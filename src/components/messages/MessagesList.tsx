
import { UserSearch } from "@/components/users/UserSearch";
import { PrivateChat } from "./PrivateChat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMessages } from "@/hooks/useMessages";

export const MessagesList = () => {
  const { conversations, loading } = useMessages();
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    username: string;
    avatar_url: string | null;
  } | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="md:col-span-2">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-4">
        <UserSearch 
          onSelect={setSelectedUser}
          placeholder="Nouvelle conversation..."
        />
        <ScrollArea className="h-[500px]">
          {conversations.map(({ user: partner, lastMessage }) => (
            <Card
              key={partner.id}
              className="p-4 mb-2 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedUser(partner)}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={partner.avatar_url || ""} />
                  <AvatarFallback>{partner.username?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{partner.username}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </ScrollArea>
      </div>

      <div className="md:col-span-2">
        {selectedUser ? (
          <PrivateChat
            recipientId={selectedUser.id}
            recipientName={selectedUser.username}
          />
        ) : (
          <div className="h-[600px] flex items-center justify-center text-gray-500">
            Sélectionnez une conversation ou démarrez-en une nouvelle
          </div>
        )}
      </div>
    </div>
  );
};
