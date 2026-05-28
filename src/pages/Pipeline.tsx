import { useMemo, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { jobs, pipeline, profiles, type PipelineStage } from "@/data/mock";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const STAGES: PipelineStage[] = ["Nuevo", "Entrevista", "Oferta", "Contratado"];

export default function Pipeline() {
  const { user } = useAuth();
  const [items, setItems] = useState(pipeline);
  const [active, setActive] = useState<PipelineStage>("Nuevo");
  const isCompany = user?.role === "company";

  const grouped = useMemo(() => {
    const m = new Map<PipelineStage, typeof items>();
    STAGES.forEach((s) => m.set(s, []));
    items.forEach((c) => m.get(c.stage)!.push(c));
    return m;
  }, [items]);

  const advance = (idx: number) => {
    setItems((prev) => {
      const copy = [...prev];
      const i = STAGES.indexOf(copy[idx].stage);
      if (i < STAGES.length - 1) {
        copy[idx] = { ...copy[idx], stage: STAGES[i + 1] };
        toast.success(`Movido a ${STAGES[i + 1]}`);
      }
      return copy;
    });
  };

  return (
    <AppShell>
      <header className="px-5 pt-6 pb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {isCompany ? "Empresa" : "Reclutador"}
        </p>
        <h1 className="font-display text-2xl font-extrabold">Pipeline de candidatos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isCompany
            ? "Gestiona postulantes que avanzan desde tus vacantes hacia entrevista, oferta y contratación."
            : "Gestiona candidatos por cliente y mueve cada perfil entre rondas."}
        </p>
      </header>

      <div className="px-5">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {STAGES.map((s) => {
            const count = grouped.get(s)!.length;
            const isActive = active === s;
            return (
              <button
                key={s}
                onClick={() => setActive(s)}
                className={`shrink-0 rounded-2xl px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-brand text-primary-foreground shadow-glow"
                    : "bg-card text-muted-foreground border border-border/60"
                }`}
              >
                {s} <span className="ml-1 opacity-80">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="space-y-2 px-5 pt-2">
        {grouped.get(active)!.length === 0 && (
          <p className="rounded-2xl bg-card/60 p-6 text-center text-sm text-muted-foreground">
            No hay candidatos en {active}.
          </p>
        )}
        {grouped.get(active)!.map((c) => {
          const cand = profiles.find((p) => p.id === c.candidateId);
          const job = jobs.find((j) => j.id === c.jobId);
          const idx = items.findIndex(
            (it) => it.candidateId === c.candidateId && it.jobId === c.jobId
          );
          if (!cand || !job) return null;
          return (
            <article
              key={`${c.candidateId}-${c.jobId}`}
              className="rounded-2xl bg-gradient-card p-3 shadow-soft border border-border/40"
            >
              <div className="flex items-center gap-3">
                <img
                  src={cand.avatar}
                  alt={cand.name}
                  className="h-12 w-12 rounded-2xl bg-card object-cover ring-1 ring-border/60"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{cand.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {job.title}
                  </p>
                  {c.note && (
                    <p className="mt-0.5 truncate text-[11px] italic text-muted-foreground">
                      “{c.note}”
                    </p>
                  )}
                </div>
                <Badge className="shrink-0 bg-muted text-foreground/80 border-0">
                  {c.stage}
                </Badge>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => toast(`Abriendo chat con ${cand.name.split(" ")[0]}`)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Chat
                </button>
                <button
                  onClick={() => advance(idx)}
                  disabled={c.stage === "Contratado"}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-gradient-brand px-3 py-2 text-xs font-semibold text-primary-foreground shadow-soft disabled:opacity-40"
                >
                  Avanzar <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
