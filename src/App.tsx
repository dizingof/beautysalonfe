import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainSite from './pages/MainSite';
import { isAuthenticated } from './api/adminClient';
import { Navigate } from 'react-router-dom';

const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const MastersPage = lazy(() => import('./pages/MastersPage'));
const PricesPage = lazy(() => import('./pages/PricesPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/masters" element={<MastersPage />} />
        <Route path="/prices" element={<PricesPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
