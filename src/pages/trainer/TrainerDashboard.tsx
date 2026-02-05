 import { DashboardLayout } from "@/components/layout/DashboardLayout";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Users, Calendar, ClipboardList, TrendingUp, Plus, ChevronRight } from "lucide-react";
 
 export default function TrainerDashboard() {
   return (
     <DashboardLayout>
       {/* Header */}
       <div className="flex items-center justify-between mb-8">
         <div>
           <h1 className="text-3xl font-bold mb-2">Trainer Dashboard</h1>
           <p className="text-muted-foreground">
             Manage your clients and create workout programs.
           </p>
         </div>
         <Button>
           <Plus className="h-4 w-4 mr-2" />
           Add Client
         </Button>
       </div>
 
       {/* Stats */}
       <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Total Clients
             </CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">Active clients</p>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Programs
             </CardTitle>
             <ClipboardList className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">Active programs</p>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               This Week
             </CardTitle>
             <Calendar className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">Sessions scheduled</p>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Completion Rate
             </CardTitle>
             <TrendingUp className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">--</div>
             <p className="text-xs text-muted-foreground">Client average</p>
           </CardContent>
         </Card>
       </div>
 
       {/* Clients Section */}
       <Card className="mb-6">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Users className="h-5 w-5 text-primary" />
             My Clients
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="flex flex-col items-center justify-center py-12">
             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
               <Users className="w-8 h-8 text-muted-foreground" />
             </div>
             <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
             <p className="text-muted-foreground text-center max-w-md mb-6">
               Start building your client base. Add clients to create personalized workout programs.
             </p>
             <Button>
               <Plus className="h-4 w-4 mr-2" />
               Add Your First Client
             </Button>
           </div>
         </CardContent>
       </Card>
 
       {/* Quick Actions */}
       <div className="grid gap-4 md:grid-cols-2">
         <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
           <CardContent className="flex items-center justify-between p-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                 <ClipboardList className="w-5 h-5 text-primary" />
               </div>
               <div>
                 <p className="font-medium">Create Program</p>
                 <p className="text-sm text-muted-foreground">Design a new workout program</p>
               </div>
             </div>
             <ChevronRight className="h-5 w-5 text-muted-foreground" />
           </CardContent>
         </Card>
 
         <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
           <CardContent className="flex items-center justify-between p-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                 <Calendar className="w-5 h-5 text-primary" />
               </div>
               <div>
                 <p className="font-medium">View Schedule</p>
                 <p className="text-sm text-muted-foreground">See upcoming client sessions</p>
               </div>
             </div>
             <ChevronRight className="h-5 w-5 text-muted-foreground" />
           </CardContent>
         </Card>
       </div>
     </DashboardLayout>
   );
 }