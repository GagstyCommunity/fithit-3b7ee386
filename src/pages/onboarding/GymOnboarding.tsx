import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const schema = z.object({
  gymName: z.string().min(2, "Gym name is required").max(120),
  city: z.string().min(2, "City is required").max(80),
  businessAddress: z.string().min(5, "Address is required").max(300),
  contactPhone: z.string().min(6).max(20),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  amenities: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function GymOnboarding() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gymName: "",
      city: "",
      businessAddress: "",
      contactPhone: "",
      website: "",
      amenities: "",
    },
  });

  useEffect(() => {
    if (authLoading || !user) return;
    supabase
      .from("gym_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          form.reset({
            gymName: data.gym_name ?? "",
            city: data.city ?? "",
            businessAddress: data.business_address ?? "",
            contactPhone: data.contact_phone ?? "",
            website: data.website ?? "",
            amenities: (data.amenities ?? []).join(", "),
          });
        }
      });
  }, [user, authLoading, form]);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    setSubmitting(true);
    const payload = {
      user_id: user.id,
      gym_name: values.gymName,
      city: values.city,
      business_address: values.businessAddress,
      contact_phone: values.contactPhone,
      website: values.website || null,
      amenities: (values.amenities ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      profile_complete: true,
    };

    const { error } = await supabase
      .from("gym_profiles")
      .upsert(payload, { onConflict: "user_id" });

    setSubmitting(false);
    if (error) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
      return;
    }
    toast({ title: "Gym profile complete", description: "Welcome to your gym dashboard." });
    navigate("/gym", { replace: true });
  };

  return (
    <AuthLayout
      title="Complete your gym profile"
      subtitle="Members will discover you with this info."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="gymName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gym name</FormLabel>
                <FormControl>
                  <Input placeholder="Iron Temple Fitness" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Gurgaon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business address</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="Full street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+91..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (optional)</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <Input placeholder="Sauna, Cardio zone, Free weights, Showers" {...field} />
                </FormControl>
                <FormDescription>Comma separated</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Finish & enter dashboard"
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
