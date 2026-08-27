import { useCallback, useEffect, useState } from "react";
import {
  CaretLeft,
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  WarningCircle,
  Checks,
} from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../hooks/useAuth";
import {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
} from "../../services/notification.service";
import { getCache, setCache } from "../../utils/cache";
import type { Notification } from "../../types/notification";

const CACHE_KEY = "notifications";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

function getNotifIcon(type: string) {
  if (type === "transfer_received") {
    return <ArrowDownLeft size={18} weight="bold" className="text-primary" />;
  }
  if (type === "transfer_sent") {
    return <ArrowUpRight size={18} weight="bold" className="text-accent-cyan" />;
  }
  return <Bell size={18} weight="bold" className="text-accent-violet" />;
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const { setUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(
    () => getCache<Notification[]>(CACHE_KEY) ?? []
  );
  const [loading, setLoading] = useState(
    () => !getCache<Notification[]>(CACHE_KEY)
  );
  const [error, setError] = useState("");
  const [markingId, setMarkingId] = useState<number | null>(null);

  const fetchNotifications = useCallback(() => {
    getAllNotifications(1)
      .then((res) => {
        const list = res.notifications.data;
        setNotifications(list);
        setUnreadCount(res.unread_count);
        setCache(CACHE_KEY, list);
      })
      .catch((err) => {
        if (!notifications.length) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar las notificaciones"
          );
        }
      })
      .finally(() => setLoading(false));
  }, [notifications.length, setUnreadCount]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  async function handleOpen(notif: Notification) {
    // Mark as read if unread
    if (!notif.is_read) {
      setMarkingId(notif.id);
      try {
        await markAsRead(notif.id);
        setNotifications((prev) => {
          const updated = prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n));
          setUnreadCount(updated.filter((n) => !n.is_read).length);
          return updated;
        });
      } catch {
        // silently fail
      } finally {
        setMarkingId(null);
      }
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // silently fail
    }
  }

  const unreadExists = notifications.some((n) => !n.is_read);

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary">
      {/* Background glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-deep/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary/30 transition-colors"
              aria-label="Volver"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-text-primary">
                Notificaciones
              </h1>
              <p className="text-xs text-text-muted">
                {notifications.length} notificación{notifications.length !== 1 ? "es" : ""}
              </p>
            </div>
          </div>

          {/* Mark all as read */}
          {unreadExists && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
            >
              <Checks size={14} weight="bold" />
              <span className="hidden sm:inline">Marcar todo leído</span>
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-4 pb-12">
        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20 mb-4">
            <WarningCircle size={18} className="text-error shrink-0" />
            <span className="text-xs text-error font-medium flex-1">
              {error}
            </span>
            <button
              onClick={() => { setError(""); setLoading(true); fetchNotifications(); }}
              className="text-xs font-semibold text-primary hover:text-primary-accent transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-bg-card border border-border">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-56" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-bg-surface border border-border flex items-center justify-center mb-4">
              <Bell size={28} weight="duotone" className="text-text-muted" />
            </div>
            <p className="text-sm text-text-muted text-center">
              No tienes notificaciones aún
            </p>
          </div>
        )}

        {/* Notifications list */}
        {!loading && notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleOpen(notif)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen(notif); }}
                className={`p-4 rounded-3xl bg-bg-card border backdrop-blur-xl cursor-pointer transition-all hover:border-primary/20 ${
                  !notif.is_read ? "border-primary/15" : "border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center shrink-0">
                    {getNotifIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {notif.title}
                      </p>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-text-muted mt-1.5">
                      {timeAgo(notif.created_at)}
                    </p>
                  </div>

                  {/* Marking indicator */}
                  {markingId === notif.id && (
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
