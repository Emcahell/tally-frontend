export interface NotificationData {
  amount?: number;
  sender_id?: number;
  sender_name?: string;
  recipient_id?: number;
  recipient_name?: string;
  transaction_id?: number;
}

export interface Notification {
  id: number;
  user_id: number;
  type: "transfer_received" | "transfer_sent" | string;
  title: string;
  message: string;
  data: NotificationData;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface UnreadNotificationsResponse {
  notifications: Notification[];
  unread_count: number;
}

export interface PaginatedNotificationsResponse {
  notifications: {
    current_page: number;
    data: Notification[];
    last_page: number;
    total: number;
    per_page: number;
  };
  unread_count: number;
}

export interface MarkReadResponse {
  message: string;
  notification: Notification;
}
