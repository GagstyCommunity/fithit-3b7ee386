 import { useAuth } from "@/hooks/useAuth";
 import { DashboardLayout } from "@/components/layout/DashboardLayout";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Dumbbell, Calendar, Target, Flame, Clock, ChevronRight } from "lucide-react";
 
 export default function UserDashboard() {
   const { user } = useAuth();
 
   return (
     <DashboardLayout>
       {/* Welcome Section */}
       <div className="mb-8">
         <h1 className="text-3xl font-bold mb-2">What To Do Today</h1>
         <p className="text-muted-foreground">
           Welcome back! Here's your fitness plan for today.
         </p>
       </div>
 
       {/* Quick Stats */}
       <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Today's Workout
             </CardTitle>
             <Dumbbell className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">Rest Day</div>
             <p className="text-xs text-muted-foreground">No workout scheduled</p>
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
             <div className="text-2xl font-bold">0 / 0</div>
             <p className="text-xs text-muted-foreground">Workouts completed</p>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Current Streak
             </CardTitle>
             <Flame className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">0 days</div>
             <p className="text-xs text-muted-foreground">Keep it going!</p>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Active Goals
             </CardTitle>
             <Target className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">Goals in progress</p>
           </CardContent>
         </Card>
       </div>
 
       {/* Today's Workout Card */}
       <Card className="mb-6">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Clock className="h-5 w-5 text-primary" />
             Today's Schedule
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="flex flex-col items-center justify-center py-12">
             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
               <Dumbbell className="w-8 h-8 text-muted-foreground" />
             </div>
             <h3 className="text-lg font-semibold mb-2">No workout for today</h3>
             <p className="text-muted-foreground text-center max-w-md mb-6">
               You don't have a workout assigned for today. Connect with a trainer to get personalized workout plans.
             </p>
             <Button disabled>
               Find a Trainer
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
                 <Target className="w-5 h-5 text-primary" />
               </div>
               <div>
                 <p className="font-medium">Set a Fitness Goal</p>
                 <p className="text-sm text-muted-foreground">Define what you want to achieve</p>
               </div>
             </div>
             <ChevronRight className="h-5 w-5 text-muted-foreground" />
           </CardContent>
         </Card>
 
         <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
           <CardContent className="flex items-center justify-between p-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                 <Dumbbell className="w-5 h-5 text-primary" />
               </div>
               <div>
                 <p className="font-medium">Log a Workout</p>
                 <p className="text-sm text-muted-foreground">Track your progress manually</p>
               </div>
             </div>
             <ChevronRight className="h-5 w-5 text-muted-foreground" />
           </CardContent>
         </Card>
       </div>
     </DashboardLayout>
   );
 }