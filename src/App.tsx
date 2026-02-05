import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
 import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
 import { lazy, Suspense } from "react";
 import { Loader2 } from "lucide-react";
 
 // Pages
 import Index from "./pages/Index";
 import Login from "./pages/Login";
 import Signup from "./pages/Signup";
 import ForgotPassword from "./pages/ForgotPassword";
 import ResetPassword from "./pages/ResetPassword";
 import NotFound from "./pages/NotFound";
 
 // Lazy load dashboard pages
 const UserDashboard = lazy(() => import("./pages/dashboard/UserDashboard"));
 const TrainerDashboard = lazy(() => import("./pages/trainer/TrainerDashboard"));
 const GymDashboard = lazy(() => import("./pages/gym/GymDashboard"));
 const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
 
 function PageLoader() {
   return (
     <div className="min-h-screen flex items-center justify-center bg-background">
       <Loader2 className="h-8 w-8 animate-spin text-primary" />
     </div>
   );
 }

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                 <Suspense fallback={<PageLoader />}>
                   <UserDashboard />
                 </Suspense>
              </ProtectedRoute>
            }
          />
 
           {/* Trainer Routes */}
           <Route
             path="/trainer"
             element={
               <ProtectedRoute requiredRoles={["trainer"]}>
                 <Suspense fallback={<PageLoader />}>
                   <TrainerDashboard />
                 </Suspense>
               </ProtectedRoute>
             }
           />
 
           {/* Gym Admin Routes */}
           <Route
             path="/gym"
             element={
               <ProtectedRoute requiredRoles={["gym_admin"]}>
                 <Suspense fallback={<PageLoader />}>
                   <GymDashboard />
                 </Suspense>
               </ProtectedRoute>
             }
           />
 
           {/* Super Admin Routes */}
           <Route
             path="/admin"
             element={
               <ProtectedRoute requiredRoles={["super_admin"]}>
                 <Suspense fallback={<PageLoader />}>
                   <AdminDashboard />
                 </Suspense>
               </ProtectedRoute>
             }
           />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
