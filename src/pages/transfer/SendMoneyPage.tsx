import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  ArrowClockwise,
  Check,
  CheckCircle,
  Envelope,
  PaperPlaneTilt,
  UsersThree,
  XCircle,
  HourglassMedium,
  //Receipt,
} from "phosphor-react";
import { PageHeader } from "../../components/shared/layout/PageHeader";
import { GlassCard } from "../../components/ui/GlassCard";
import { FieldError } from "../../components/ui/FieldError";
import { useAuth } from "../../hooks/useAuth";
import {
  sendTransfer,
  addFrequentPayee,
  getFrequentPayees,
} from "../../services/transfer.service";
import type { Transfer } from "../../types/transfer";
import {
  emailRules,
  moneyAmountRules,
  optionalTextRules,
  normalizeMoneyInput,
  formatAmountValue,
} from "../../utils/validation";
import { PayeesModal } from "./components/PayeesModal";

type Stage = "form" | "processing" | "success" | "error";

interface SendMoneyFormValues {
  receiver_email: string;
  amount: string;
  concept: string;
}

function formatMoney(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function SendMoneyPage() {
  const navigate = useNavigate();
  const { account, refreshAccount } = useAuth();
  const [stage, setStage] = useState<Stage>("form");
  const [serverError, setServerError] = useState("");
  const [transferResult, setTransferResult] = useState<Transfer | null>(null);

  // Add payee flow (success screen)
  const [payeeStatus, setPayeeStatus] = useState<
    "idle" | "saving" | "added" | "error"
  >("idle");
  /** null = verificando; false = no está en frecuentes (mostrar botón);
   *  true = ya está en frecuentes (no mostrar nada) */
  const [payeeExists, setPayeeExists] = useState<boolean | null>(null);
  const [payeeError, setPayeeError] = useState("");
  const [showPayeesModal, setShowPayeesModal] = useState(false);

  const availableBalance = parseFloat(account?.balance ?? "") || NaN;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    //getValues,
    formState: { errors },
  } = useForm<SendMoneyFormValues>({
    defaultValues: { receiver_email: "", amount: "", concept: "" },
    mode: "onBlur",
  });

  async function onSubmit({
    receiver_email,
    amount,
    concept,
  }: SendMoneyFormValues) {
    setServerError("");
    setStage("processing");

    try {
      const response = await sendTransfer({
        receiver_email: receiver_email.trim(),
        amount: parseFloat(amount.replace(",", ".")),
        concept: concept.trim() || undefined,
      });

      setTransferResult(response.transfer);
      // Sync balance everywhere after a successful transfer
      refreshAccount();
      // Check if receiver is already a frequent payee to hide the add button
      checkPayeeExists(response.transfer.receiver.email);
      setStage("success");
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "No se pudo realizar la transferencia",
      );
      setStage("error");
    }
  }

  function checkPayeeExists(email: string) {
    setPayeeExists(null);

    getFrequentPayees()
      .then((list) => {
        const normalized = email.trim().toLowerCase();
        const exists = list.some(
          (p) => p.payee.email.trim().toLowerCase() === normalized,
        );
        setPayeeExists(exists);
      })
      .catch(() => {
        // Si falla la verificación mostramos el botón; el backend
        // validará de todos modos al agregar.
        setPayeeExists(false);
      });
  }

  async function handleAddPayee() {
    if (!transferResult) return;
    setPayeeStatus("saving");
    setPayeeError("");

    try {
      await addFrequentPayee({ payee_email: transferResult.receiver.email });
      setPayeeExists(true);
      setPayeeStatus("added");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo agregar el beneficiario";
      if (/ya está/i.test(message)) {
        // Backend reports it already exists — treat as added
        setPayeeStatus("added");
      } else {
        setPayeeError(message);
        setPayeeStatus("error");
      }
    }
  }

  function startNewTransfer() {
    reset({ receiver_email: "", amount: "", concept: "" });
    setTransferResult(null);
    setPayeeStatus("idle");
    setPayeeError("");
    setPayeeExists(null);
    setServerError("");
    setStage("form");
  }

  function selectPayeeEmail(email: string) {
    setValue("receiver_email", email, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  const inputClass = (hasError?: boolean) =>
    `w-full h-12 rounded-xl bg-bg-surface border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors ${
      hasError
        ? "border-error focus:border-error focus:ring-error/25"
        : "border-border focus:border-primary/50 focus:ring-primary/25"
    }`;

  /* ── Processing screen ── */
  if (stage === "processing") {
    //const values = getValues();
    return (
      <div className="min-h-dvh relative flex items-center justify-center px-5">
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 text-center">
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-primary/15 border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <HourglassMedium
                size={44}
                weight="duotone"
                className="text-primary animate-pulse"
              />
            </div>
          </div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            Procesando tu pago
          </h2>
          <p className="text-sm text-text-secondary mt-2">No cierres la app.</p>
        </div>
      </div>
    );
  }

  /* ── Success screen ── */
  if (stage === "success" && transferResult) {
    const t = transferResult;
    return (
      <div className="min-h-dvh relative flex items-center justify-center px-5 py-10">
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 w-full max-w-sm space-y-6 text-center">
          {/* Big green check (Binance style) */}
          <div className="mx-auto w-24 h-24 rounded-full bg-success flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.35)]">
            <Check size={52} weight="bold" className="text-white" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-text-primary tracking-tight">
              ¡Transferencia exitosa!
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Tu pago se realizó correctamente
            </p>
          </div>

          <GlassCard className="p-5 space-y-4 text-left">
            <div className="text-center pb-3 border-b border-border">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Monto enviado
              </span>
              <p className="text-3xl font-extrabold text-success mt-1">
                ${formatMoney(t.amount)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-text-muted">Para</span>
              <span className="text-sm font-semibold text-text-primary truncate max-w-[180px]">
                {t.receiver.name}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-text-muted">Correo</span>
              <span className="text-xs font-mono text-text-secondary truncate max-w-[190px]">
                {t.receiver.email}
              </span>
            </div>
            {t.concept && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-text-muted">Concepto</span>
                <span className="text-xs text-text-secondary truncate max-w-[190px]">
                  {t.concept}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-text-muted">Referencia</span>
              <span className="text-xs font-mono text-text-secondary">
                {t.reference}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-text-muted shrink-0">Fecha</span>
              <span className="text-xs text-text-secondary">
                {new Date(t.created_at).toLocaleString("es-VE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </GlassCard>

          {/* Add to frequent payees.
              Solo se muestra si el beneficiario NO está ya en la lista;
              mientras se verifica no se muestra nada. */}
          {payeeStatus === "added" && (
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-success/10 border border-success/20">
              <CheckCircle
                size={18}
                weight="fill"
                className="text-success shrink-0"
              />
              <span className="text-sm font-medium text-success">
                Agregado a tus beneficiarios frecuentes
              </span>
            </div>
          )}
          {payeeStatus !== "added" && payeeExists === false && (
            <div className="space-y-2">
              <button
                onClick={handleAddPayee}
                disabled={payeeStatus === "saving"}
                className="w-full h-12 rounded-xl bg-primary/15 border border-primary/30 text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {payeeStatus === "saving" ? (
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <UsersThree size={18} weight="bold" />
                    Agregar a beneficiarios frecuentes
                  </>
                )}
              </button>
              {payeeError && (
                <p
                  role="alert"
                  className="text-xs font-medium text-error text-center"
                >
                  {payeeError}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3 pt-1">
            <button
              onClick={startNewTransfer}
              className="w-full h-12 rounded-xl bg-primary text-bg-deep font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-accent active:scale-[0.98] transition-all"
            >
              <PaperPlaneTilt size={18} weight="bold" />
              Hacer otra transferencia
            </button>
            <button
              onClick={() => navigate("/inicio", { replace: true })}
              className="w-full h-11 rounded-xl bg-bg-card border border-border text-text-secondary font-semibold text-sm hover:text-text-primary hover:border-primary/30 transition-all"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error screen ── */
  if (stage === "error") {
    return (
      <div className="min-h-dvh relative flex items-center justify-center px-5 py-10">
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-error/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto w-24 h-24 rounded-full bg-error flex items-center justify-center shadow-[0_0_60px_rgba(244,63,94,0.3)]">
            <XCircle size={56} weight="fill" className="text-white" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-text-primary tracking-tight">
              No pudimos realizar el pago
            </h2>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              {serverError || "Ocurrió un problema inesperado"}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setStage("form")}
              className="w-full h-12 rounded-xl bg-primary text-bg-deep font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-accent active:scale-[0.98] transition-all"
            >
              <ArrowClockwise size={18} weight="bold" />
              Intentar de nuevo
            </button>
            <button
              onClick={() => navigate("/inicio", { replace: true })}
              className="w-full h-11 rounded-xl bg-bg-card border border-border text-text-secondary font-semibold text-sm hover:text-text-primary hover:border-primary/30 transition-all"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form screen ── */
  return (
    <div className="min-h-dvh relative">
      {/* Glow backgrounds */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto pb-28">
        {/* Header */}
        <PageHeader title="Enviar dinero" backTo="/inicio" />

        <main className="px-5 mt-4 space-y-6">
          {/* Available balance */}
          <GlassCard className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <Receipt size={18} weight="duotone" className="text-primary" />
              </div> */}
              <div>
                <p className="text-xs text-text-muted">Saldo disponible</p>
                {!Number.isNaN(availableBalance) && (
                  <p className="text-sm font-bold text-text-primary">
                    ${formatMoney(availableBalance)}{" "}
                    <span className="text-xs font-medium text-text-muted">
                      USD
                    </span>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowPayeesModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
              aria-label="Ver beneficiarios frecuentes"
            >
              <UsersThree size={14} weight="bold" />
              Frecuentes
            </button>
          </GlassCard>

          <GlassCard className="p-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              {/* Receiver email */}
              <div>
                <label
                  htmlFor="receiver_email"
                  className="block text-xs font-medium text-text-secondary mb-1.5"
                >
                  Correo del beneficiario
                </label>
                <div className="relative">
                  <Envelope
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    id="receiver_email"
                    type="email"
                    placeholder="amigo@email.com"
                    autoComplete="off"
                    aria-invalid={!!errors.receiver_email}
                    {...register("receiver_email", emailRules())}
                    className={`${inputClass(!!errors.receiver_email)} pl-11 pr-4`}
                  />
                </div>
                <FieldError message={errors.receiver_email?.message} />
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-xs font-medium text-text-secondary mb-1.5"
                >
                  Monto
                </label>
                <Controller
                  name="amount"
                  control={control}
                  rules={moneyAmountRules(() => availableBalance)}
                  render={({ field, fieldState }) => {
                    const parsed = parseFloat(field.value);
                    const showPreview =
                      field.value !== "" && !Number.isNaN(parsed) && parsed > 0;
                    return (
                      <>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-text-muted pointer-events-none">
                            $
                          </span>
                          <input
                            id="amount"
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            autoComplete="off"
                            aria-invalid={!!fieldState.error}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(
                                normalizeMoneyInput(e.target.value),
                              )
                            }
                            onBlur={() => {
                              // Completa a 2 decimales al salir del campo
                              if (field.value) {
                                field.onChange(formatAmountValue(field.value));
                              }
                              field.onBlur();
                            }}
                            className={`${inputClass(!!fieldState.error)} pl-9 pr-16 text-lg font-bold`}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-text-muted uppercase pointer-events-none">
                            USD
                          </span>
                        </div>
                        {showPreview && (
                          <p className="mt-1.5 text-xs font-medium text-primary">
                            Enviarás exactamente: ${formatMoney(parsed)}
                          </p>
                        )}
                        <FieldError message={fieldState.error?.message} />
                      </>
                    );
                  }}
                />
              </div>

              {/* Concept (optional) */}
              <div>
                <label
                  htmlFor="concept"
                  className="block text-xs font-medium text-text-secondary mb-1.5"
                >
                  Concepto{" "}
                  <span className="text-text-muted font-normal">
                    (opcional)
                  </span>
                </label>
                <input
                  id="concept"
                  type="text"
                  placeholder="Ej. Pago por servicio"
                  maxLength={100}
                  autoComplete="off"
                  aria-invalid={!!errors.concept}
                  {...register("concept", optionalTextRules())}
                  className={`${inputClass(!!errors.concept)} pl-4`}
                />
                <FieldError message={errors.concept?.message} />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-primary text-bg-deep font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-accent active:scale-[0.98] transition-all"
              >
                <PaperPlaneTilt size={18} weight="bold" />
                Enviar pago
              </button>
            </form>
          </GlassCard>
        </main>
      </div>

      <PayeesModal
        open={showPayeesModal}
        onClose={() => setShowPayeesModal(false)}
        onSelect={selectPayeeEmail}
      />
    </div>
  );
}
