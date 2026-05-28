import { useMemo, useState } from "react";
import { Heart, RotateCcw, Star, X } from "lucide-react";
import { profiles } from "@/data/mock";
import { SwipeCard } from "@/components/SwipeCard";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { ProfileDetailDialog } from "@/components/ProfileDetailDialog";
import type { Profile } from "@/data/mock";
import { toast } from "sonner";

export default function Discover() {
  const { user } = useAuth();
  const roleLabel =
    user?.role === "company"
      ? "Modo empresa"
      : user?.role === "recruiter"
        ? "Modo reclutador"
        : "Modo estudiante";

  const initial = useMemo(() => {
    const role = user?.role ?? "student";
    if (role === "student") return profiles.filter((p) => p.type === "company");
    if (role === "company") return profiles.filter((p) => p.type === "student");
    return profiles.filter((p) => p.type === "student");
  }, [user?.role]);

  const [stack, setStack] = useState(initial);
  const [history, setHistory] = useState<typeof profiles>([]);
  const [detailProfile, setDetailProfile] = useState<Profile | null>(null);

  const top = stack[0];
  const visible = useMemo(() => stack.slice(0, 3).reverse(), [stack]);

  const swipe = (dir: "left" | "right") => {
    if (!top) return;
    const current = top;
    if (dir === "right") {
      // 35% chance of match for fun
      if (Math.random() > 0.5) {
        toast.success(`✨ ¡Match con ${top.name}!`, {
          description: "Ya podéis chatear desde Matches",
          action: {
            label: "Saber más",
            onClick: () => setDetailProfile(current),
          },
        });
      } else {
        toast(`Like enviado a ${top.name}`, {
          action: {
            label: "Ver perfil",
            onClick: () => setDetailProfile(current),
          },
        });
      }
    }
    setHistory((h) => [top, ...h]);
    setStack((s) => s.slice(1));
  };

  const swipeFromDetail = (dir: "left" | "right") => {
    setDetailProfile(null);
    if (detailProfile?.id === top?.id) {
      swipe(dir);
      return;
    }

    if (dir === "right" && detailProfile) {
      toast.success(`✨ ¡Match con ${detailProfile.name}!`, {
        description: "Ya podéis chatear desde Matches",
      });
    }
  };

  const undo = () => {
    if (!history.length) return;
    const [last, ...rest] = history;
    setHistory(rest);
    setStack((s) => [last, ...s]);
    toast("Acción deshecha");
  };

  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{roleLabel}</p>
          <h1 className="font-display text-2xl font-extrabold">
            {user?.role === "student" ? "Encuentra tu match" : "Descubre talento"}
          </h1>
        </div>
        <button
          onClick={undo}
          disabled={!history.length}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-soft disabled:opacity-40"
          aria-label="Deshacer"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </header>

      <div className="relative mx-5 flex-1">
        <div className="relative mx-auto aspect-[3/4.4] w-full max-w-sm">
          {stack.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] bg-gradient-card p-8 text-center shadow-card">
              <div className="mb-3 text-5xl">🎉</div>
              <h2 className="font-display text-xl font-bold">¡Has visto todo por hoy!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Vuelve más tarde para descubrir nuevos perfiles afines.
              </p>
              <button
                onClick={() => setStack(initial)}
                className="mt-5 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                Reiniciar demo
              </button>
            </div>
          ) : (
            visible.map((p, i) => (
              <SwipeCard
                key={p.id}
                profile={p}
                onSwipe={swipe}
                onMore={setDetailProfile}
                active={p.id === top.id}
                stackIndex={visible.length - 1 - i}
              />
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 px-5 pb-4 pt-6">
        <ActionButton
          onClick={() => swipe("left")}
          className="bg-card text-destructive shadow-soft"
          label="Dislike"
        >
          <X className="h-7 w-7" strokeWidth={3} />
        </ActionButton>
        <ActionButton
          onClick={() => toast("⭐ Super like enviado")}
          className="h-14 w-14 bg-gradient-accent text-secondary-foreground shadow-glow"
          label="Super like"
        >
          <Star className="h-6 w-6" fill="currentColor" />
        </ActionButton>
        <ActionButton
          onClick={() => swipe("right")}
          className="bg-gradient-brand text-primary-foreground shadow-glow"
          label="Like"
        >
          <Heart className="h-7 w-7" fill="currentColor" />
        </ActionButton>
      </div>

      <ProfileDetailDialog
        profile={detailProfile}
        open={Boolean(detailProfile)}
        onClose={() => setDetailProfile(null)}
        onPass={() => swipeFromDetail("left")}
        onLike={() => swipeFromDetail("right")}
      />
    </AppShell>
  );
}

function ActionButton({
  children,
  onClick,
  className,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex h-16 w-16 items-center justify-center rounded-full transition-transform active:scale-90 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
