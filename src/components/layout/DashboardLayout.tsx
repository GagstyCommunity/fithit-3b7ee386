 import { ReactNode, useState } from "react";
 import { useAuth, AppRole } from "@/hooks/useAuth";
 import { Sidebar } from "./Sidebar";
 import { MobileHeader } from "./MobileHeader";
 import { cn } from "@/lib/utils";
 
 interface DashboardLayoutProps {
   children: ReactNode;
 }
 
 export function DashboardLayout({ children }: DashboardLayoutProps) {
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const { user, roles, signOut } = useAuth();
 
   return (
     <div className="min-h-screen bg-background">
       {/* Mobile Header */}
       <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
 
       {/* Sidebar */}
       <Sidebar
         isOpen={sidebarOpen}
         onClose={() => setSidebarOpen(false)}
         user={user}
         roles={roles}
         onSignOut={signOut}
       />
 
       {/* Main Content */}
       <main
         className={cn(
           "transition-all duration-300",
           "pt-16 md:pt-0 md:pl-64"
         )}
       >
         <div className="container mx-auto px-4 py-6 md:py-8">
           {children}
         </div>
       </main>
 
       {/* Mobile Overlay */}
       {sidebarOpen && (
         <div
           className="fixed inset-0 bg-black/50 z-40 md:hidden"
           onClick={() => setSidebarOpen(false)}
         />
       )}
     </div>
   );
 }