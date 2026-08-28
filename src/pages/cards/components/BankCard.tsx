import { WifiHigh } from "phosphor-react";

interface BankCardProps {
  cardNumber: string;
  holderName: string;
  expiration: string;
  cvv: string;
  visible: boolean;
}

function formatCardNumber(number: string, visible: boolean): string {
  const clean = number.replace(/\s/g, "");
  const groups = clean.match(/.{1,4}/g) || [];
  if (visible) return groups.join(" ");
  return groups
    .map((group, i) => (i < groups.length - 1 ? "••••" : group))
    .join(" ");
}

export function BankCard({
  cardNumber,
  holderName,
  expiration,
  cvv,
  visible,
}: BankCardProps) {
  return (
    <div className="min-w-[280px] sm:min-w-[320px] h-[180px] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden shadow-xl border border-white/20 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-900">
      {/* Glow overlay */}
      <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

      {/* Top row: badge + wifi */}
      <div className="flex justify-between items-start z-10">
        <span className="text-xs font-bold text-slate-950 uppercase tracking-wider bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20">
          Tally Black
        </span>
        <WifiHigh size={20} className="text-slate-950/80 rotate-90" />
      </div>

      {/* Card details */}
      <div className="z-10">
        <p className="text-xs text-emerald-950/70 font-medium tracking-widest mb-4 font-mono">
          {formatCardNumber(cardNumber, visible)}
        </p>
        <div className="flex justify-between items-end">
          <div className="flex gap-6">
            <div>
              <p className="text-[10px] uppercase text-emerald-950/60 font-semibold">
                Titular
              </p>
              <p className="text-xs font-bold text-slate-950">{holderName}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-emerald-950/60 font-semibold">
                Exp
              </p>
              <p className="text-xs font-bold text-slate-950">
                {visible ? expiration : "••/••"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-emerald-950/60 font-semibold">
                CVV
              </p>
              <p className="text-xs font-bold text-slate-950">
                {visible ? cvv : "•••"}
              </p>
            </div>
          </div>
          {/* Mastercard logo */}
          <div className="flex -space-x-2">
            <div className="w-5 h-5 rounded-full bg-red-500/90" />
            <div className="w-5 h-5 rounded-full bg-amber-400/90" />
          </div>
        </div>
      </div>
    </div>
  );
}
