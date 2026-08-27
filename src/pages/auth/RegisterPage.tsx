import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { User, Envelope, Phone, Lock, Eye, EyeSlash } from "phosphor-react";
import { AuthLayout } from "../../components/shared/layout/AuthLayout";
import { GlassCard } from "../../components/ui/GlassCard";
import { FieldError } from "../../components/ui/FieldError";
import { register as registerUserService } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";
import { Isotipo } from "../../components/shared/Isotipo";
import {
  VALIDATION_MESSAGES,
  confirmPasswordRules,
  emailRules,
  nameRules,
  passwordRules,
  phoneRules,
} from "../../utils/validation";

interface RegisterFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { setUser, refreshAccount } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onBlur",
  });

  const acceptTerms = useWatch({ control, name: "acceptTerms" });

  function toggleAcceptTerms() {
    setValue("acceptTerms", !acceptTerms, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  async function onSubmit({
    name,
    email,
    phone,
    password,
    confirmPassword,
  }: RegisterFormValues) {
    setError("");

    try {
      const response = await registerUserService({
        name,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
      });
      localStorage.setItem("token", response.token);
      // Flag para que PublicOnlyRoute no redirija a /inicio
      // mientras navegamos a /bienvenida
      localStorage.setItem("justRegistered", "true");
      setUser(response.user);
      localStorage.setItem("cache_user", JSON.stringify(response.user));

      // Fetch account data right away so balance and card show up
      // without needing a page reload. Retries in case the backend
      // is still provisioning the account after registration.
      refreshAccount(2);

      navigate("/bienvenida", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear cuenta");
    }
  }

  const inputBaseClass =
    "w-full h-12 pl-11 pr-4 rounded-xl bg-bg-surface border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors";
  const validInputClass =
    "border-border focus:border-primary/50 focus:ring-primary/25";
  const invalidInputClass =
    "border-error focus:border-error focus:ring-error/25";

  return (
    <AuthLayout>
      {/* Logo / Brand */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mx-auto mb-4">
          <Isotipo />
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
          Crear cuenta
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Regístrate para empezar a usar Tally
        </p>
      </div>

      <GlassCard className="p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-text-secondary mb-1.5"
            >
              Nombre de usuario
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="name"
                type="text"
                placeholder="Simón Bolívar"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...register("name", nameRules())}
                className={`${inputBaseClass} ${errors.name ? invalidInputClass : validInputClass}`}
              />
            </div>
            <FieldError id="name-error" message={errors.name?.message} />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-text-secondary mb-1.5"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <Envelope
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email", emailRules())}
                className={`${inputBaseClass} ${errors.email ? invalidInputClass : validInputClass}`}
              />
            </div>
            <FieldError id="email-error" message={errors.email?.message} />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-medium text-text-secondary mb-1.5"
            >
              Número de teléfono
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="phone"
                type="tel"
                placeholder="+1 12 3456 7890"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                {...register("phone", phoneRules())}
                className={`${inputBaseClass} ${errors.phone ? invalidInputClass : validInputClass}`}
              />
            </div>
            <FieldError id="phone-error" message={errors.phone?.message} />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-text-secondary mb-1.5"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "register-password-error" : undefined
                }
                {...register("password", passwordRules())}
                className={`${inputBaseClass} pr-11 ${errors.password ? invalidInputClass : validInputClass}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <FieldError
              id="register-password-error"
              message={errors.password?.message}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-text-secondary mb-1.5"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword
                    ? "confirm-password-error"
                    : undefined
                }
                {...register("confirmPassword", {
                  ...confirmPasswordRules(() => getValues("password")),
                  deps: ["password"],
                })}
                className={`${inputBaseClass} ${errors.confirmPassword ? invalidInputClass : validInputClass}`}
              />
            </div>
            <FieldError
              id="confirm-password-error"
              message={errors.confirmPassword?.message}
            />
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <button
              type="button"
              onClick={toggleAcceptTerms}
              role="checkbox"
              aria-checked={acceptTerms}
              aria-label="Aceptar términos y condiciones"
              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                acceptTerms
                  ? "bg-primary border-primary"
                  : errors.acceptTerms
                    ? "border-error hover:border-error"
                    : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="checkbox"
                tabIndex={-1}
                className="sr-only"
                aria-hidden="true"
                {...register("acceptTerms", {
                  validate: (value) =>
                    value === true ||
                    "Debes aceptar los Términos y Condiciones",
                })}
              />
              {acceptTerms && (
                <svg
                  className="w-3 h-3 text-bg-deep pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <p className="text-xs text-text-secondary leading-relaxed">
              Acepto los{" "}
              <Link
                to="/terminos"
                className="text-primary font-semibold hover:text-primary-accent transition-colors underline underline-offset-2"
              >
                Términos y Condiciones
              </Link>{" "}
              y la Política de Privacidad de TallyBank
            </p>
          </div>
          <FieldError message={errors.acceptTerms?.message} />

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !acceptTerms}
            title={!acceptTerms ? VALIDATION_MESSAGES.required : undefined}
            className="w-full h-12 rounded-xl bg-primary text-bg-deep font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-accent active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-bg-deep/30 border-t-bg-deep rounded-full animate-spin" />
            ) : (
              <>Crear Cuenta</>
            )}
          </button>
        </form>

        {/* Login link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-muted">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:text-primary-accent transition-colors"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </GlassCard>
    </AuthLayout>
  );
}
