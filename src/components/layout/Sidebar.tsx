 import { User } from "@supabase/supabase-js";
 import { AppRole } from "@/hooks/useAuth";
 import { NavLink } from "@/components/NavLink";
 import { Button } from "@/components/ui/button";
 import { ScrollArea } from "@/components/ui/scroll-area";
 import { Separator } from "@/components/ui/separator";
 import {
   Dumbbell,
   LayoutDashboard,
   User as UserIcon,
   Users,
   Building2,
   Calendar,
   Target,
   Activity,
   Settings,
   LogOut,
   ClipboardList,
   TrendingUp,
   Shield,
   X,
 } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface SidebarProps {
   isOpen: boolean;
   onClose: () => void;
   user: User | null;
   roles: AppRole[];
   onSignOut: () => void;
 }
 
 interface NavItem {
   label: string;
   href: string;
   icon: React.ElementType;
   roles?: AppRole[];
 }
 
 const userNavItems: NavItem[] = [
   { label: "Today", href: "/dashboard", icon: LayoutDashboard },
   { label: "My Progress", href: "/dashboard/progress", icon: TrendingUp },
   { label: "Workouts", href: "/dashboard/workouts", icon: Dumbbell },
   { label: "Goals", href: "/dashboard/goals", icon: Target },
   { label: "Activity", href: "/dashboard/activity", icon: Activity },
   { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
 ];
 
 const trainerNavItems: NavItem[] = [
   { label: "Trainer Dashboard", href: "/trainer", icon: ClipboardList, roles: ["trainer"] },
   { label: "My Clients", href: "/trainer/clients", icon: Users, roles: ["trainer"] },
   { label: "Programs", href: "/trainer/programs", icon: Calendar, roles: ["trainer"] },
 ];
 
 const gymNavItems: NavItem[] = [
   { label: "Gym Dashboard", href: "/gym", icon: Building2, roles: ["gym_admin"] },
   { label: "Members", href: "/gym/members", icon: Users, roles: ["gym_admin"] },
   { label: "Trainers", href: "/gym/trainers", icon: UserIcon, roles: ["gym_admin"] },
   { label: "Events", href: "/gym/events", icon: Calendar, roles: ["gym_admin"] },
 ];
 
 const adminNavItems: NavItem[] = [
   { label: "Admin Panel", href: "/admin", icon: Shield, roles: ["super_admin"] },
 ];
 
 export function Sidebar({ isOpen, onClose, user, roles, onSignOut }: SidebarProps) {
   const hasRole = (requiredRoles?: AppRole[]) => {
     if (!requiredRoles || requiredRoles.length === 0) return true;
     return requiredRoles.some((role) => roles.includes(role));
   };
 
   const renderNavItems = (items: NavItem[]) => {
     return items
       .filter((item) => hasRole(item.roles))
       .map((item) => (
         <NavLink
           key={item.href}
           to={item.href}
           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
           activeClassName="bg-primary/10 text-primary font-medium"
           onClick={onClose}
         >
           <item.icon className="h-5 w-5" />
           <span>{item.label}</span>
         </NavLink>
       ));
   };
 
   return (
     <aside
       className={cn(
         "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border",
         "transform transition-transform duration-300 ease-in-out",
         "md:translate-x-0",
         isOpen ? "translate-x-0" : "-translate-x-full"
       )}
     >
       <div className="flex flex-col h-full">
         {/* Header */}
         <div className="flex items-center justify-between px-4 h-16 border-b border-border">
           <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
               <Dumbbell className="w-5 h-5 text-primary-foreground" />
             </div>
             <span className="font-semibold text-lg">Fitness OS</span>
           </div>
           <Button
             variant="ghost"
             size="icon"
             className="md:hidden"
             onClick={onClose}
           >
             <X className="h-5 w-5" />
           </Button>
         </div>
 
         {/* Navigation */}
         <ScrollArea className="flex-1 py-4">
           <div className="px-3 space-y-6">
             {/* User Navigation */}
             <div className="space-y-1">
               <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                 My Fitness
               </p>
               {renderNavItems(userNavItems)}
             </div>
 
             {/* Trainer Navigation */}
             {hasRole(["trainer"]) && (
               <>
                 <Separator />
                 <div className="space-y-1">
                   <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                     Trainer
                   </p>
                   {renderNavItems(trainerNavItems)}
                 </div>
               </>
             )}
 
             {/* Gym Navigation */}
             {hasRole(["gym_admin"]) && (
               <>
                 <Separator />
                 <div className="space-y-1">
                   <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                     Gym Management
                   </p>
                   {renderNavItems(gymNavItems)}
                 </div>
               </>
             )}
 
             {/* Admin Navigation */}
             {hasRole(["super_admin"]) && (
               <>
                 <Separator />
                 <div className="space-y-1">
                   <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                     Administration
                   </p>
                   {renderNavItems(adminNavItems)}
                 </div>
               </>
             )}
           </div>
         </ScrollArea>
 
         {/* Footer */}
         <div className="p-4 border-t border-border">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
               <UserIcon className="h-4 w-4 text-muted-foreground" />
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium truncate">
                 {user?.email?.split("@")[0] || "User"}
               </p>
               <p className="text-xs text-muted-foreground capitalize">
                 {roles.join(", ").replace(/_/g, " ")}
               </p>
             </div>
           </div>
           <div className="flex gap-2">
             <Button
               variant="ghost"
               size="sm"
               className="flex-1 justify-start"
               asChild
             >
               <NavLink to="/dashboard/settings">
                 <Settings className="h-4 w-4 mr-2" />
                 Settings
               </NavLink>
             </Button>
             <Button
               variant="ghost"
               size="icon"
               onClick={onSignOut}
             >
               <LogOut className="h-4 w-4" />
             </Button>
           </div>
         </div>
       </div>
     </aside>
   );
 }