import { Routes, Route } from "react-router-dom";
import BottomNav from "./components/layout/BottomNav";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import ReservationPage from "./pages/ReservationPage";
import OrderPage from "./pages/OrderPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/menu"        element={<MenuPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/order"       element={<OrderPage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/admin"       element={<AdminPage />} />
      </Routes>

      {/* Mobile bottom nav — hidden on desktop */}
      <BottomNav />
    </>
  );
}