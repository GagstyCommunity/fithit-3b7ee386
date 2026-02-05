 import { DashboardLayout } from "@/components/layout/DashboardLayout";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { 
   Shield, 
   Users, 
   Building2, 
   UserCheck, 
   AlertTriangle,
   TrendingUp,
   ChevronRight
 } from "lucide-react";
 
 export default function AdminDashboard() {
   return (
     <DashboardLayout>
       {/* Header */}
       <div className="mb-8">
         <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
         <p className="text-muted-foreground">
           Platform administration and oversight.
         </p>
       </div>
 
       {/* Platform Stats */}
       <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Total Users
             </CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">Registered users</p>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Gyms
             </CardTitle>
             <Building2 className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">Registered gyms</p>
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
             <p className="text-xs text-muted-foreground">Active trainers</p>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Reports
             </CardTitle>
             <AlertTriangle className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">Pending review</p>
           </CardContent>
         </Card>
       </div>
 
       {/* Admin Actions */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
           <CardContent className="flex items-center justify-between p-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                 <Users className="w-5 h-5 text-primary" />
               </div>
               <div>
                 <p className="font-medium">Manage Users</p>
                 <p className="text-sm text-muted-foreground">View and manage all users</p>
               </div>
             </div>
             <ChevronRight className="h-5 w-5 text-muted-foreground" />
           </CardContent>
         </Card>
 
         <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
           <CardContent className="flex items-center justify-between p-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                 <Building2 className="w-5 h-5 text-primary" />
               </div>
               <div>
                 <p className="font-medium">Gym Verification</p>
                 <p className="text-sm text-muted-foreground">Review gym applications</p>
               </div>
             </div>
             <ChevronRight className="h-5 w-5 text-muted-foreground" />
           </CardContent>
         </Card>
 
         <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
           <CardContent className="flex items-center justify-between p-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                 <AlertTriangle className="w-5 h-5 text-destructive" />
               </div>
               <div>
                 <p className="font-medium">Review Reports</p>
                 <p className="text-sm text-muted-foreground">Handle user concerns</p>
               </div>
             </div>
             <ChevronRight className="h-5 w-5 text-muted-foreground" />
           </CardContent>
         </Card>
 
         <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
           <CardContent className="flex items-center justify-between p-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                 <Shield className="w-5 h-5 text-primary" />
               </div>
               <div>
                 <p className="font-medium">Role Management</p>
                 <p className="text-sm text-muted-foreground">Assign user roles</p>
               </div>
             </div>
             <ChevronRight className="h-5 w-5 text-muted-foreground" />
           </CardContent>
         </Card>
 
         <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
           <CardContent className="flex items-center justify-between p-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                 <TrendingUp className="w-5 h-5 text-primary" />
               </div>
               <div>
                 <p className="font-medium">Platform Analytics</p>
                 <p className="text-sm text-muted-foreground">View usage statistics</p>
               </div>
             </div>
             <ChevronRight className="h-5 w-5 text-muted-foreground" />
           </CardContent>
         </Card>
       </div>
     </DashboardLayout>
   );
 }