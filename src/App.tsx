import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { RootLayout } from "./components/RootLayout";
import Home from "./pages/Home";
import Clothes from "./pages/Clothes";
import Suitcases from "./pages/Suitcases"; 
import SuitcaseCalendar from "./pages/SuitcaseCalendar";
import Calendar from "./pages/Calendar";
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
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/clothes" element={<Clothes />} />
          <Route path="/suitcases" element={<Suitcases />} />
          <Route path="/suitcase-calendar" element={<SuitcaseCalendar />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shops/:shopId" element={<Shop />} />
          <Route path="/shops/create" element={<CreateShop />} />
          <Route path="/shops/:shopId/edit" element={<EditShop />} />
          <Route path="/shops/:shopId/clothes/create" element={<CreateClothe />} />
          <Route path="/shops/:shopId/clothes/:clotheId/edit" element={<EditClothe />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
        </Route>
      </Routes>
    </Router>
  );
}
