import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FitnessTimeline } from "@/components/timeline/FitnessTimeline";
import { 
  Dumbbell,
  Eye,
  Edit,
  MessageSquare,
  Clock,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Calendar
} from "lucide-react";
 
 // Mock workout history data
 const mockWorkoutHistory = [
   {
     id: "1",
     date: "2026-02-05",
     name: "Upper Body Strength",
     trainer: "Mike Johnson",
     duration: 52,
     completed: true,
     exercises: 8,
     completedExercises: 8,
   },
   {
     id: "2",
     date: "2026-02-04",
     name: "Leg Day",
     trainer: "Mike Johnson",
     duration: 45,
     completed: true,
     exercises: 6,
     completedExercises: 5,
   },
   {
     id: "3",
     date: "2026-02-03",
     name: "Cardio & Core",
     trainer: "Mike Johnson",
     duration: 0,
     completed: false,
     exercises: 5,
     completedExercises: 0,
   },
   {
     id: "4",
     date: "2026-02-02",
     name: "Push Day",
     trainer: "Mike Johnson",
     duration: 58,
     completed: true,
     exercises: 7,
     completedExercises: 7,
   },
 ];
 
 // Mock access audit log
 const mockAccessLog = [
   {
     id: "1",
     accessedBy: "Mike Johnson",
     role: "Trainer",
     accessType: "view",
     resourceType: "Fitness Record",
     timestamp: "2026-02-05T10:30:00",
     duration: 120,
   },
   {
     id: "2",
     accessedBy: "FitZone Gym",
     role: "Gym Admin",
     accessType: "view",
     resourceType: "Profile",
     timestamp: "2026-02-04T14:15:00",
     duration: 45,
   },
   {
     id: "3",
     accessedBy: "Mike Johnson",
     role: "Trainer",
     accessType: "edit",
     resourceType: "Workout Plan",
     timestamp: "2026-02-03T09:00:00",
     duration: 300,
   },
   {
     id: "4",
     accessedBy: "Mike Johnson",
     role: "Trainer",
     accessType: "comment",
     resourceType: "Workout Log",
     timestamp: "2026-02-02T16:45:00",
     duration: 60,
   },
 ];
 
 
 const getAccessIcon = (type: string) => {
   switch (type) {
     case "view": return Eye;
     case "edit": return Edit;
     case "comment": return MessageSquare;
     default: return Eye;
   }
 };
 
const getAccessColor = (type: string) => {
  switch (type) {
    case "view": return "bg-info/10 text-info";
    case "edit": return "bg-warning/10 text-warning";
    case "comment": return "bg-success/10 text-success";
    default: return "bg-muted text-muted-foreground";
  }
};
 
 export default function Activity() {
   return (
     <DashboardLayout>
       <div className="mb-8">
         <h1 className="text-3xl font-bold mb-2">Activity</h1>
         <p className="text-muted-foreground">
           Your workout history and data access log.
         </p>
       </div>
 
       <Tabs defaultValue="workouts" className="space-y-6">
         <TabsList>
           <TabsTrigger value="workouts">Workout History</TabsTrigger>
           <TabsTrigger value="access">Access Log</TabsTrigger>
           <TabsTrigger value="timeline">Fitness Timeline</TabsTrigger>
         </TabsList>
 
         <TabsContent value="workouts" className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Dumbbell className="h-5 w-5 text-primary" />
                 Workout History
               </CardTitle>
               <CardDescription>
                 Your past workouts and completion status
               </CardDescription>
             </CardHeader>
             <CardContent>
               <ScrollArea className="h-[400px] pr-4">
                 <div className="space-y-3">
                   {mockWorkoutHistory.map((workout) => (
                     <div
                       key={workout.id}
                       className="flex items-center justify-between p-4 rounded-lg border bg-card"
                     >
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            workout.completed ? "bg-success/10" : "bg-destructive/10"
                          }`}>
                            {workout.completed ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                              <XCircle className="h-5 w-5 text-destructive" />
                            )}
                         </div>
                         <div>
                           <p className="font-medium">{workout.name}</p>
                           <div className="flex items-center gap-2 text-sm text-muted-foreground">
                             <Calendar className="h-3 w-3" />
                             {new Date(workout.date).toLocaleDateString()}
                             <span>•</span>
                             <User className="h-3 w-3" />
                             {workout.trainer}
                           </div>
                         </div>
                       </div>
                       <div className="text-right">
                         <Badge variant={workout.completed ? "default" : "destructive"}>
                           {workout.completed ? "Completed" : "Missed"}
                         </Badge>
                         <p className="text-sm text-muted-foreground mt-1">
                           {workout.completedExercises}/{workout.exercises} exercises
                           {workout.duration > 0 && ` • ${workout.duration} min`}
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
               </ScrollArea>
             </CardContent>
           </Card>
         </TabsContent>
 
         <TabsContent value="access" className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Shield className="h-5 w-5 text-primary" />
                 Data Access Log
               </CardTitle>
               <CardDescription>
                 Track who has accessed your fitness data
               </CardDescription>
             </CardHeader>
             <CardContent>
               <ScrollArea className="h-[400px] pr-4">
                 <div className="space-y-3">
                   {mockAccessLog.map((log) => {
                     const Icon = getAccessIcon(log.accessType);
                     return (
                       <div
                         key={log.id}
                         className="flex items-center justify-between p-4 rounded-lg border bg-card"
                       >
                         <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAccessColor(log.accessType)}`}>
                             <Icon className="h-5 w-5" />
                           </div>
                           <div>
                             <p className="font-medium">{log.accessedBy}</p>
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                               <Badge variant="outline" className="text-xs">
                                 {log.role}
                               </Badge>
                               <span>accessed</span>
                               <span className="font-medium">{log.resourceType}</span>
                             </div>
                           </div>
                         </div>
                         <div className="text-right">
                           <Badge variant="secondary" className="capitalize">
                             {log.accessType}
                           </Badge>
                           <p className="text-sm text-muted-foreground mt-1">
                             <Clock className="h-3 w-3 inline mr-1" />
                             {new Date(log.timestamp).toLocaleString()}
                           </p>
                           {log.duration && (
                             <p className="text-xs text-muted-foreground">
                               Duration: {Math.floor(log.duration / 60)}m {log.duration % 60}s
                             </p>
                           )}
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </ScrollArea>
             </CardContent>
           </Card>
         </TabsContent>
 
          <TabsContent value="timeline" className="space-y-4">
            <FitnessTimeline />
          </TabsContent>
       </Tabs>
     </DashboardLayout>
   );
 }