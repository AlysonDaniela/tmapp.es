import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Brain, CalendarDays, MessageCircle, SlidersHorizontal, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { jobs, profiles, vacancyCandidateLikes } from "@/data/mock";
import { toast } from "sonner";

type SortMode = "score" | "fecha";

export default function JobCandidates() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortMode>("score");
  const [hiddenCandidates, setHiddenCandidates] = useState<string[]>([]);
  const [advancedCandidates, setAdvancedCandidates] = useState<string[]>([]);
  const job = jobs.find((item) => item.id === jobId) ?? jobs[0];
  const company = profiles.find((profile) => profile.id === job.companyId);

  const candidates = useMemo(() => {
    const rows = vacancyCandidateLikes
      .filter((item) => item.jobId === job.id)
      .filter((item) => !hiddenCandidates.includes(item.candidateId))
      .map((item, index) => ({
        ...item,
        index,
        profile: profiles.find((profile) => profile.id === item.candidateId),
      }))
      .filter((item) => item.profile);

    if (sort === "score") return rows.sort((a, b) => b.score - a.score);
    return rows.sort((a, b) => a.index - b.index);
  }, [hiddenCandidates, job.id, sort]);

  const discard = (candidateId: string, name: string) => {
    setHiddenCandidates((current) => [...current, candidateId]);
    toast(`Descartaste a ${name}`);
  };

  const advance = (candidateId: string, name: string) => {
    setAdvancedCandidates((current) =>
      current.includes(candidateId) ? current : [...current, candidateId]
    );
    toast.success(`${name} pasó a entrevista`, {
      action: {
        label: "Ver pipeline",
        onClick: () => navigate("/pipeline"),
      },
    });
  };

  return (
    <AppShell>
      <header className="px-5 pb-3 pt-6">
        <button
          type="button"
          onClick={() => navigate("/jobs")}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-card px-3 py-2 text-xs font-bold text-muted-foreground shadow-soft"
        >
          <ArrowLeft className="h-4 w-4" /> Vacantes
        </button>

        <div className="rounded-[2rem] border border-white/75 bg-white/72 p-4 shadow-card backdrop-blur-2xl">
          <div className="flex items-start gap-3">
            {company && (
              <img
                src={company.avatar}
                alt={company.name}
                className="h-14 w-14 shrink-0 rounded-2xl bg-card object-cover ring-1 ring-border/60"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                Likes de la vacante
              </p>
              <h1 className="mt-1 font-display text-2xl font-black leading-tight">{job.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {company?.name} · {job.location} · {job.salary}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSort("score")}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-black transition ${
                sort === "score"
                  ? "bg-gradient-brand text-primary-foreground shadow-glow"
                  : "bg-card text-muted-foreground"
              }`}
            >
              <Brain className="h-4 w-4" /> Score IA
            </button>
            <button
              type="button"
              onClick={() => setSort("fecha")}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-black transition ${
                sort === "fecha"
                  ? "bg-gradient-brand text-primary-foreground shadow-glow"
                  : "bg-card text-muted-foreground"
              }`}
            >
              <CalendarDays className="h-4 w-4" /> Fecha
            </button>
          </div>
        </div>
      </header>

      <section className="space-y-3 px-5 pb-4">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-muted-foreground">
          <span>{candidates.length} candidatos</span>
          <span className="inline-flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Orden: {sort === "score" ? "mayor match" : "más recientes"}
          </span>
        </div>

        {candidates.map((item) => {
          const candidate = item.profile!;
          return (
            <article
              key={`${item.jobId}-${candidate.id}`}
              className="rounded-[2rem] border border-white/75 bg-white/76 p-4 shadow-soft backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3">
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-soft"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate font-display text-xl font-black">{candidate.name}</h2>
                        {advancedCandidates.includes(candidate.id) && (
                          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-success">
                            Entrevista
                          </span>
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{candidate.headline}</p>
                    </div>
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
                      <span className="text-lg font-black">{item.score}%</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-primary">
                    {item.reason}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {candidate.skills.slice(0, 5).map((skill) => (
                  <span key={skill} className="rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-bold text-primary">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-[0.9fr_1.1fr] gap-2">
                <button
                  type="button"
                  onClick={() => discard(candidate.id, candidate.name)}
                  className="inline-flex h-11 items-center justify-center gap-1 rounded-2xl border border-border bg-background px-3 text-xs font-bold text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" /> Descartar
                </button>
                <button
                  type="button"
                  onClick={() => advance(candidate.id, candidate.name)}
                  disabled={advancedCandidates.includes(candidate.id)}
                  className="inline-flex h-11 items-center justify-center gap-1 rounded-2xl bg-gradient-brand px-3 text-xs font-bold text-primary-foreground shadow-soft"
                >
                  {advancedCandidates.includes(candidate.id) ? "En entrevista" : "Pasar ronda"} <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/chat/profile-${candidate.id}`)}
                className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-muted text-xs font-bold text-muted-foreground"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Enviar mensaje
              </button>
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
