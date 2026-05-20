import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();

  // 1. If they have no token, kick them to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role-Based Security: If the route requires an ADMIN, but an AGENT tries to enter
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to a safe fallback page (like the public homepage or their own dashboard)
    return <Navigate to="/" replace />;
  }

  // 3. If they pass all checks, render the protected component
  return <Outlet />;
};