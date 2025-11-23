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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string
          candidate_id: string
          cover_letter: string | null
          feedback: string | null
          id: string
          job_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          applied_at?: string
          candidate_id: string
          cover_letter?: string | null
          feedback?: string | null
          id?: string
          job_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          applied_at?: string
          candidate_id?: string
          cover_letter?: string | null
          feedback?: string | null
          id?: string
          job_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_profiles: {
        Row: {
          bio: string | null
          created_at: string
          current_company: string | null
          current_role: string | null
          education: string | null
          expected_salary_range: string | null
          experience_years: number | null
          github_url: string | null
          id: string
          industry: string | null
          linkedin_url: string | null
          notice_period: string | null
          open_to_relocation: boolean | null
          preferred_employment_type: string | null
          preferred_job_titles: string[] | null
          remote_preference: string | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          current_company?: string | null
          current_role?: string | null
          education?: string | null
          expected_salary_range?: string | null
          experience_years?: number | null
          github_url?: string | null
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          notice_period?: string | null
          open_to_relocation?: boolean | null
          preferred_employment_type?: string | null
          preferred_job_titles?: string[] | null
          remote_preference?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          current_company?: string | null
          current_role?: string | null
          education?: string | null
          expected_salary_range?: string | null
          experience_years?: number | null
          github_url?: string | null
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          notice_period?: string | null
          open_to_relocation?: boolean | null
          preferred_employment_type?: string | null
          preferred_job_titles?: string[] | null
          remote_preference?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_education: {
        Row: {
          candidate_id: string
          created_at: string
          degree: string
          graduation_year: number | null
          id: string
          institution: string
          major: string | null
          start_year: number | null
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          degree: string
          graduation_year?: number | null
          id?: string
          institution: string
          major?: string | null
          start_year?: number | null
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          degree?: string
          graduation_year?: number | null
          id?: string
          institution?: string
          major?: string | null
          start_year?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_education_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      candidate_experiences: {
        Row: {
          candidate_id: string
          company_name: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          job_title: string
          start_date: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          company_name: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          job_title: string
          start_date: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          company_name?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          job_title?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_experiences_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      candidate_portfolio_projects: {
        Row: {
          candidate_id: string
          created_at: string
          description: string | null
          id: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          candidate_id: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          candidate_id?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_portfolio_projects_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company_id: string | null
          company_name: string | null
          created_at: string
          description: string
          id: string
          job_type: string
          location: string
          posted_by: string
          required_skills: string[] | null
          salary_range: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description: string
          id?: string
          job_type: string
          location: string
          posted_by: string
          required_skills?: string[] | null
          salary_range?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description?: string
          id?: string
          job_type?: string
          location?: string
          posted_by?: string
          required_skills?: string[] | null
          salary_range?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          location: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "candidate" | "recruiter" | "admin"
      application_status:
        | "pending"
        | "reviewing"
        | "interview"
        | "accepted"
        | "rejected"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["candidate", "recruiter", "admin"],
      application_status: [
        "pending",
        "reviewing",
        "interview",
        "accepted",
        "rejected",
      ],
    },
  },
} as const
