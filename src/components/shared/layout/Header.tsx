import { Bell } from "phosphor-react";
import { Avatar } from "../../ui/Avatar";
import { IconButton } from "../../ui/IconButton";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-bg-deep/80 backdrop-blur-xl px-5 pt-8 pb-4 flex items-center justify-between w-screen mx-auto">
      <div className="flex items-center gap-3">
        <Avatar
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
          alt="Alex Turner"
          showStatus
        />
        <div>
          <p className="text-xs text-text-muted font-medium">Bienvenido,</p>
          <h1 className="text-sm font-semibold text-text-primary tracking-wide">
            Alex Turner
          </h1>
        </div>
      </div>

      <IconButton aria-label="Notificaciones" badge>
        <Bell size={20} weight="bold" />
      </IconButton>
    </header>
  );
}
