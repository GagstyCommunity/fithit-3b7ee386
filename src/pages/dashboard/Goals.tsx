 import { useState } from "react";
 import { DashboardLayout } from "@/components/layout/DashboardLayout";
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Progress } from "@/components/ui/progress";
 import { Badge } from "@/components/ui/badge";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Textarea } from "@/components/ui/textarea";
 import { Target, Plus, TrendingUp, Dumbbell, Heart, Zap, Activity } from "lucide-react";
 
 const goalTypes = [
   { value: "fat_loss", label: "Fat Loss", icon: TrendingUp, color: "text-orange-500" },
   { value: "muscle_gain", label: "Muscle Gain", icon: Dumbbell, color: "text-blue-500" },
   { value: "strength", label: "Strength", icon: Zap, color: "text-yellow-500" },
   { value: "endurance", label: "Endurance", icon: Activity, color: "text-green-500" },
   { value: "rehab", label: "Rehabilitation", icon: Heart, color: "text-red-500" },
   { value: "general", label: "General Fitness", icon: Target, color: "text-primary" },
 ];
 
 // Mock data - will be replaced with Supabase queries
 const mockGoals = [
   {
     id: "1",
     type: "fat_loss",
     title: "Lose 5kg",
     description: "Reach target weight of 75kg",
     targetValue: 5,
     currentValue: 2.5,
     unit: "kg",
     deadline: "2026-04-01",
     status: "active",
   },
   {
     id: "2",
     type: "strength",
     title: "Bench Press 100kg",
     description: "Increase bench press max",
     targetValue: 100,
     currentValue: 85,
     unit: "kg",
     deadline: "2026-06-01",
     status: "active",
   },
 ];
 
 export default function Goals() {
   const [dialogOpen, setDialogOpen] = useState(false);
 
   const getGoalIcon = (type: string) => {
     const goal = goalTypes.find((g) => g.value === type);
     return goal ? goal.icon : Target;
   };
 
   const getGoalColor = (type: string) => {
     const goal = goalTypes.find((g) => g.value === type);
     return goal ? goal.color : "text-primary";
   };
 
   return (
     <DashboardLayout>
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
         <div>
           <h1 className="text-3xl font-bold mb-2">Fitness Goals</h1>
           <p className="text-muted-foreground">
             Set and track your fitness objectives.
           </p>
         </div>
         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
           <DialogTrigger asChild>
             <Button>
               <Plus className="h-4 w-4 mr-2" />
               New Goal
             </Button>
           </DialogTrigger>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>Create New Goal</DialogTitle>
               <DialogDescription>
                 Set a fitness goal to track your progress.
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4 py-4">
               <div className="space-y-2">
                 <Label htmlFor="goalType">Goal Type</Label>
                 <Select>
                   <SelectTrigger>
                     <SelectValue placeholder="Select goal type" />
                   </SelectTrigger>
                   <SelectContent>
                     {goalTypes.map((type) => (
                       <SelectItem key={type.value} value={type.value}>
                         <div className="flex items-center gap-2">
                           <type.icon className={`h-4 w-4 ${type.color}`} />
                           {type.label}
                         </div>
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="title">Goal Title</Label>
                 <Input id="title" placeholder="e.g., Lose 5kg" />
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="description">Description</Label>
                 <Textarea id="description" placeholder="Describe your goal..." />
               </div>
 
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="target">Target Value</Label>
                   <Input id="target" type="number" placeholder="100" />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="unit">Unit</Label>
                   <Input id="unit" placeholder="kg, reps, min" />
                 </div>
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="deadline">Target Date</Label>
                 <Input id="deadline" type="date" />
               </div>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setDialogOpen(false)}>
                 Cancel
               </Button>
               <Button onClick={() => setDialogOpen(false)}>Create Goal</Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>
       </div>
 
       {/* Active Goals */}
       <div className="space-y-4 mb-8">
         <h2 className="text-lg font-semibold">Active Goals</h2>
         {mockGoals.length === 0 ? (
           <Card>
             <CardContent className="flex flex-col items-center justify-center py-12">
               <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                 <Target className="w-8 h-8 text-muted-foreground" />
               </div>
               <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
               <p className="text-muted-foreground text-center max-w-md mb-6">
                 Set your first fitness goal to start tracking your progress.
               </p>
               <Button onClick={() => setDialogOpen(true)}>
                 <Plus className="h-4 w-4 mr-2" />
                 Create Goal
               </Button>
             </CardContent>
           </Card>
         ) : (
           <div className="grid gap-4 md:grid-cols-2">
             {mockGoals.map((goal) => {
               const Icon = getGoalIcon(goal.type);
               const progress = (goal.currentValue / goal.targetValue) * 100;
               return (
                 <Card key={goal.id}>
                   <CardHeader className="pb-2">
                     <div className="flex items-start justify-between">
                       <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg bg-muted ${getGoalColor(goal.type)}`}>
                           <Icon className="h-5 w-5" />
                         </div>
                         <div>
                           <CardTitle className="text-base">{goal.title}</CardTitle>
                           <CardDescription>{goal.description}</CardDescription>
                         </div>
                       </div>
                       <Badge variant="secondary">Active</Badge>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-3">
                       <div className="flex items-center justify-between text-sm">
                         <span className="text-muted-foreground">Progress</span>
                         <span className="font-medium">
                           {goal.currentValue} / {goal.targetValue} {goal.unit}
                         </span>
                       </div>
                       <Progress value={progress} className="h-2" />
                       <div className="flex items-center justify-between text-sm">
                         <span className="text-muted-foreground">
                           Target: {new Date(goal.deadline).toLocaleDateString()}
                         </span>
                         <span className="font-medium text-primary">
                           {Math.round(progress)}% complete
                         </span>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               );
             })}
           </div>
         )}
       </div>
 
       {/* Goal Types Overview */}
       <div className="space-y-4">
         <h2 className="text-lg font-semibold">Goal Categories</h2>
         <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
           {goalTypes.map((type) => (
             <Card
               key={type.value}
               className="cursor-pointer hover:bg-muted/50 transition-colors"
               onClick={() => setDialogOpen(true)}
             >
               <CardContent className="flex flex-col items-center justify-center p-4">
                 <div className={`p-3 rounded-full bg-muted mb-2 ${type.color}`}>
                   <type.icon className="h-5 w-5" />
                 </div>
                 <span className="text-sm font-medium text-center">{type.label}</span>
               </CardContent>
             </Card>
           ))}
         </div>
       </div>
     </DashboardLayout>
   );
 }