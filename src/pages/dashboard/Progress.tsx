 import { DashboardLayout } from "@/components/layout/DashboardLayout";
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { 
   TrendingUp, 
   TrendingDown, 
   Scale, 
   Ruler, 
   Percent, 
   Trophy, 
   Flame,
   Target,
   Calendar,
   Plus
 } from "lucide-react";
 
 // Mock data - will be replaced with Supabase queries
 const mockWeightHistory = [
   { date: "2026-02-01", weight: 82.5 },
   { date: "2026-01-25", weight: 83.0 },
   { date: "2026-01-18", weight: 83.2 },
   { date: "2026-01-11", weight: 84.0 },
   { date: "2026-01-04", weight: 84.5 },
 ];
 
 const mockAchievements = [
   { id: "1", title: "First Workout", description: "Completed your first workout", date: "2026-01-05", icon: Trophy },
   { id: "2", title: "Week Warrior", description: "7-day workout streak", date: "2026-01-15", icon: Flame },
   { id: "3", title: "Goal Setter", description: "Created your first goal", date: "2026-01-10", icon: Target },
 ];
 
 const mockStats = {
   currentWeight: 82.5,
   startWeight: 85.0,
   targetWeight: 75.0,
   height: 178,
   bmi: 26.0,
   bodyFat: null,
   streak: 5,
   totalWorkouts: 24,
   thisMonth: 8,
 };
 
 export default function Progress() {
   const weightChange = mockStats.startWeight - mockStats.currentWeight;
   const isLosingWeight = weightChange > 0;
 
   return (
     <DashboardLayout>
       <div className="mb-8">
         <h1 className="text-3xl font-bold mb-2">My Progress</h1>
         <p className="text-muted-foreground">
           Track your fitness journey and achievements.
         </p>
       </div>
 
       {/* Stats Overview */}
       <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Current Weight
             </CardTitle>
             <Scale className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{mockStats.currentWeight} kg</div>
             <div className="flex items-center gap-1 text-sm">
               {isLosingWeight ? (
                 <>
                   <TrendingDown className="h-4 w-4 text-green-500" />
                   <span className="text-green-500">-{weightChange.toFixed(1)} kg</span>
                 </>
               ) : (
                 <>
                   <TrendingUp className="h-4 w-4 text-orange-500" />
                   <span className="text-orange-500">+{Math.abs(weightChange).toFixed(1)} kg</span>
                 </>
               )}
               <span className="text-muted-foreground">from start</span>
             </div>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               BMI
             </CardTitle>
             <Ruler className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{mockStats.bmi.toFixed(1)}</div>
             <p className="text-xs text-muted-foreground">
               {mockStats.bmi < 18.5 ? "Underweight" : 
                mockStats.bmi < 25 ? "Normal" : 
                mockStats.bmi < 30 ? "Overweight" : "Obese"}
             </p>
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
             <div className="text-2xl font-bold">{mockStats.streak} days</div>
             <p className="text-xs text-muted-foreground">Keep it going!</p>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Total Workouts
             </CardTitle>
             <Calendar className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{mockStats.totalWorkouts}</div>
             <p className="text-xs text-muted-foreground">
               {mockStats.thisMonth} this month
             </p>
           </CardContent>
         </Card>
       </div>
 
       <Tabs defaultValue="weight" className="space-y-6">
         <TabsList>
           <TabsTrigger value="weight">Weight History</TabsTrigger>
           <TabsTrigger value="achievements">Achievements</TabsTrigger>
           <TabsTrigger value="body">Body Metrics</TabsTrigger>
         </TabsList>
 
         <TabsContent value="weight" className="space-y-4">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between">
               <div>
                 <CardTitle>Weight History</CardTitle>
                 <CardDescription>Track your weight over time</CardDescription>
               </div>
               <Button size="sm">
                 <Plus className="h-4 w-4 mr-2" />
                 Log Weight
               </Button>
             </CardHeader>
             <CardContent>
               {mockWeightHistory.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-12">
                   <Scale className="h-12 w-12 text-muted-foreground mb-4" />
                   <p className="text-muted-foreground">No weight entries yet</p>
                 </div>
               ) : (
                 <div className="space-y-3">
                   {mockWeightHistory.map((entry, index) => {
                     const prevWeight = mockWeightHistory[index + 1]?.weight;
                     const change = prevWeight ? entry.weight - prevWeight : 0;
                     return (
                       <div
                         key={entry.date}
                         className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                       >
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                             <Scale className="h-5 w-5 text-primary" />
                           </div>
                           <div>
                             <p className="font-medium">{entry.weight} kg</p>
                             <p className="text-sm text-muted-foreground">
                               {new Date(entry.date).toLocaleDateString()}
                             </p>
                           </div>
                         </div>
                         {change !== 0 && (
                           <Badge variant={change < 0 ? "default" : "secondary"}>
                             {change > 0 ? "+" : ""}{change.toFixed(1)} kg
                           </Badge>
                         )}
                       </div>
                     );
                   })}
                 </div>
               )}
             </CardContent>
           </Card>
         </TabsContent>
 
         <TabsContent value="achievements" className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle>Achievements</CardTitle>
               <CardDescription>Your fitness milestones and badges</CardDescription>
             </CardHeader>
             <CardContent>
               {mockAchievements.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-12">
                   <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                   <p className="text-muted-foreground">No achievements yet</p>
                 </div>
               ) : (
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                   {mockAchievements.map((achievement) => (
                     <div
                       key={achievement.id}
                       className="flex items-center gap-3 p-4 rounded-lg border bg-card"
                     >
                       <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                         <achievement.icon className="h-6 w-6 text-primary" />
                       </div>
                       <div>
                         <p className="font-medium">{achievement.title}</p>
                         <p className="text-sm text-muted-foreground">
                           {achievement.description}
                         </p>
                         <p className="text-xs text-muted-foreground mt-1">
                           {new Date(achievement.date).toLocaleDateString()}
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </CardContent>
           </Card>
         </TabsContent>
 
         <TabsContent value="body" className="space-y-4">
           <div className="grid gap-4 md:grid-cols-2">
             <Card>
               <CardHeader>
                 <CardTitle className="text-base">Body Measurements</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-muted-foreground">Height</span>
                   <span className="font-medium">{mockStats.height} cm</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-muted-foreground">Current Weight</span>
                   <span className="font-medium">{mockStats.currentWeight} kg</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-muted-foreground">Target Weight</span>
                   <span className="font-medium">{mockStats.targetWeight} kg</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-muted-foreground">BMI</span>
                   <span className="font-medium">{mockStats.bmi.toFixed(1)}</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-muted-foreground">Body Fat %</span>
                   <span className="font-medium">
                     {mockStats.bodyFat ? `${mockStats.bodyFat}%` : "Not set"}
                   </span>
                 </div>
               </CardContent>
             </Card>
 
             <Card>
               <CardHeader>
                 <CardTitle className="text-base">Weight Goal Progress</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   <div className="flex justify-between text-sm">
                     <span>Start: {mockStats.startWeight} kg</span>
                     <span>Target: {mockStats.targetWeight} kg</span>
                   </div>
                   <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                     <div
                       className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
                       style={{
                         width: `${Math.min(
                           100,
                           ((mockStats.startWeight - mockStats.currentWeight) /
                             (mockStats.startWeight - mockStats.targetWeight)) *
                             100
                         )}%`,
                       }}
                     />
                   </div>
                   <div className="text-center">
                     <p className="text-2xl font-bold text-primary">
                       {(mockStats.targetWeight - mockStats.currentWeight).toFixed(1)} kg
                     </p>
                     <p className="text-sm text-muted-foreground">remaining to goal</p>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </div>
         </TabsContent>
       </Tabs>
     </DashboardLayout>
   );
 }