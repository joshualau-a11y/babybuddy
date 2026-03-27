export type UserRole = "parent" | "sitter";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  location?: string;
  created_at: string;
}

export interface SitterProfile extends Profile {
  hourly_rate: number;
  years_experience: number;
  certifications: string[];
  rating: number;
  review_count: number;
}

export interface Availability {
  id: string;
  sitter_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export interface Booking {
  id: string;
  parent_id: string;
  sitter_id: string;
  availability_id: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  child_count: number;
  message?: string;
  created_at: string;
  sitter?: SitterProfile;
  parent?: Profile;
  availability?: Availability;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  parent_id: string;
  sitter_id: string;
  last_message?: string;
  updated_at: string;
  other_user?: Profile;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer?: Profile;
}
