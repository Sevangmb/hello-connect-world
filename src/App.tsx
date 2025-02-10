import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import CreateShop from "./pages/CreateShop";
import EditShop from "./pages/EditShop";
import CreateClothe from "./pages/CreateClothe";
import EditClothe from "./pages/EditClothe";
import PaymentSuccess from "./pages/payment-success";
import PaymentCancelled from "./pages/payment-cancelled";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shops/:shopId" element={<Shop />} />
        <Route path="/shops/create" element={<CreateShop />} />
        <Route path="/shops/:shopId/edit" element={<EditShop />} />
        <Route path="/shops/:shopId/clothes/create" element={<CreateClothe />} />
        <Route path="/shops/:shopId/clothes/:clotheId/edit" element={<EditClothe />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />
      </Routes>
    </Router>
  );
}
