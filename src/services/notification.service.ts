import { api } from "../config/api";
import type {
  UnreadNotificationsResponse,
  PaginatedNotificationsResponse,
  MarkReadResponse,
} from "../types/notification";

export async function getUnreadNotifications(): Promise<UnreadNotificationsResponse> {
  return api<UnreadNotificationsResponse>("/notifications/unread");
}

export async function getAllNotifications(
  page = 1
): Promise<PaginatedNotificationsResponse> {
  return api<PaginatedNotificationsResponse>(`/notifications?page=${page}`);
}

export async function markAsRead(id: number): Promise<MarkReadResponse> {
  return api<MarkReadResponse>(`/notifications/${id}/read`, {
    method: "POST",
  });
}

export async function markAllAsRead(): Promise<{ message: string }> {
  return api<{ message: string }>("/notifications/read-all", {
    method: "POST",
  });
}
