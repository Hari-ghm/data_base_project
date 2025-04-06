export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          employee_id: string
          name: string
          email: string
          school: string
          created_at: string
        }
        Insert: {
          id: string
          employee_id: string
          name: string
          email: string
          school: string
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          name?: string
          email?: string
          school?: string
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          year: number
          stream: string
          course_type: string | null
          course_code: string
          course_title: string
          lecture_hours: number
          tutorial_hours: number
          practical_hours: number
          credits: number
          prerequisites: string | null
          school: string
          forenoon_slots: number
          afternoon_slots: number
          total_slots: number
          basket: string | null
          created_at: string
        }
        Insert: {
          id?: string
          year: number
          stream: string
          course_type?: string | null
          course_code: string
          course_title: string
          lecture_hours?: number
          tutorial_hours?: number
          practical_hours?: number
          credits?: number
          prerequisites?: string | null
          school: string
          forenoon_slots?: number
          afternoon_slots?: number
          total_slots?: number
          basket?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          year?: number
          stream?: string
          course_type?: string | null
          course_code?: string
          course_title?: string
          lecture_hours?: number
          tutorial_hours?: number
          practical_hours?: number
          credits?: number
          prerequisites?: string | null
          school?: string
          forenoon_slots?: number
          afternoon_slots?: number
          total_slots?: number
          basket?: string | null
          created_at?: string
        }
      }
      course_allocations: {
        Row: {
          id: string
          course_id: string
          user_id: string
          slot_type: string
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          user_id: string
          slot_type: string
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          user_id?: string
          slot_type?: string
          created_at?: string
        }
      }
    }
    Functions: {
      allocate_course: {
        Args: {
          p_course_id: string
          p_slot_type: string
        }
        Returns: string
      }
    }
  }
}