import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Info, MessageCircle } from "lucide-react";
import { initialMatches, profiles } from "@/data/mock";
import { AppShell } from "@/components/AppShell";
import { ProfileDetailDialog } from "@/components/ProfileDetailDialog";
import type { Profile } from "@/data/mock";
import { toast } from "sonner";

export default function Matches() {
  const [detailProfile, setDetailProfile] = useState<Profile | null>(null);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const items = useMemo(() => initialMatches.map((m) => ({
    ...m,
    profile: profiles.find((p) => p.id === m.profileId)!,
  })).filter((m) => !removedIds.includes(m.profileId)), [removedIds]);
  const activeMatch = items.find((m) => m.profile.id === detailProfile?.id);

  return (
    <AppShell>
      <header className="px-5 pt-6 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Conexiones</p>
        <h1 className="font-display text-2xl font-extrabold">Tus matches</h1>
      </header>

      <section className="px-5 py-3">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nuevos matches</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
          {items.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setDetailProfile(m.profile)}
              className="shrink-0 text-center"
            >
              <div className="relative mx-auto h-16 w-16 rounded-full bg-gradient-brand p-[2px] shadow-glow">
                <img src={m.profile.avatar} alt={m.profile.name} className="h-full w-full rounded-full bg-card object-cover" />
                {m.unread && <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-secondary ring-2 ring-background" />}
              </div>
              <p className="mt-1 max-w-[72px] truncate text-xs font-medium">{m.profile.name.split(" ")[0]}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="flex-1 px-5 py-3">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mensajes</h2>
        <ul className="space-y-2">
          {items.map((m) => (
            <li key={m.id}>
              <div className="flex items-center gap-3 rounded-2xl border border-white/75 bg-white/72 p-3 shadow-soft backdrop-blur-2xl transition-all hover:shadow-card">
                <img src={m.profile.avatar} alt={m.profile.name} className="h-12 w-12 rounded-2xl bg-muted object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold">{m.profile.name}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{m.matchedAt}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{m.lastMessage}</p>
                </div>
                {m.unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-brand" />}
                <button
                  type="button"
                  onClick={() => setDetailProfile(m.profile)}
                  className="inline-flex h-10 shrink-0 items-center gap-1 rounded-xl bg-primary/10 px-3 text-xs font-bold text-primary"
                  aria-label={`Ver detalle de ${m.profile.name}`}
                >
                  <Info className="h-4 w-4" />
                  Saber más
                </button>
                <Link
                  to={`/chat/${m.id}`}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow"
                  aria-label={`Abrir chat con ${m.profile.name}`}
                >
                  <MessageCircle className="h-4 w-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ProfileDetailDialog
        profile={detailProfile}
        open={Boolean(detailProfile)}
        onClose={() => setDetailProfile(null)}
        mode="match"
        onRemove={() => {
          if (detailProfile) {
            setRemovedIds((prev) => [...prev, detailProfile.id]);
            toast.success(`Eliminaste el match con ${detailProfile.name}`);
          }
          setDetailProfile(null);
        }}
        onChat={() => {
          if (activeMatch) {
            navigate(`/chat/${activeMatch.id}`);
          }
        }}
      />
    </AppShell>
  );
}
