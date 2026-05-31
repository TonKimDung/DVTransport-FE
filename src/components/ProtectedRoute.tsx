import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/careers" replace />;
  }

  if (roles && roles.length > 0) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!roles.includes(user.roleName)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
}