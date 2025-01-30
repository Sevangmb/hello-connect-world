import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Shops from "@/pages/Shops";
import StoresList from "@/pages/StoresList";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/stores/list" element={<StoresList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
