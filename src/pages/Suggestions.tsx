
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { AIRecommendations } from "@/components/home/AIRecommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

const Suggestions = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Suggestions IA</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Comment ça marche ?</CardTitle>
              <CardDescription>
                Notre intelligence artificielle analyse votre garde-robe et vous propose des tenues adaptées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Pour que l'IA puisse vous proposer des suggestions personnalisées, assurez-vous d'avoir :
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>Au moins un haut (t-shirt, chemise, pull, etc.)</li>
                <li>Au moins un bas (pantalon, jupe, short, etc.)</li>
                <li>Au moins une paire de chaussures</li>
              </ul>
              <div className="mt-4">
                <Link to="/clothes" className={buttonVariants({ variant: "outline" })}>
                  Gérer ma garde-robe
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <AIRecommendations />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Suggestions;
