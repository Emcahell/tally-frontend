import { useCallback, useEffect, useState } from "react";
import { ArrowClockwise, WarningCircle } from "phosphor-react";
import { Skeleton } from "../../components/ui/Skeleton";
import { PageHeader } from "../../components/shared/layout/PageHeader";
import { TransferListItem } from "../../components/shared/TransferListItem";
import { TransactionDetailModal } from "../../components/shared/TransactionDetailModal";
import { useAuth } from "../../hooks/useAuth";
import { getTransfers } from "../../services/transfer.service";
import { getCache, setCache } from "../../utils/cache";
import type { Transfer } from "../../types/transfer";

/** Cuántos movimientos se muestran inicialmente y cuántos añade cada "Ver más" */
const INITIAL_VISIBLE = 20;
const STEP = 10;
const CACHE_KEY = 'transfers_history';

interface CachedHistory {
  transfers: Transfer[];
  total: number;
  page: number;
  lastPage: number;
}

export function TransfersHistoryPage() {
  const { user } = useAuth();

  const [transfers, setTransfers] = useState<Transfer[]>(() => {
    const cached = getCache<CachedHistory>(CACHE_KEY);
    return cached?.transfers ?? [];
  });
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [total, setTotal] = useState(() => {
    const cached = getCache<CachedHistory>(CACHE_KEY);
    return cached?.total ?? 0;
  });
  const [page, setPage] = useState(() => {
    const cached = getCache<CachedHistory>(CACHE_KEY);
    return cached?.page ?? 1;
  });
  const [lastPage, setLastPage] = useState(() => {
    const cached = getCache<CachedHistory>(CACHE_KEY);
    return cached?.lastPage ?? 1;
  });
  const [loading, setLoading] = useState(() => !getCache<CachedHistory>(CACHE_KEY));
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchHistory = useCallback(() => {
    getTransfers(1)
      .then((res) => {
        const t = res.data;
        const tot = res.total ?? t.length;
        const pg = res.current_page;
        const lp = res.last_page ?? 1;

        setTransfers(t);
        setTotal(tot);
        setPage(pg);
        setLastPage(lp);
        setCache(CACHE_KEY, { transfers: t, total: tot, page: pg, lastPage: lp } satisfies CachedHistory);
      })
      .catch((err) => {
        if (!transfers.length) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar el historial",
          );
        }
      })
      .finally(() => setLoading(false));
  }, [transfers.length]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const retry = useCallback(() => {
    setError("");
    setLoading(true);
    fetchHistory();
  }, [fetchHistory]);

  /** Añade 10 movimientos más; trae páginas siguientes del backend
   *  solo cuando los ya cargados se agotan. */
  async function handleVerMas() {
    if (loadingMore) return;

    const maxTotal = total || transfers.length;
    const target = Math.min(visibleCount + STEP, maxTotal);

    try {
      setLoadingMore(true);

      let currentPage = page;
      let accumulated = [...transfers];

      // Trae páginas completas hasta cubrir el objetivo (sin duplicar ids)
      while (
        target > accumulated.length &&
        currentPage < lastPage
      ) {
        const res = await getTransfers(currentPage + 1);
        const seen = new Set(accumulated.map((t) => t.id));
        const fresh = res.data.filter((t) => !seen.has(t.id));
        if (fresh.length === 0) break; // seguridad contra bucles infinitos
        accumulated = [...accumulated, ...fresh];
        currentPage = res.current_page;
        setLastPage(res.last_page ?? currentPage);
      }

      setTransfers(accumulated);
      setPage(currentPage);
      setVisibleCount(target);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar más movimientos",
      );
    } finally {
      setLoadingMore(false);
    }
  }

  const visible = transfers.slice(0, visibleCount);
  const maxTotal = total || transfers.length;
  const hasMore = visibleCount < maxTotal;

  return (
    <div className="min-h-dvh relative">
      {/* Glow backgrounds */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto pb-24">
        {/* Header */}
        <PageHeader title="Movimientos" />

        <main className="px-5 mt-2">
          {/* Error */}
          {error && !loading && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20 mb-4">
              <WarningCircle size={18} className="text-error shrink-0" />
              <span className="text-xs text-error font-medium flex-1">
                {error}
              </span>
              <button
                onClick={retry}
                className="text-xs font-semibold text-primary hover:text-primary-accent transition-colors flex items-center gap-1"
                aria-label="Reintentar"
              >
                <ArrowClockwise size={14} weight="bold" />
                Reintentar
              </button>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : transfers.length === 0 ? (
            <p className="py-16 text-center text-sm text-text-muted">
              No tienes transferencias todavía.
            </p>
          ) : (
            <>
              <div className="divide-y divide-border">
                {visible.map((transfer) => (
                  <TransferListItem
                    key={transfer.id}
                    transfer={transfer}
                    userId={user?.id}
                    onClick={() => setSelectedId(transfer.id)}
                  />
                ))}
              </div>

              {/* Ver más (+10) */}
              {hasMore && (
                <button
                  onClick={handleVerMas}
                  disabled={loadingMore}
                  className="w-full mt-5 h-12 rounded-xl bg-bg-card border border-border text-text-secondary font-semibold text-sm hover:text-text-primary hover:border-primary/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingMore ? (
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  ) : (
                    "Ver más"
                  )}
                </button>
              )}

              {!hasMore && transfers.length > INITIAL_VISIBLE && (
                <p className="mt-6 text-center text-xs text-text-muted">
                  Has llegado al final de tus movimientos
                </p>
              )}
            </>
          )}
        </main>
      </div>

      {/* Detail modal */}
      {selectedId !== null && (
        <TransactionDetailModal
          transferId={selectedId}
          userId={user?.id}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
