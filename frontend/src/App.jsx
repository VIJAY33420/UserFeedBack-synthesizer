import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Layout & UI
import { BackgroundCanvas } from './components/layout/BackgroundCanvas';
import { TopNav } from './components/layout/TopNav';

// Pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Shortlist from './pages/Shortlist';
import Clusters from './pages/Clusters';
import Trend from './pages/Trend';
import SubmitFeedback from './pages/SubmitFeedback';
import AISummary from './pages/AISummary';
import Profile from './pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return (
    <div className="min-h-screen flex flex-col relative z-0">
      <BackgroundCanvas />
      <TopNav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Auth />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shortlist" element={<Shortlist />} />
            <Route path="/clusters" element={<Clusters />} />
            <Route path="/trend" element={<Trend />} />
            <Route path="/submit" element={<SubmitFeedback />} />
            <Route path="/summary" element={<AISummary />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#f1f1f4',
          }
        }} 
      />
    </QueryClientProvider>
  );
}

export default App;
