 import { Button } from "@/components/ui/button";
 import { Dumbbell, Menu } from "lucide-react";
 
 interface MobileHeaderProps {
   onMenuClick: () => void;
 }
 
 export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
   return (
     <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-card border-b border-border md:hidden">
       <div className="flex items-center justify-between h-full px-4">
         <div className="flex items-center gap-3">
           <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
             <Dumbbell className="w-5 h-5 text-primary-foreground" />
           </div>
           <span className="font-semibold text-lg">Fitness OS</span>
         </div>
         <Button variant="ghost" size="icon" onClick={onMenuClick}>
           <Menu className="h-5 w-5" />
         </Button>
       </div>
     </header>
   );
 }