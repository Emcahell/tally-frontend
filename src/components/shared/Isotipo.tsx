import logo from "../../assets/images/logo-tally.svg";

export function Isotipo() {
  return (
    <div>
      <img
        src={logo}
        loading="lazy"
        decoding="async"
        alt="Tally"
        className="w-16 h-16"
      />
    </div>
  );
}
