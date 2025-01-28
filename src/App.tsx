import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Search from "@/pages/Search";
import Explore from "@/pages/Explore";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<Search />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;