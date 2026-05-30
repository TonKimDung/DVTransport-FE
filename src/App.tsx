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
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPage />} />

          <Route
            path="system"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <SystemManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="vehicles"
            element={
              <ProtectedRoute roles={["Admin", "Điều phối viên"]}>
                <Vehicle />
              </ProtectedRoute>
            }
          />

          <Route
            path="fuels"
            element={
              <ProtectedRoute
                roles={["Admin", "Điều phối viên", "Lái xe", "Kế toán"]}
              >
                <FuelPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="orders"
            element={
              <ProtectedRoute
                roles={["Admin", "Điều phối viên", "Lái xe", "Kế toán"]}
              >
                <OrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="cost"
            element={
              <ProtectedRoute roles={["Admin", "Điều phối viên", "Kế toán"]}>
                <CostPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="trips"
            element={
              <ProtectedRoute roles={["Admin", "Điều phối viên"]}>
                <TripPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="recruitment"
            element={
              <ProtectedRoute roles={["Admin", "HR"]}>
                <RecruitmentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="documents"
            element={
              <ProtectedRoute roles={["Admin", "Điều phối viên", "Kế toán"]}>
                <LegalDocumentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="incidents"
            element={
              <ProtectedRoute roles={["Admin", "Điều phối viên", "Lái xe"]}>
                <IncidentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="reports"
            element={
              <ProtectedRoute roles={["Admin", "Kế toán"]}>
                <SemReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="revenue-report"
            element={
              <ProtectedRoute roles={["Admin", "Kế toán"]}>
                <RevenueReport />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;