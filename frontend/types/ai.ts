export interface TripDiffItem {
  type: 'day' | 'activity' | 'summary';
  dayNumber?: number;
  slot?: string;
  oldTitle?: string;
  newTitle?: string;
  description: string;
}

export interface TripDiff {
  added: TripDiffItem[];
  removed: TripDiffItem[];
  modified: TripDiffItem[];
  summary_changes: any[];
}

export interface TripVersion {
  version_id: string;
  trip_id: string;
  version_number: number;
  version_label: string;
  modification_prompt: string;
  diff: TripDiff;
  created_at: string;
}

export interface TripModificationResponse {
  success: boolean;
  trip_id: string;
  version_number: number;
  version_label: string;
  modification_instruction: string;
  diff: TripDiff;
  modified_trip: Record<string, any>;
}

export interface TripPreviewResponse {
  success: boolean;
  trip_id: string;
  preview_trip: Record<string, any>;
  diff: TripDiff;
}

// Re-export existing types
export * from './ai-itinerary-types';

export interface TripDraft {
  name?: string | null;
  destination?: string | null;
  duration_days?: number | null;
  total_budget?: number | null;
  currency?: string;
  travelers_count?: number;
  travel_type?: string | null;
  travel_style?: string | null;
  interests?: string[];
  preferred_pace?: string;
  special_requirements?: string | null;
  completion_percentage: number;
  missing_fields: string[];
  is_complete: boolean;
}

export interface QuickReplyOption {
  label: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  quick_replies?: QuickReplyOption[];
  trip_draft?: TripDraft;
}

export interface ConversationalChatResponse {
  success: boolean;
  conversation_id: string;
  message_id: string;
  reply: string;
  quick_replies: QuickReplyOption[];
  trip_draft: TripDraft;
  is_complete: boolean;
  completion_percentage: number;
  status: string;
  created_at: string;
}
