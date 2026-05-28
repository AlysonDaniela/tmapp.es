import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-soft before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_8%,hsl(var(--primary)/0.12),transparent_28%),radial-gradient(circle_at_86%_18%,hsl(var(--secondary)/0.12),transparent_24%)]">
      <div className="relative z-10 mx-auto flex h-full max-w-md flex-col overflow-y-auto pb-28">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
