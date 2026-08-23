import { useNavigate } from "react-router-dom";
import {
  Confetti,
  Gift,
  CurrencyDollar,
  CheckCircle,
  ShieldCheck,
  Trophy,
  Sparkle,
} from "phosphor-react";
import { GlassCard } from "../../components/ui/GlassCard";
import { useAuth } from "../../hooks/useAuth";

const floatingIcons = [
  {
    Icon: Confetti,
    className: "text-primary/30",
    size: 32,
    top: "8%",
    left: "10%",
  },
  {
    Icon: Sparkle,
    className: "text-accent-amber/25",
    size: 24,
    top: "15%",
    right: "12%",
  },
  {
    Icon: CurrencyDollar,
    className: "text-primary/20",
    size: 28,
    top: "25%",
    left: "5%",
  },
  {
    Icon: Trophy,
    className: "text-accent-violet/25",
    size: 22,
    top: "6%",
    right: "8%",
  },
  {
    Icon: Sparkle,
    className: "text-accent-cyan/20",
    size: 20,
    bottom: "30%",
    left: "8%",
  },
  {
    Icon: Confetti,
    className: "text-primary-accent/15",
    size: 26,
    bottom: "20%",
    right: "10%",
  },
];

const features = [
  {
    Icon: CurrencyDollar,
    title: "Tu primer depósito",
    description: "$50.00 USD listos para usar",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    Icon: ShieldCheck,
    title: "Cuenta segura",
    description: "Protegida con los más altos estándares",
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10",
  },
  {
    Icon: Trophy,
    title: "Sin comisiones",
    description: "0% comisiones en tus primeros 3 meses",
    color: "text-accent-violet",
    bg: "bg-accent-violet/10",
  },
];

export function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleContinue() {
    navigate("/inicio", { replace: true });
  }

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Floating background icons */}
      {floatingIcons.map((item, i) => (
        <div
          key={i}
          className="absolute animate-pulse"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            animationDelay: `${i * 0.8}s`,
          }}
        >
          <item.Icon
            size={item.size}
            weight="fill"
            className={item.className}
          />
        </div>
      ))}

      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-accent-violet/8 rounded-full blur-[80px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-sm relative z-10 space-y-6">
        {/* Icon + Badge */}
        <div className="flex flex-col items-center">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center">
              <Gift size={40} weight="duotone" className="text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-accent-amber flex items-center justify-center">
              <Confetti size={16} weight="fill" className="text-bg-deep" />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight text-center">
            ¡Bienvenido{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-sm text-text-secondary mt-2 text-center max-w-xs">
            Gracias por elegir{" "}
            <span className="text-primary font-semibold">Tally</span>. Tu cuenta
            está lista.
          </p>
        </div>

        {/* Bonus card */}
        <GlassCard className="p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkle size={16} weight="fill" className="text-accent-amber" />
            <span className="text-xs font-bold text-accent-amber uppercase tracking-wider">
              Regalo de bienvenida
            </span>
            <Sparkle size={16} weight="fill" className="text-accent-amber" />
          </div>

          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-4xl font-extrabold text-primary">$50</span>
            <span className="text-lg font-semibold text-text-secondary">
              .00
            </span>
            <span className="text-sm text-text-muted font-medium">USD</span>
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            Hemos transferido{" "}
            <span className="text-primary font-semibold">$50.00 USD</span> a tu
            cuenta para que los gastes como gustes. ¡Es nuestro regalo de
            bienvenida!
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <CheckCircle size={14} weight="fill" className="text-primary" />
            <span className="text-xs text-text-secondary">
              Fondos disponibles en tu cuenta
            </span>
          </div>
        </GlassCard>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-surface/50 border border-border"
            >
              <div
                className={`w-9 h-9 rounded-xl ${feature.bg} flex items-center justify-center flex-shrink-0`}
              >
                <feature.Icon
                  size={18}
                  weight="duotone"
                  className={feature.color}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {feature.title}
                </p>
                <p className="text-xs text-text-muted">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          className="w-full h-12 rounded-xl bg-primary text-bg-deep font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-accent active:scale-[0.98] transition-all"
        >
          <CheckCircle size={18} weight="bold" />
          Empezar a usar Tally
        </button>

        <p className="text-center text-xs text-text-muted">
          Tu dinero <span className="text-primary font-semibold">Tally</span>{" "}
          como es.
        </p>
      </div>
    </div>
  );
}
