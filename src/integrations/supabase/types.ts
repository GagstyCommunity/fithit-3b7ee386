export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      access_audit_log: {
        Row: {
          access_type: string
          accessed_at: string
          accessed_by: string
          duration_seconds: number | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string
          user_id: string
        }
        Insert: {
          access_type: string
          accessed_at?: string
          accessed_by: string
          duration_seconds?: number | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type: string
          user_id: string
        }
        Update: {
          access_type?: string
          accessed_at?: string
          accessed_by?: string
          duration_seconds?: number | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string
          user_id?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          achievement_type: string
          description: string | null
          earned_at: string
          id: string
          metadata: Json | null
          title: string
          user_id: string
        }
        Insert: {
          achievement_type: string
          description?: string | null
          earned_at?: string
          id?: string
          metadata?: Json | null
          title: string
          user_id: string
        }
        Update: {
          achievement_type?: string
          description?: string | null
          earned_at?: string
          id?: string
          metadata?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_workouts: {
        Row: {
          created_at: string
          day_of_week: number
          estimated_duration: number | null
          id: string
          name: string
          safety_notes: string | null
          split_id: string
          trainer_notes_private: string | null
          trainer_notes_shared: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          estimated_duration?: number | null
          id?: string
          name: string
          safety_notes?: string | null
          split_id: string
          trainer_notes_private?: string | null
          trainer_notes_shared?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          estimated_duration?: number | null
          id?: string
          name?: string
          safety_notes?: string | null
          split_id?: string
          trainer_notes_private?: string | null
          trainer_notes_shared?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_workouts_split_id_fkey"
            columns: ["split_id"]
            isOneToOne: false
            referencedRelation: "weekly_splits"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_logs: {
        Row: {
          actual_reps: string | null
          actual_weight: number | null
          created_at: string
          id: string
          sets_completed: number | null
          status: string
          user_note: string | null
          workout_exercise_id: string
          workout_log_id: string
        }
        Insert: {
          actual_reps?: string | null
          actual_weight?: number | null
          created_at?: string
          id?: string
          sets_completed?: number | null
          status?: string
          user_note?: string | null
          workout_exercise_id: string
          workout_log_id: string
        }
        Update: {
          actual_reps?: string | null
          actual_weight?: number | null
          created_at?: string
          id?: string
          sets_completed?: number | null
          status?: string
          user_note?: string | null
          workout_exercise_id?: string
          workout_log_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_workout_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_workout_log_id_fkey"
            columns: ["workout_log_id"]
            isOneToOne: false
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          body_part: string
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          equipment: string[] | null
          id: string
          instructions: string[] | null
          is_global: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          body_part: string
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          equipment?: string[] | null
          id?: string
          instructions?: string[] | null
          is_global?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          body_part?: string
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          equipment?: string[] | null
          id?: string
          instructions?: string[] | null
          is_global?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      fitness_goals: {
        Row: {
          created_at: string
          current_value: number | null
          description: string | null
          goal_type: string
          id: string
          start_date: string
          status: string
          target_date: string | null
          target_unit: string | null
          target_value: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          goal_type: string
          id?: string
          start_date?: string
          status?: string
          target_date?: string | null
          target_unit?: string | null
          target_value?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          goal_type?: string
          id?: string
          start_date?: string
          status?: string
          target_date?: string | null
          target_unit?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fitness_records: {
        Row: {
          arms_cm: number | null
          available_equipment: string[] | null
          body_fat_percentage: number | null
          chest_cm: number | null
          created_at: string
          current_injuries: string[] | null
          current_weight_kg: number | null
          doctor_restrictions: string | null
          fitness_level: Database["public"]["Enums"]["fitness_level"] | null
          food_allergies: string[] | null
          height_cm: number | null
          hips_cm: number | null
          id: string
          medical_notes_private: boolean | null
          pain_areas: string[] | null
          past_injuries: string[] | null
          preferred_days: string[] | null
          preferred_duration: number | null
          preferred_units: string | null
          primary_goal: string | null
          supplement_allergies: string[] | null
          target_weight_kg: number | null
          thighs_cm: number | null
          training_experience: string | null
          training_location: string | null
          updated_at: string
          user_id: string
          waist_cm: number | null
          workout_frequency: number | null
        }
        Insert: {
          arms_cm?: number | null
          available_equipment?: string[] | null
          body_fat_percentage?: number | null
          chest_cm?: number | null
          created_at?: string
          current_injuries?: string[] | null
          current_weight_kg?: number | null
          doctor_restrictions?: string | null
          fitness_level?: Database["public"]["Enums"]["fitness_level"] | null
          food_allergies?: string[] | null
          height_cm?: number | null
          hips_cm?: number | null
          id?: string
          medical_notes_private?: boolean | null
          pain_areas?: string[] | null
          past_injuries?: string[] | null
          preferred_days?: string[] | null
          preferred_duration?: number | null
          preferred_units?: string | null
          primary_goal?: string | null
          supplement_allergies?: string[] | null
          target_weight_kg?: number | null
          thighs_cm?: number | null
          training_experience?: string | null
          training_location?: string | null
          updated_at?: string
          user_id: string
          waist_cm?: number | null
          workout_frequency?: number | null
        }
        Update: {
          arms_cm?: number | null
          available_equipment?: string[] | null
          body_fat_percentage?: number | null
          chest_cm?: number | null
          created_at?: string
          current_injuries?: string[] | null
          current_weight_kg?: number | null
          doctor_restrictions?: string | null
          fitness_level?: Database["public"]["Enums"]["fitness_level"] | null
          food_allergies?: string[] | null
          height_cm?: number | null
          hips_cm?: number | null
          id?: string
          medical_notes_private?: boolean | null
          pain_areas?: string[] | null
          past_injuries?: string[] | null
          preferred_days?: string[] | null
          preferred_duration?: number | null
          preferred_units?: string | null
          primary_goal?: string | null
          supplement_allergies?: string[] | null
          target_weight_kg?: number | null
          thighs_cm?: number | null
          training_experience?: string | null
          training_location?: string | null
          updated_at?: string
          user_id?: string
          waist_cm?: number | null
          workout_frequency?: number | null
        }
        Relationships: []
      }
      gym_profiles: {
        Row: {
          amenities: string[] | null
          business_address: string | null
          city: string | null
          contact_phone: string | null
          created_at: string
          gym_name: string
          id: string
          opening_hours: Json | null
          profile_complete: boolean
          updated_at: string
          user_id: string
          verified: boolean
          website: string | null
        }
        Insert: {
          amenities?: string[] | null
          business_address?: string | null
          city?: string | null
          contact_phone?: string | null
          created_at?: string
          gym_name?: string
          id?: string
          opening_hours?: Json | null
          profile_complete?: boolean
          updated_at?: string
          user_id: string
          verified?: boolean
          website?: string | null
        }
        Update: {
          amenities?: string[] | null
          business_address?: string | null
          city?: string | null
          contact_phone?: string | null
          created_at?: string
          gym_name?: string
          id?: string
          opening_hours?: Json | null
          profile_complete?: boolean
          updated_at?: string
          user_id?: string
          verified?: boolean
          website?: string | null
        }
        Relationships: []
      }
      invitations: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          invite_code: string
          invite_type: string
          message: string | null
          recipient_email: string | null
          recipient_id: string | null
          responded_at: string | null
          sender_id: string
          sender_role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          invite_code?: string
          invite_type: string
          message?: string | null
          recipient_email?: string | null
          recipient_id?: string | null
          responded_at?: string | null
          sender_id: string
          sender_role: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          invite_code?: string
          invite_type?: string
          message?: string | null
          recipient_email?: string | null
          recipient_id?: string | null
          responded_at?: string | null
          sender_id?: string
          sender_role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          fitness_id: string | null
          full_name: string | null
          gender: string | null
          id: string
          location: string | null
          notification_preferences: Json | null
          onboarding_completed: boolean
          phone: string | null
          preferred_workout_time: string | null
          timezone: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          fitness_id?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean
          phone?: string | null
          preferred_workout_time?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          fitness_id?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean
          phone?: string | null
          preferred_workout_time?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      referral_earnings: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          period_end: string
          period_start: string
          referral_id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          period_end: string
          period_start: string
          referral_id: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          period_end?: string
          period_start?: string
          referral_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_earnings_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          commission_percent: number
          created_at: string
          expires_at: string
          id: string
          referral_code: string | null
          referred_user_id: string
          referrer_id: string
          referrer_role: string
          status: string
        }
        Insert: {
          commission_percent?: number
          created_at?: string
          expires_at?: string
          id?: string
          referral_code?: string | null
          referred_user_id: string
          referrer_id: string
          referrer_role: string
          status?: string
        }
        Update: {
          commission_percent?: number
          created_at?: string
          expires_at?: string
          id?: string
          referral_code?: string | null
          referred_user_id?: string
          referrer_id?: string
          referrer_role?: string
          status?: string
        }
        Relationships: []
      }
      session_sets: {
        Row: {
          actual_reps: number | null
          actual_weight: number | null
          completed: boolean
          created_at: string
          exercise_id: string | null
          exercise_index: number
          exercise_name: string
          id: string
          notes: string | null
          rest_seconds: number | null
          session_id: string
          set_number: number
          target_reps: string | null
          target_weight: number | null
        }
        Insert: {
          actual_reps?: number | null
          actual_weight?: number | null
          completed?: boolean
          created_at?: string
          exercise_id?: string | null
          exercise_index?: number
          exercise_name: string
          id?: string
          notes?: string | null
          rest_seconds?: number | null
          session_id: string
          set_number: number
          target_reps?: string | null
          target_weight?: number | null
        }
        Update: {
          actual_reps?: number | null
          actual_weight?: number | null
          completed?: boolean
          created_at?: string
          exercise_id?: string | null
          exercise_index?: number
          exercise_name?: string
          id?: string
          notes?: string | null
          rest_seconds?: number | null
          session_id?: string
          set_number?: number
          target_reps?: string | null
          target_weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_sets_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_sets_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          metadata: Json | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_type: string
          id?: string
          metadata?: Json | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      trainer_clients: {
        Row: {
          access_level: string
          client_id: string
          ended_at: string | null
          id: string
          notes: string | null
          started_at: string
          status: string
          trainer_id: string
        }
        Insert: {
          access_level?: string
          client_id: string
          ended_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string
          status?: string
          trainer_id: string
        }
        Update: {
          access_level?: string
          client_id?: string
          ended_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string
          status?: string
          trainer_id?: string
        }
        Relationships: []
      }
      trainer_profiles: {
        Row: {
          accepting_clients: boolean
          bio: string | null
          certifications: string[] | null
          created_at: string
          hourly_rate: number | null
          id: string
          profile_complete: boolean
          specialties: string[] | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          accepting_clients?: boolean
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          profile_complete?: boolean
          specialties?: string[] | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          accepting_clients?: boolean
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          profile_complete?: boolean
          specialties?: string[] | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_workout_exercises: {
        Row: {
          created_at: string
          duration_seconds: number | null
          exercise_id: string
          id: string
          notes: string | null
          order_index: number
          reps: string
          rest_seconds: number
          sets: number
          weight_kg: number | null
          workout_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          exercise_id: string
          id?: string
          notes?: string | null
          order_index?: number
          reps?: string
          rest_seconds?: number
          sets?: number
          weight_kg?: number | null
          workout_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          exercise_id?: string
          id?: string
          notes?: string | null
          order_index?: number
          reps?: string
          rest_seconds?: number
          sets?: number
          weight_kg?: number | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "user_workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_workouts: {
        Row: {
          archived: boolean
          created_at: string
          estimated_duration: number | null
          focus: string | null
          id: string
          is_template: boolean
          name: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          created_at?: string
          estimated_duration?: number | null
          focus?: string | null
          id?: string
          is_template?: boolean
          name: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          created_at?: string
          estimated_duration?: number | null
          focus?: string | null
          id?: string
          is_template?: boolean
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          lifetime_earnings: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          lifetime_earnings?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          lifetime_earnings?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      water_logs: {
        Row: {
          amount_ml: number
          created_at: string
          id: string
          logged_date: string
          user_id: string
        }
        Insert: {
          amount_ml: number
          created_at?: string
          id?: string
          logged_date?: string
          user_id: string
        }
        Update: {
          amount_ml?: number
          created_at?: string
          id?: string
          logged_date?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_splits: {
        Row: {
          created_at: string
          id: string
          name: string | null
          notes: string | null
          program_id: string
          week_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          notes?: string | null
          program_id: string
          week_number: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          notes?: string | null
          program_id?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "weekly_splits_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "workout_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_history: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          recorded_at: string
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          recorded_at?: string
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          recorded_at?: string
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          order_index: number
          reps: string
          rest_seconds: number | null
          sets: number
          total_weight: number | null
          trainer_note: string | null
          weight_per_side: number | null
          workout_id: string
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          order_index?: number
          reps?: string
          rest_seconds?: number | null
          sets?: number
          total_weight?: number | null
          trainer_note?: string | null
          weight_per_side?: number | null
          workout_id: string
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          order_index?: number
          reps?: string
          rest_seconds?: number | null
          sets?: number
          total_weight?: number | null
          trainer_note?: string | null
          weight_per_side?: number | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "daily_workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_logs: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          created_at: string
          duration_minutes: number | null
          id: string
          scheduled_date: string
          started_at: string | null
          status: string
          total_volume: number | null
          updated_at: string
          user_id: string
          user_notes: string | null
          workout_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          scheduled_date: string
          started_at?: string | null
          status?: string
          total_volume?: number | null
          updated_at?: string
          user_id: string
          user_notes?: string | null
          workout_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          scheduled_date?: string
          started_at?: string | null
          status?: string
          total_volume?: number | null
          updated_at?: string
          user_id?: string
          user_notes?: string | null
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "daily_workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_programs: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          duration_weeks: number
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string
          trainer_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          duration_weeks?: number
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string
          trainer_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          duration_weeks?: number
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string
          trainer_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          accumulated_seconds: number
          created_at: string
          current_exercise_index: number
          current_set_index: number
          daily_workout_id: string | null
          ended_at: string | null
          id: string
          name: string
          notes: string | null
          paused_at: string | null
          started_at: string
          state: string
          total_reps: number
          total_sets: number
          total_volume: number
          updated_at: string
          user_id: string
          user_workout_id: string | null
        }
        Insert: {
          accumulated_seconds?: number
          created_at?: string
          current_exercise_index?: number
          current_set_index?: number
          daily_workout_id?: string | null
          ended_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          paused_at?: string | null
          started_at?: string
          state?: string
          total_reps?: number
          total_sets?: number
          total_volume?: number
          updated_at?: string
          user_id: string
          user_workout_id?: string | null
        }
        Update: {
          accumulated_seconds?: number
          created_at?: string
          current_exercise_index?: number
          current_set_index?: number
          daily_workout_id?: string | null
          ended_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          paused_at?: string | null
          started_at?: string
          state?: string
          total_reps?: number
          total_sets?: number
          total_volume?: number
          updated_at?: string
          user_id?: string
          user_workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_daily_workout_id_fkey"
            columns: ["daily_workout_id"]
            isOneToOne: false
            referencedRelation: "daily_workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_user_workout_id_fkey"
            columns: ["user_workout_id"]
            isOneToOne: false
            referencedRelation: "user_workouts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_fitness_id: { Args: never; Returns: string }
      get_fitness_score: { Args: { _user_id: string }; Returns: number }
      get_gym_profile_completion: {
        Args: { _user_id: string }
        Returns: number
      }
      get_trainer_profile_completion: {
        Args: { _user_id: string }
        Returns: number
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      get_user_streak: { Args: { _user_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      self_assign_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: undefined
      }
    }
    Enums: {
      access_level: "view" | "comment" | "edit"
      app_role: "user" | "trainer" | "gym_admin" | "super_admin"
      fitness_level: "beginner" | "intermediate" | "advanced" | "athlete"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_level: ["view", "comment", "edit"],
      app_role: ["user", "trainer", "gym_admin", "super_admin"],
      fitness_level: ["beginner", "intermediate", "advanced", "athlete"],
    },
  },
} as const
