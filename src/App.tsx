import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Feed from "@/pages/Feed";
import Search from "@/pages/Search";
import Explore from "@/pages/Explore";
import Personal from "@/pages/Personal";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Clothes from "@/pages/Clothes";
import Outfits from "@/pages/Outfits";
import TrendingOutfits from "@/pages/TrendingOutfits";
import Challenges from "@/pages/Challenges";
import Challenge from "@/pages/Challenge";
import Friends from "@/pages/Friends";
import Groups from "@/pages/Groups";
import Messages from "@/pages/Messages";
import Notifications from "@/pages/Notifications";
import Hashtags from "@/pages/Hashtags";
import Suggestions from "@/pages/Suggestions";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <Routes>
        {/* Routes principales */}
        <Route path="/" element={<Index />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/suggestions" element={<Suggestions />} />
        
        {/* Routes d'exploration */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/search" element={<Search />} />
        <Route path="/hashtags" element={<Hashtags />} />
        <Route path="/hashtag/:name" element={<Hashtags />} />
        <Route path="/trending/outfits" element={<TrendingOutfits />} />
        
        {/* Routes personnelles */}
        <Route path="/personal" element={<Personal />} />
        <Route path="/clothes" element={<Clothes />} />
        <Route path="/outfits" element={<Outfits />} />
        <Route path="/outfit/:id" element={<Outfits />} />
        
        {/* Routes sociales */}
        <Route path="/friends" element={<Friends />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/group/:id" element={<Groups />} />
        <Route path="/messages" element={<Messages />} />
        
        {/* Routes de défis */}
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenge/:id" element={<Challenge />} />
        
        {/* Routes de profil */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;