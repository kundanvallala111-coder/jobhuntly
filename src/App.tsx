import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import PostJob from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";
import ManageApplications from "./pages/ManageApplications";
import Analytics from "./pages/Analytics";
import CompanySettings from "./pages/CompanySettings";
import CompanySetup from "./pages/CompanySetup";
import CreateCompany from "./pages/CreateCompany";
import JoinCompany from "./pages/JoinCompany";
import DashboardLayout from "./pages/DashboardLayout";
import ResumeMatcher from "./pages/ResumeMatcher";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />

            {/* Company setup routes (protected but outside main dashboard layout) */}
            <Route
              path="/company-setup"
              element={
                <ProtectedRoute>
                  <CompanySetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-setup/create"
              element={
                <ProtectedRoute>
                  <CreateCompany />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-setup/join"
              element={
                <ProtectedRoute>
                  <JoinCompany />
                </ProtectedRoute>
              }
            />

            {/* Dashboard and nested pages */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="resume-matcher" element={<ResumeMatcher />} />
              <Route path="applications" element={<Applications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="post-job" element={<PostJob />} />
              <Route path="my-jobs" element={<MyJobs />} />
              <Route path="manage-applications" element={<ManageApplications />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="company/settings" element={<CompanySettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
