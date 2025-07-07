export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analytics_reports: {
        Row: {
          created_at: string
          id: string
          name: string
          snapshot: Json
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          snapshot: Json
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          snapshot?: Json
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          event_id: string | null
          guest_email: string | null
          guest_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: string
          message: string
          sender: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          sender: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          ai_suggested_times: Json | null
          capacity: number
          created_at: string
          date: string
          description: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          id: string
          location: string
          optimal_time_score: number | null
          registered: number
          status: string
          time: string
          title: string
          updated_at: string
        }
        Insert: {
          ai_suggested_times?: Json | null
          capacity?: number
          created_at?: string
          date: string
          description?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string
          location: string
          optimal_time_score?: number | null
          registered?: number
          status?: string
          time: string
          title: string
          updated_at?: string
        }
        Update: {
          ai_suggested_times?: Json | null
          capacity?: number
          created_at?: string
          date?: string
          description?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string
          location?: string
          optimal_time_score?: number | null
          registered?: number
          status?: string
          time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          category: Database["public"]["Enums"]["guest_category"] | null
          created_at: string
          dietary_restrictions: string | null
          email: string
          event_id: string | null
          event_title: string
          id: string
          name: string
          plus_one_email: string | null
          plus_one_name: string | null
          rsvp_date: string | null
          special_requests: string | null
          status: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["guest_category"] | null
          created_at?: string
          dietary_restrictions?: string | null
          email: string
          event_id?: string | null
          event_title: string
          id?: string
          name: string
          plus_one_email?: string | null
          plus_one_name?: string | null
          rsvp_date?: string | null
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["guest_category"] | null
          created_at?: string
          dietary_restrictions?: string | null
          email?: string
          event_id?: string | null
          event_title?: string
          id?: string
          name?: string
          plus_one_email?: string | null
          plus_one_name?: string | null
          rsvp_date?: string | null
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduling_suggestions: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          event_id: string | null
          factors_considered: Json | null
          id: string
          reasoning: string | null
          suggested_date: string | null
          suggested_time: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          event_id?: string | null
          factors_considered?: Json | null
          id?: string
          reasoning?: string | null
          suggested_date?: string | null
          suggested_time?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          event_id?: string | null
          factors_considered?: Json | null
          id?: string
          reasoning?: string | null
          suggested_date?: string | null
          suggested_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduling_suggestions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          category: Database["public"]["Enums"]["guest_category"] | null
          created_at: string | null
          email: string
          event_id: string | null
          id: string
          name: string
          notified_at: string | null
          position: number | null
          promoted_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["guest_category"] | null
          created_at?: string | null
          email: string
          event_id?: string | null
          id?: string
          name: string
          notified_at?: string | null
          position?: number | null
          promoted_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["guest_category"] | null
          created_at?: string | null
          email?: string
          event_id?: string | null
          id?: string
          name?: string
          notified_at?: string | null
          position?: number | null
          promoted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      event_type:
        | "corporate"
        | "wedding"
        | "conference"
        | "party"
        | "workshop"
        | "other"
      guest_category: "vip" | "regular" | "plus_one"
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
      event_type: [
        "corporate",
        "wedding",
        "conference",
        "party",
        "workshop",
        "other",
      ],
      guest_category: ["vip", "regular", "plus_one"],
    },
  },
} as const
