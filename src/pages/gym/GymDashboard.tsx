 import { DashboardLayout } from "@/components/layout/DashboardLayout";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { 
   Building2, 
   Users, 
   UserCheck, 
   Calendar, 
   TrendingUp, 
   Star,
   Plus,
   ChevronRight,
   Bell
 } from "lucide-react";
 
 export default function GymDashboard() {
   return (
     <DashboardLayout>
       {/* Header */}
       <div className="flex items-center justify-between mb-8">
         <div>
           <h1 className="text-3xl font-bold mb-2">Gym Dashboard</h1>
           <p className="text-muted-foreground">
             Manage your gym, trainers, and members.
           </p>
         </div>
         <Button>
           <Bell className="h-4 w-4 mr-2" />
           Send Announcement
         </Button>
       </div>
 
       {/* Stats */}
       <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Total Members
             </CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">Active members</p>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Trainers
             </CardTitle>
             <UserCheck className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">On staff</p>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Upcoming Events
             </CardTitle>
             <Calendar className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">This month</p>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Gym Rating
             </CardTitle>
             <Star className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">--</div>
             <p className="text-xs text-muted-foreground">No reviews yet</p>
           </CardContent>
         </Card>
       </div>
 
       {/* Gym Profile Status */}
       <Card className="mb-6 border-dashed">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Building2 className="h-5 w-5 text-primary" />
             Gym Profile
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="flex flex-col items-center justify-center py-12">
             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
               <Building2 className="w-8 h-8 text-muted-foreground" />
             </div>
             <h3 className="text-lg font-semibold mb-2">Complete your gym profile</h3>
             <p className="text-muted-foreground text-center max-w-md mb-6">
               Add your gym details, facilities, photos, and get verified to attract more members.
             </p>
             <Button>
               Set Up Gym Profile
             </Button>
           </div>
         </CardContent>
       </Card>
 
       {/* Quick Actions */}
       <div className="grid gap-4 md:grid-cols-3">
         <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
           <CardContent className="flex items-center justify-between p-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                 <Users className="w-5 h-5 text-primary" />
               </div>
               <div>
                 <p className="font-medium">Manage Members</p>
                 <p className="text-sm text-muted-foreground">View and manage gym members</p>
               </div>
             </div>
             <ChevronRight className="h-5 w-5 text-muted-foreground" />
           </CardContent>
         </Card>
 
         <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
           <CardContent className="flex items-center justify-between p-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                 <UserCheck className="w-5 h-5 text-primary" />
               </div>
               <div>
                 <p className="font-medium">Add Trainer</p>
                 <p className="text-sm text-muted-foreground">Invite trainers to your gym</p>
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
                 <p className="font-medium">Create Event</p>
                 <p className="text-sm text-muted-foreground">Schedule classes or events</p>
               </div>
             </div>
             <ChevronRight className="h-5 w-5 text-muted-foreground" />
           </CardContent>
         </Card>
       </div>
     </DashboardLayout>
   );
 }