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
 import TrainerSignup from "./pages/TrainerSignup";
 import GymSignup from "./pages/GymSignup";
 import ForgotPassword from "./pages/ForgotPassword";
 import ResetPassword from "./pages/ResetPassword";
 import NotFound from "./pages/NotFound";

// Lazy load dashboard pages
const UserDashboard = lazy(() => import("./pages/dashboard/UserDashboard"));
const ProfileSettings = lazy(() => import("./pages/dashboard/ProfileSettings"));
const Goals = lazy(() => import("./pages/dashboard/Goals"));
const Progress = lazy(() => import("./pages/dashboard/Progress"));
const Activity = lazy(() => import("./pages/dashboard/Activity"));
const Workouts = lazy(() => import("./pages/dashboard/Workouts"));
const Referrals = lazy(() => import("./pages/dashboard/Referrals"));
const Invitations = lazy(() => import("./pages/dashboard/Invitations"));
const UpgradeRole = lazy(() => import("./pages/dashboard/UpgradeRole"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const TrainerOnboarding = lazy(() => import("./pages/onboarding/TrainerOnboarding"));
const GymOnboarding = lazy(() => import("./pages/onboarding/GymOnboarding"));
const TrainerDashboard = lazy(() => import("./pages/trainer/TrainerDashboard"));
const TrainerPrograms = lazy(() => import("./pages/trainer/TrainerPrograms"));
const TrainerClients = lazy(() => import("./pages/trainer/TrainerClients"));
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
          <Route path="/signup/trainer" element={<TrainerSignup />} />
          <Route path="/signup/gym" element={<GymSignup />} />
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
 
           <Route
             path="/dashboard/profile"
             element={
               <ProtectedRoute>
                 <Suspense fallback={<PageLoader />}>
                   <ProfileSettings />
                 </Suspense>
               </ProtectedRoute>
             }
           />
 
           <Route
             path="/dashboard/goals"
             element={
               <ProtectedRoute>
                 <Suspense fallback={<PageLoader />}>
                   <Goals />
                 </Suspense>
               </ProtectedRoute>
             }
           />
 
           <Route
             path="/dashboard/progress"
             element={
               <ProtectedRoute>
                 <Suspense fallback={<PageLoader />}>
                   <Progress />
                 </Suspense>
               </ProtectedRoute>
             }
           />
 
           <Route
             path="/dashboard/activity"
             element={
               <ProtectedRoute>
                 <Suspense fallback={<PageLoader />}>
                   <Activity />
                 </Suspense>
               </ProtectedRoute>
             }
           />

           <Route
             path="/dashboard/workouts"
             element={
               <ProtectedRoute>
                 <Suspense fallback={<PageLoader />}>
                   <Workouts />
                 </Suspense>
               </ProtectedRoute>
             }
           />

           <Route
             path="/dashboard/referrals"
             element={
               <ProtectedRoute>
                 <Suspense fallback={<PageLoader />}>
                   <Referrals />
                 </Suspense>
               </ProtectedRoute>
             }
           />

           <Route
             path="/dashboard/invitations"
             element={
               <ProtectedRoute>
                 <Suspense fallback={<PageLoader />}>
                   <Invitations />
                 </Suspense>
               </ProtectedRoute>
             }
           />
 
          {/* Onboarding Routes */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Onboarding />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/trainer"
            element={
              <ProtectedRoute requiredRoles={["trainer"]}>
                <Suspense fallback={<PageLoader />}>
                  <TrainerOnboarding />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/gym"
            element={
              <ProtectedRoute requiredRoles={["gym_admin"]}>
                <Suspense fallback={<PageLoader />}>
                  <GymOnboarding />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/upgrade"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <UpgradeRole />
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
         
          <Route
            path="/trainer/programs"
            element={
              <ProtectedRoute requiredRoles={["trainer"]}>
                <Suspense fallback={<PageLoader />}>
                  <TrainerPrograms />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/trainer/clients"
            element={
              <ProtectedRoute requiredRoles={["trainer"]}>
                <Suspense fallback={<PageLoader />}>
                  <TrainerClients />
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
