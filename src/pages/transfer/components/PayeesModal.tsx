import { useEffect, useState } from "react";
import {
  PencilSimple,
  Trash,
  UserCircle,
  X,
  Check,
} from "phosphor-react";
import { Skeleton } from "../../../components/ui/Skeleton";
import {
  deleteFrequentPayee,
  getFrequentPayees,
  updateFrequentPayee,
} from "../../../services/transfer.service";
import type { FrequentPayee } from "../../../types/transfer";

interface PayeesModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (email: string) => void;
}

export function PayeesModal({ open, onClose, onSelect }: PayeesModalProps) {
  if (!open) return null;
  return <PayeesModalContent onClose={onClose} onSelect={onSelect} />;
}

/** Se monta fresco cada vez que se abre el modal, por lo que la carga
 *  inicial de beneficiarios ocurre en el mount sin setState síncrono. */
function PayeesModalContent({
  onClose,
  onSelect,
}: Omit<PayeesModalProps, "open">) {
  const [payees, setPayees] = useState<FrequentPayee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit alias state
  const [editingPayee, setEditingPayee] = useState<FrequentPayee | null>(null);
  const [aliasValue, setAliasValue] = useState("");
  const [savingAlias, setSavingAlias] = useState(false);
  const [aliasError, setAliasError] = useState("");

  // Delete confirmation state
  const [deletingPayee, setDeletingPayee] = useState<FrequentPayee | null>(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getFrequentPayees()
      .then((list) => {
        if (!cancelled) setPayees(list);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los beneficiarios",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function openEditModal(payee: FrequentPayee) {
    setEditingPayee(payee);
    setAliasValue(payee.alias ?? "");
    setAliasError("");
  }

  async function handleSaveAlias() {
    if (!editingPayee) return;
    setSavingAlias(true);
    setAliasError("");

    try {
      const alias = aliasValue.trim();
      await updateFrequentPayee(editingPayee.id, alias);
      setPayees((prev) =>
        prev.map((p) =>
          p.id === editingPayee.id ? { ...p, alias: alias || null } : p,
        ),
      );
      setEditingPayee(null);
    } catch (err) {
      setAliasError(
        err instanceof Error ? err.message : "No se pudo actualizar el alias",
      );
    } finally {
      setSavingAlias(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingPayee) return;
    setRemoving(true);

    try {
      await deleteFrequentPayee(deletingPayee.id);
      setPayees((prev) => prev.filter((p) => p.id !== deletingPayee.id));
      setDeletingPayee(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo eliminar el beneficiario",
      );
      setDeletingPayee(null);
    } finally {
      setRemoving(false);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <div
          className="relative w-full sm:max-w-sm bg-bg-surface border border-border rounded-t-3xl sm:rounded-2xl p-5 max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Beneficiarios frecuentes"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
            aria-label="Cerrar"
          >
            <X size={16} weight="bold" />
          </button>

          <h3 className="text-base font-bold text-text-primary pr-8 mb-1">
            Beneficiarios frecuentes
          </h3>
          <p className="text-xs text-text-muted mb-4">
            Toca un beneficiario para enviarle dinero
          </p>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium mb-3">
              {error}
            </div>
          )}

          {/* List */}
          <div className="overflow-y-auto -mx-1 px-1 space-y-2">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-border"
                >
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                </div>
              ))
            ) : payees.length === 0 ? (
              <div className="py-10 text-center">
                <UserCircle size={44} className="mx-auto text-text-muted" />
                <p className="text-sm font-semibold text-text-primary mt-3">
                  Aún no tienes beneficiarios
                </p>
                <p className="text-xs text-text-muted mt-1 max-w-[240px] mx-auto">
                  Después de tu primera transferencia exitosa podrás guardar al
                  beneficiario aquí.
                </p>
              </div>
            ) : (
              payees.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-border hover:border-primary/30 transition-colors"
                >
                  <button
                    onClick={() => {
                      onSelect(item.payee.email);
                      onClose();
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    aria-label={`Enviar a ${item.alias || item.payee.name}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="text-sm font-bold text-primary">
                        {(item.alias || item.payee.name).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {item.alias || item.payee.name}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {item.payee.email}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(item)}
                      className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted hover:text-primary transition-colors"
                      aria-label={`Editar alias de ${item.alias || item.payee.name}`}
                    >
                      <PencilSimple size={14} weight="bold" />
                    </button>
                    <button
                      onClick={() => setDeletingPayee(item)}
                      className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted hover:text-error transition-colors"
                      aria-label={`Eliminar a ${item.alias || item.payee.name}`}
                    >
                      <Trash size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit alias modal */}
      {editingPayee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !savingAlias && setEditingPayee(null)}
          />
          <div className="relative w-full max-w-xs bg-bg-surface border border-border rounded-2xl p-6 space-y-4">
            <h4 className="text-base font-bold text-text-primary">
              Editar alias
            </h4>
            <div>
              <label
                htmlFor="payee-alias"
                className="block text-xs font-medium text-text-secondary mb-1.5"
              >
                Alias para {editingPayee.payee.email}
              </label>
              <input
                id="payee-alias"
                type="text"
                value={aliasValue}
                onChange={(e) => setAliasValue(e.target.value)}
                maxLength={60}
                placeholder="Ej. Mi amigo"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveAlias();
                }}
                className="w-full h-11 px-4 rounded-xl bg-bg-deep border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors"
              />
              {aliasError && (
                <p role="alert" className="mt-1.5 text-xs font-medium text-error">
                  {aliasError}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingPayee(null)}
                disabled={savingAlias}
                className="flex-1 h-11 rounded-xl bg-bg-card border border-border text-text-secondary font-semibold text-sm hover:text-text-primary hover:border-primary/30 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAlias}
                disabled={savingAlias}
                className="flex-1 h-11 rounded-xl bg-primary text-bg-deep font-semibold text-sm hover:bg-primary-accent active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingAlias ? (
                  <div className="w-4 h-4 border-2 border-bg-deep/30 border-t-bg-deep rounded-full animate-spin" />
                ) : (
                  "Guardar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deletingPayee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-xs bg-bg-surface border border-border rounded-2xl p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-error/15 flex items-center justify-center mx-auto">
              <Trash size={26} className="text-error" weight="bold" />
            </div>
            <h4 className="text-base font-bold text-text-primary">
              ¿Eliminar beneficiario?
            </h4>
            <p className="text-sm text-text-secondary">
              Se eliminará a{" "}
              <span className="font-semibold text-text-primary">
                {deletingPayee.alias || deletingPayee.payee.name}
              </span>{" "}
              de tu lista de frecuentes.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setDeletingPayee(null)}
                disabled={removing}
                className="flex-1 h-11 rounded-xl bg-bg-card border border-border text-text-secondary font-semibold text-sm hover:text-text-primary hover:border-primary/30 transition-all disabled:opacity-50"
              >
                No, cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={removing}
                className="flex-1 h-11 rounded-xl bg-error text-white font-semibold text-sm hover:bg-error/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {removing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={16} weight="bold" />
                    Sí, eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
