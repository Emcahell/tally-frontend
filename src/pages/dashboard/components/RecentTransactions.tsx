import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CaretRight, WarningCircle } from "phosphor-react";
import { Skeleton } from "../../../components/ui/Skeleton";
import { TransferListItem } from "../../../components/shared/TransferListItem";
import { TransactionDetailModal } from "../../../components/shared/TransactionDetailModal";
import { useAuth } from "../../../hooks/useAuth";
import { getTransfers } from "../../../services/transfer.service";
import { getCache, setCache } from "../../../utils/cache";
import type { Transfer } from "../../../types/transfer";

const RECENT_LIMIT = 6;
const CACHE_KEY = 'recent_transfers';

export function RecentTransactions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<Transfer[]>(() => getCache<Transfer[]>(CACHE_KEY) ?? []);
  const [loading, setLoading] = useState(() => !getCache<Transfer[]>(CACHE_KEY));
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchTransfers = useCallback(() => {
    getTransfers(1)
      .then((res) => {
        const recent = res.data.slice(0, RECENT_LIMIT);
        setTransfers(recent);
        setCache(CACHE_KEY, recent);
      })
      .catch((err) => {
        if (!transfers.length) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los movimientos",
          );
        }
      })
      .finally(() => setLoading(false));
  }, [transfers.length]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-text-primary">
          Movimientos Recientes
        </h3>
        <button
          onClick={() => navigate("/movimientos")}
          className="text-xs font-semibold text-primary hover:text-primary-accent transition-colors flex items-center gap-2"
        >
          Ver todo
          <CaretRight size={14} weight="bold" />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 border border-error/20">
          <WarningCircle size={18} className="text-error shrink-0" />
          <span className="text-xs text-error font-medium">{error}</span>
        </div>
      )}

      {/* List */}
      <div className="divide-y divide-border">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))
        ) : !error && transfers.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">
            Aún no tienes movimientos.{" "}
            <button
              onClick={() => navigate("/enviar")}
              className="text-primary font-semibold hover:text-primary-accent transition-colors"
            >
              Envía tu primera transferencia
            </button>
          </p>
        ) : (
          transfers.map((transfer) => (
            <TransferListItem
              key={transfer.id}
              transfer={transfer}
              userId={user?.id}
              onClick={() => setSelectedId(transfer.id)}
            />
          ))
        )}
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
