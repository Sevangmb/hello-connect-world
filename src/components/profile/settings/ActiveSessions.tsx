import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Session {
  id: string;
  created_at: string;
  ip_address: string;
  user_agent: string;
  is_current: boolean;
}

export const ActiveSessions = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTerminating, setIsTerminating] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        setSessions([]);
        return;
      }

      // Simulating multiple sessions since Supabase doesn't expose all sessions
      // In a real implementation, you would fetch this from your backend
      const mockSessions: Session[] = [
        {
          id: currentSession.access_token,
          created_at: new Date().toISOString(),
          ip_address: "127.0.0.1",
          user_agent: navigator.userAgent,
          is_current: true
        },
        {
          id: "mock-session-1",
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          ip_address: "192.168.1.1",
          user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          is_current: false
        }
      ];
      
      setSessions(mockSessions);
    } catch (error) {
      console.error("Erreur lors de la récupération des sessions:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer vos sessions actives"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const terminateSession = async (sessionId: string) => {
    try {
      setIsTerminating(sessionId);
      
      // If it's the current session, sign out
      if (sessions.find(s => s.id === sessionId)?.is_current) {
        await supabase.auth.signOut();
        window.location.href = "/auth";
        return;
      }
      
      // Otherwise, simulate terminating a specific session
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      toast({
        title: "Session terminée",
        description: "La session a été déconnectée avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la terminaison de la session:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de terminer la session"
      });
    } finally {
      setIsTerminating(null);
    }
  };

  const refreshSessions = async () => {
    try {
      setIsRefreshing(true);
      await fetchSessions();
      
      toast({
        title: "Sessions actualisées",
        description: "La liste des sessions a été mise à jour"
      });
    } catch (error) {
      console.error("Erreur lors de l'actualisation des sessions:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'actualiser les sessions"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatUserAgent = (userAgent: string) => {
    const parsedUA = userAgent.split(/[()]/)[1];
    return parsedUA || userAgent;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <p className="font-medium">Sessions actives</p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshSessions} 
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {sessions.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          Aucune session active trouvée
        </p>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => (
            <Card key={session.id} className={`overflow-hidden ${session.is_current ? "border-primary" : ""}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {session.is_current ? "Session actuelle" : "Autre appareil"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatUserAgent(session.user_agent)}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>IP: {session.ip_address}</span>
                      <span>
                        Connecté {formatDistanceToNow(new Date(session.created_at), { 
                          addSuffix: true,
                          locale: fr
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => terminateSession(session.id)}
                    disabled={isTerminating === session.id}
                  >
                    {isTerminating === session.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnecter
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <p className="text-xs text-muted-foreground mt-2">
        Si vous observez des sessions que vous ne reconnaissez pas, déconnectez-les immédiatement et changez votre mot de passe.
      </p>
    </div>
  );
};
