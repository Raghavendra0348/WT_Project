import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading…</div>;
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminRoute() {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading…</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
