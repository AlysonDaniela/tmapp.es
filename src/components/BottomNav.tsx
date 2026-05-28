import { Briefcase, Heart, KanbanSquare, MessageCircle, Sparkles, User, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth, type UserRole } from "@/hooks/useAuth";

type Item = { to: string; icon: typeof Heart; label: string };

const navByRole: Record<UserRole, Item[]> = {
  student: [
    { to: "/discover", icon: Heart, label: "Descubrir" },
    { to: "/matches", icon: MessageCircle, label: "Matches" },
    { to: "/groups", icon: Users, label: "Grupos" },
    { to: "/insights", icon: Sparkles, label: "IA Match" },
    { to: "/profile", icon: User, label: "Perfil" },
  ],
  company: [
    { to: "/discover", icon: Heart, label: "Talento" },
    { to: "/jobs", icon: Briefcase, label: "Vacantes" },
    { to: "/pipeline", icon: KanbanSquare, label: "Pipeline" },
    { to: "/matches", icon: MessageCircle, label: "Chat" },
    { to: "/profile", icon: User, label: "Perfil" },
  ],
  recruiter: [
    { to: "/discover", icon: Heart, label: "Talento" },
    { to: "/pipeline", icon: KanbanSquare, label: "Pipeline" },
    { to: "/jobs", icon: Briefcase, label: "Vacantes" },
    { to: "/matches", icon: MessageCircle, label: "Chat" },
    { to: "/profile", icon: User, label: "Perfil" },
  ],
};

export function BottomNav() {
  const { user } = useAuth();
  const items = navByRole[user?.role ?? "student"];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3">
      <ul className="mx-auto flex max-w-md items-stretch justify-between rounded-[1.7rem] border border-white/75 bg-background/78 px-2 py-1.5 shadow-card backdrop-blur-2xl">
        {items.map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 rounded-2xl px-2 py-2 text-[11px] font-medium transition-all",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                      isActive && "bg-gradient-brand text-primary-foreground shadow-glow"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
