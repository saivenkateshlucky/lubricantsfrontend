import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole?: string;
}

export default function ProtectedRoute({ requiredRole = "admin" }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  let user: { role: string } | null = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }

  if (!token || !user) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to home if authenticated but doesn't match the required role
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
