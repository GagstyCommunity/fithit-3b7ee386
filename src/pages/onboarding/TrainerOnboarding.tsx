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
  bio: z.string().min(20, "Tell clients a little about yourself (min 20 chars)").max(1000),
  yearsExperience: z.coerce.number().int().min(0).max(70),
  specialties: z.string().min(2, "Add at least one specialty"),
  certifications: z.string().optional(),
  hourlyRate: z.coerce.number().min(0).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function TrainerOnboarding() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bio: "",
      yearsExperience: 0,
      specialties: "",
      certifications: "",
      hourlyRate: undefined,
    },
  });

  useEffect(() => {
    if (authLoading || !user) return;
    // Pre-fill from existing draft
    supabase
      .from("trainer_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          form.reset({
            bio: data.bio ?? "",
            yearsExperience: data.years_experience ?? 0,
            specialties: (data.specialties ?? []).join(", "),
            certifications: (data.certifications ?? []).join(", "),
            hourlyRate: data.hourly_rate ?? undefined,
          });
        }
      });
  }, [user, authLoading, form]);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    setSubmitting(true);
    const payload = {
      user_id: user.id,
      bio: values.bio,
      years_experience: values.yearsExperience,
      specialties: values.specialties.split(",").map((s) => s.trim()).filter(Boolean),
      certifications: (values.certifications ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      hourly_rate: values.hourlyRate ?? null,
      profile_complete: true,
    };

    const { error } = await supabase
      .from("trainer_profiles")
      .upsert(payload, { onConflict: "user_id" });

    setSubmitting(false);
    if (error) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
      return;
    }
    toast({ title: "Profile complete", description: "Welcome to your trainer dashboard." });
    navigate("/trainer", { replace: true });
  };

  return (
    <AuthLayout
      title="Complete your trainer profile"
      subtitle="This is what gyms and clients will see."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Your training philosophy, experience..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearsExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of experience</FormLabel>
                <FormControl>
                  <Input type="number" min={0} max={70} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialties"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialties</FormLabel>
                <FormControl>
                  <Input placeholder="Strength, Fat loss, Yoga, Rehab" {...field} />
                </FormControl>
                <FormDescription>Comma separated</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="certifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certifications (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="NASM-CPT, ACE, ..." {...field} />
                </FormControl>
                <FormDescription>Comma separated</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly rate ₹ (optional)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={50} {...field} value={field.value ?? ""} />
                </FormControl>
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
