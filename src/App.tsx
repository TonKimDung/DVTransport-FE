import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Dashboard";
import Vehicle from "./pages/Vehicles";
import LoginPage from "./pages/LoginPage";
import FuelPage from "./pages/FuelPage";
import OrderPage from "./pages/OrderPage";
import TripPage from "./pages/TripPage";
import RecruitmentPage from "./pages/RecruitmentPage";
import TransportTrackingPage from "./pages/TransportTrackingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="vehicles" element={<Vehicle />} />
          <Route path="fuels" element={<FuelPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="trips" element={<TripPage />} />
          <Route path="recruitment" element={<RecruitmentPage />} />
          <Route path="incidents" element={<TransportTrackingPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;