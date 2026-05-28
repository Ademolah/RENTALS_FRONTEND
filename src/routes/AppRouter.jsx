import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

import { PropertyFeed } from '../components/shared/PropertyFeed';

import { MainLayout } from '../components/layouts/MainLayout';
import { AgencyRegistration } from '../pages/admin/AgencyRegistration';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserProfile } from '../pages/user/UserProfile';
import { AgentDashboard } from '../pages/agent/AgentDashboard';
import { PropertyUpload } from '../pages/agent/PropertyUpload';
import { AcceptInvite } from '../pages/public/AcceptInvite';
import {Toaster } from 'react-hot-toast'
import { SuperAdminDashboard } from '../pages/SuperAdminDashboard';
import { ContactUs } from '../pages/ContactUs';
import { AboutUs } from '../pages/AboutUs';


// (Placeholders for your page components)



export const AppRouter = () => {
  return (

    <BrowserRouter>
    <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0F172A', // Matches your brand-midnight
            color: '#fff',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
      <Routes>
        {/* ==========================================
            PUBLIC ROUTES (Open to everyone)
            ========================================== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<PropertyFeed />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/agent/accept-invite" element={<AcceptInvite />} />
        </Route>

        {/* ==========================================
            PROTECTED ROUTES (Must be logged in)
            ========================================== */}
        <Route element={<ProtectedRoute />}>
          {/* Default protected area for standard users */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/register-agency" element={<AgencyRegistration />} />
        </Route>

        {/* ==========================================
            ROLE-BASED ROUTES (CEOs & Admins Only)
            ========================================== */}
        <Route element={<ProtectedRoute allowedRoles={['AGENCY_ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<div>Brand Settings</div>} />
        </Route>

        {/* ==========================================
            ROLE-BASED ROUTES (Agents & Admins)
            ========================================== */}
        <Route element={<ProtectedRoute allowedRoles={['AGENT', 'AGENCY_ADMIN', ]} />}>
          <Route path="/agent" element={<AgentDashboard />} />
          <Route path="/agent/upload" element={<PropertyUpload />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN']} />}>
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};