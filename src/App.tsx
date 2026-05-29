import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Dashboard";
import Vehicle from "./pages/Vehicles";
import FuelPage from "./pages/FuelPage";
import OrderPage from "./pages/OrderPage";
import TripPage from "./pages/TripPage";
import RecruitmentPage from "./pages/RecruitmentPage";
import IncidentPage from "./pages/IncidentPage";
import SemReport from "./pages/SemReport";
import RevenueReport from "./pages/RevenueReport";
import CostPage from "./pages/CostPage";
import LegalDocumentPage from "./pages/LegalDocumentPage";
import SystemManagementPage from "./pages/SystemManagementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* redirect root */}
        <Route
          path="/"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />

        

        {/* admin layout */}
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          <Route path="system" element={<SystemManagementPage />} />

          <Route
            path="dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="vehicles"
            element={<Vehicle />}
          />

          <Route
            path="fuels"
            element={<FuelPage />}
          />

          <Route
            path="orders"
            element={<OrderPage />}
          />

          <Route
            path="cost"
            element={<CostPage />}
          />

          <Route
            path="trips"
            element={<TripPage />}
          />

          <Route
            path="recruitment"
            element={<RecruitmentPage />}
          />

          <Route
            path="documents"
            element={<LegalDocumentPage />}
          />

          <Route
            path="incidents"
            element={<IncidentPage />}
          />

          {/* SEM */}
          <Route
            path="reports"
            element={<SemReport />}
          />

          {/* Revenue */}
          <Route
            path="revenue-report"
            element={<RevenueReport />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;