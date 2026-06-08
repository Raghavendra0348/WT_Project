import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Protected pages
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import BookmarksPage from './pages/BookmarksPage';
import DownloadsPage from './pages/DownloadsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminApprovalsPage from './pages/admin/AdminApprovalsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected — must be logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Admin only */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/approvals" element={<AdminApprovalsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
