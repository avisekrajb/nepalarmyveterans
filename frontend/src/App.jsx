import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import { ScrollProvider } from './context/ScrollContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import MaintenanceModal from './components/MaintenanceModal';
import RightClickProtection from './components/RightClickProtection';
import NetworkStatus from './components/NetworkStatus';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import HeroManager from './components/admin/HeroManager';
import LeadershipManager from './components/admin/LeadershipManager';
import GalleryManager from './components/admin/GalleryManager';
import NewsManager from './components/admin/NewsManager';
import EventsManager from './components/admin/EventsManager';
import NoticesManager from './components/admin/NoticesManager';
import ContactManager from './components/admin/ContactManager';
import ContactMessageManager from './components/admin/ContactMessageManager';
import IntroductionManager from './components/admin/IntroductionManager';
import LogoManager from './components/admin/LogoManager';
import SettingsManager from './components/admin/SettingsManager';
import InterviewManager from './components/admin/InterviewManager';
import CentralCommitteeManager from './components/admin/CentralCommitteeManager';

// Super Admin Components
import SuperAdminLogin from './sections/SuperAdminLogin';
import SuperAdminLayout from './components/superadmin/SuperAdminLayout';
import SuperDashboard from './components/superadmin/Dashboard';
import ManageAdmins from './components/superadmin/ManageAdmins';
import ActivityLogs from './components/superadmin/ActivityLogs';
import Analytics from './components/superadmin/Analytics';
import CloudinaryManager from './components/superadmin/CloudinaryManager';
import SuperSettings from './components/superadmin/SuperSettings';

// Sections (Public)
import AdminLogin from './sections/AdminLogin';
import Hero from './sections/Hero';
import CentralCommittee from './sections/CentralCommittee';
import Introduction from './sections/Introduction';
import Mission from './sections/Mission';
import Leadership from './sections/Leadership';
import TreasuryTeams from './sections/TreasuryTeams';
import HistoryFoundation from './sections/HistoryFoundation';
import TaskProgram from './sections/TaskProgram';
import News from './sections/News';
import Articles from './sections/Articles';
import Interviews from './sections/Interviews';
import Notices from './sections/Notices';
import Events from './sections/Events';
import Gallery from './sections/Gallery';
import FAQs from './sections/FAQs';
import Training from './sections/Training';
import SecurityRules from './sections/SecurityRules';
import Contact from './sections/Contact';
import NoticeModal from './components/NoticeModal';

// Page wrapper with animation
function Page({ children, pad = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={pad ? 'pt-36 md:pt-40' : ''}
    >
      {children}
    </motion.div>
  );
}

// Layout Component - Now inside Router context
function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isSuperAdminRoute = location.pathname.startsWith('/superadmin');

  // Hide navbar on admin and superadmin routes
  const hideNavbar = isAdminRoute || isSuperAdminRoute;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!hideNavbar && <Footer />}
      <ScrollToTop />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Page pad={false}><Hero /></Page></Layout>} />
        <Route path="/central-committee" element={<Layout><Page><CentralCommittee /></Page></Layout>} />
        <Route path="/introduction" element={<Layout><Page><Introduction /></Page></Layout>} />
        <Route path="/mission" element={<Layout><Page><Mission /></Page></Layout>} />
        <Route path="/leadership" element={<Layout><Page><Leadership /></Page></Layout>} />
        <Route path="/treasuryteams" element={<Layout><Page><TreasuryTeams /></Page></Layout>} />
        <Route path="/history-foundation" element={<Layout><Page><HistoryFoundation /></Page></Layout>} />
        <Route path="/task-program" element={<Layout><Page><TaskProgram /></Page></Layout>} />
        <Route path="/news" element={<Layout><Page><News /></Page></Layout>} />
        <Route path="/articles" element={<Layout><Page><Articles /></Page></Layout>} />
        <Route path="/interviews" element={<Layout><Page><Interviews /></Page></Layout>} />
        <Route path="/notices" element={<Layout><Page><Notices /></Page></Layout>} />
        <Route path="/events" element={<Layout><Page><Events /></Page></Layout>} />
        <Route path="/gallery" element={<Layout><Page><Gallery /></Page></Layout>} />
        <Route path="/faqs" element={<Layout><Page><FAQs /></Page></Layout>} />
        <Route path="/training" element={<Layout><Page><Training /></Page></Layout>} />
        <Route path="/security-rules" element={<Layout><Page><SecurityRules /></Page></Layout>} />
        <Route path="/contact" element={<Layout><Page><Contact /></Page></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout><Dashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/hero" element={
          <ProtectedRoute>
            <AdminLayout><HeroManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/leadership" element={
          <ProtectedRoute>
            <AdminLayout><LeadershipManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/central-committee" element={
          <ProtectedRoute>
            <AdminLayout><CentralCommitteeManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/gallery" element={
          <ProtectedRoute>
            <AdminLayout><GalleryManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/news" element={
          <ProtectedRoute>
            <AdminLayout><NewsManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedRoute>
            <AdminLayout><EventsManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/notices" element={
          <ProtectedRoute>
            <AdminLayout><NoticesManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/interviews" element={
          <ProtectedRoute>
            <AdminLayout><InterviewManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/contact" element={
          <ProtectedRoute>
            <AdminLayout><ContactManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedRoute>
            <AdminLayout><ContactMessageManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/introduction" element={
          <ProtectedRoute>
            <AdminLayout><IntroductionManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/logos" element={
          <ProtectedRoute>
            <AdminLayout><LogoManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <AdminLayout><SettingsManager /></AdminLayout>
          </ProtectedRoute>
        } />

        {/* Super Admin Routes - Protected */}
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/superadmin" element={
          <ProtectedRoute isSuperAdmin>
            <SuperAdminLayout><SuperDashboard /></SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/superadmin/admins" element={
          <ProtectedRoute isSuperAdmin>
            <SuperAdminLayout><ManageAdmins /></SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/superadmin/logs" element={
          <ProtectedRoute isSuperAdmin>
            <SuperAdminLayout><ActivityLogs /></SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/superadmin/analytics" element={
          <ProtectedRoute isSuperAdmin>
            <SuperAdminLayout><Analytics /></SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/superadmin/cloudinary" element={
          <ProtectedRoute isSuperAdmin>
            <SuperAdminLayout><CloudinaryManager /></SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/superadmin/settings" element={
          <ProtectedRoute isSuperAdmin>
            <SuperAdminLayout><SuperSettings /></SuperAdminLayout>
          </ProtectedRoute>
        } />

        {/* Fallback Route */}
        <Route path="*" element={<Layout><Page pad={false}><Hero /></Page></Layout>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <ScrollProvider>
          <BrowserRouter>
            <AnimatedRoutes />
            <RightClickProtection />
            <NoticeModal />
            <MaintenanceModal />
            <NetworkStatus />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#1F3D2B',
                    color: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  style: {
                    background: '#8B2331',
                    color: '#fff',
                  },
                },
              }}
            />
          </BrowserRouter>
        </ScrollProvider>
      </SiteProvider>
    </AuthProvider>
  );
}

export default App;