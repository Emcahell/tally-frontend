import logo from "../../assets/images/logo-tally.svg";

export function Imagotipo() {
  return (
    <div className="inline-flex items-center gap-3 mb-8">
      <img src={logo} alt="Tally Logo" className="h-12 w-auto" />
      <span className="text-4xl font-extrabold italic text-primary tracking-tight">
        Tally
      </span>
    </div>
  );
}
