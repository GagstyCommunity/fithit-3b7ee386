 import { useState } from "react";
 import { useAuth } from "@/hooks/useAuth";
 import { DashboardLayout } from "@/components/layout/DashboardLayout";
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Switch } from "@/components/ui/switch";
 import { Separator } from "@/components/ui/separator";
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
 import { User, Bell, Shield, Clock, Save } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 
 export default function ProfileSettings() {
   const { user } = useAuth();
   const { toast } = useToast();
   const [saving, setSaving] = useState(false);
 
   const handleSave = async () => {
     setSaving(true);
     // TODO: Implement save logic with Supabase
     setTimeout(() => {
       setSaving(false);
       toast({
         title: "Profile updated",
         description: "Your changes have been saved successfully.",
       });
     }, 1000);
   };
 
   return (
     <DashboardLayout>
       <div className="mb-8">
         <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
         <p className="text-muted-foreground">
           Manage your personal information and preferences.
         </p>
       </div>
 
       <div className="grid gap-6 max-w-2xl">
         {/* Personal Information */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <User className="h-5 w-5 text-primary" />
               Personal Information
             </CardTitle>
             <CardDescription>
               Update your personal details and profile picture.
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-6">
             <div className="flex items-center gap-4">
               <Avatar className="h-20 w-20">
                 <AvatarImage src="" />
                 <AvatarFallback className="text-lg bg-primary/10 text-primary">
                   {user?.email?.charAt(0).toUpperCase() || "U"}
                 </AvatarFallback>
               </Avatar>
               <Button variant="outline" size="sm">
                 Change Photo
               </Button>
             </div>
 
             <div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-2">
                 <Label htmlFor="fullName">Full Name</Label>
                 <Input id="fullName" placeholder="Enter your name" />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="phone">Phone Number</Label>
                 <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
               </div>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="email">Email Address</Label>
               <Input
                 id="email"
                 type="email"
                 value={user?.email || ""}
                 disabled
                 className="bg-muted"
               />
               <p className="text-xs text-muted-foreground">
                 Contact support to change your email address.
               </p>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="dob">Date of Birth</Label>
               <Input id="dob" type="date" />
             </div>
           </CardContent>
         </Card>
 
         {/* Workout Preferences */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Clock className="h-5 w-5 text-primary" />
               Workout Preferences
             </CardTitle>
             <CardDescription>
               Set your preferred workout time and timezone.
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="workoutTime">Preferred Workout Time</Label>
               <Select defaultValue="morning">
                 <SelectTrigger>
                   <SelectValue placeholder="Select time" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                   <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                   <SelectItem value="evening">Evening (5 PM - 9 PM)</SelectItem>
                   <SelectItem value="night">Night (9 PM - 12 AM)</SelectItem>
                 </SelectContent>
               </Select>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="timezone">Timezone</Label>
               <Select defaultValue="utc">
                 <SelectTrigger>
                   <SelectValue placeholder="Select timezone" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                   <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                   <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                   <SelectItem value="ist">IST (India Standard Time)</SelectItem>
                 </SelectContent>
               </Select>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="units">Preferred Units</Label>
               <Select defaultValue="metric">
                 <SelectTrigger>
                   <SelectValue placeholder="Select units" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                   <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </CardContent>
         </Card>
 
         {/* Notifications */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Bell className="h-5 w-5 text-primary" />
               Notifications
             </CardTitle>
             <CardDescription>
               Configure how you want to receive reminders.
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
               <div className="space-y-0.5">
                 <Label>Workout Reminders</Label>
                 <p className="text-sm text-muted-foreground">
                   Get notified before your scheduled workout.
                 </p>
               </div>
               <Switch defaultChecked />
             </div>
             <Separator />
             <div className="space-y-2">
               <Label>Reminder Time</Label>
               <Select defaultValue="60">
                 <SelectTrigger>
                   <SelectValue placeholder="Select time" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="15">15 minutes before</SelectItem>
                   <SelectItem value="30">30 minutes before</SelectItem>
                   <SelectItem value="60">1 hour before</SelectItem>
                   <SelectItem value="120">2 hours before</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </CardContent>
         </Card>
 
         {/* Privacy */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Shield className="h-5 w-5 text-primary" />
               Privacy & Security
             </CardTitle>
             <CardDescription>
               Control who can access your fitness data.
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
               <div className="space-y-0.5">
                 <Label>Hide Medical Notes</Label>
                 <p className="text-sm text-muted-foreground">
                   Keep medical information private from trainers.
                 </p>
               </div>
               <Switch defaultChecked />
             </div>
             <Separator />
             <div className="flex items-center justify-between">
               <div className="space-y-0.5">
                 <Label>Activity Logging</Label>
                 <p className="text-sm text-muted-foreground">
                   Track who accesses your fitness record.
                 </p>
               </div>
               <Switch defaultChecked />
             </div>
           </CardContent>
         </Card>
 
         <Button onClick={handleSave} disabled={saving} className="w-full">
           <Save className="h-4 w-4 mr-2" />
           {saving ? "Saving..." : "Save Changes"}
         </Button>
       </div>
     </DashboardLayout>
   );
 }