// src/types/chat.ts
export interface ChatUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Chat {
  id: number;
  property_id: number;
  owner_id: number;
  renter_id: number;
  assigned_agent_id?: number | null;
  last_message_at: string | null;
  property?: { id: number; title: string; price: number };
  owner?: ChatUser;
  renter?: ChatUser;
  assignedAgent?: ChatUser;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  data: Chat;
}

export interface ChatsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Chat[];
    total: number;
    per_page: number;
    agents: ChatUser[];
  };
}
