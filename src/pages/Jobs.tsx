import { useState, type FormEvent } from "react";
import { Briefcase, CheckCircle2, MapPin, Plus, Sparkles, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobs, profiles, vacancyCandidateLikes, type Job } from "@/data/mock";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const emptyDraft = {
  companyId: "c1",
  title: "",
  salary: "",
  modality: "Híbrido" as Job["modality"],
  skills: "React, Figma, SQL",
  description: "",
};

export default function Jobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isRecruiter = user?.role === "recruiter";
  const title = isRecruiter ? "Empresas y vacantes" : "Tus vacantes publicadas";
  const [jobList, setJobList] = useState(jobs);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const companyOptions = profiles.filter((profile) => profile.type === "company");
  const groupedJobs = companyOptions
    .map((company) => ({
      company,
      jobs: jobList.filter((job) => job.companyId === company.id),
    }))
    .filter((group) => group.jobs.length > 0 || isRecruiter);

  const openCreate = (companyId = "c1") => {
    setEditingJobId(null);
    setDraft({ ...emptyDraft, companyId });
    setCreatorOpen(true);
  };

  const openEdit = (job: Job) => {
    setEditingJobId(job.id);
    setDraft({
      companyId: job.companyId,
      title: job.title,
      salary: job.salary ?? "",
      modality: job.modality,
      skills: job.skills.join(", "),
      description: job.description,
    });
    setCreatorOpen(true);
  };

  function saveVacancy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedSkills = draft.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (editingJobId) {
      setJobList((current) =>
        current.map((job) =>
          job.id === editingJobId
            ? {
                ...job,
                companyId: draft.companyId,
                title: draft.title || job.title,
                salary: draft.salary || job.salary,
                modality: draft.modality,
                location: draft.modality === "Remoto" ? "Remoto · UE" : job.location,
                skills: normalizedSkills.length ? normalizedSkills : job.skills,
                description: draft.description || job.description,
              }
            : job
        )
      );
      toast.success("Vacante actualizada");
    } else {
      setJobList((current) => [
        {
          id: `j-demo-${Date.now()}`,
          companyId: draft.companyId,
          title: draft.title || "Nueva vacante",
          location: draft.modality === "Remoto" ? "Remoto · UE" : "Madrid · Híbrido",
          modality: draft.modality,
          type: "Junior",
          salary: draft.salary || "A definir",
          skills: normalizedSkills.length ? normalizedSkills : ["Comunicación", "Aprendizaje"],
          requirements: normalizedSkills.slice(0, 3),
          benefits: ["Mentoría", "Proceso rápido", "Feedback personalizado"],
          description: draft.description || "Vacante creada desde la demo para recibir candidatos scoreados por IA.",
          applicants: 0,
        },
        ...current,
      ]);
      toast.success("Vacante creada en la demo", {
        description: draft.title || "Nueva vacante lista para recibir likes.",
      });
    }
    setCreatorOpen(false);
  }

  return (
    <AppShell>
      <header className="flex items-end justify-between gap-3 px-5 pt-6 pb-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {isRecruiter ? "Reclutador" : "Empresa"}
          </p>
          <h1 className="font-display text-2xl font-extrabold leading-tight">{title}</h1>
        </div>
        <Button
          size="sm"
          onClick={() => openCreate()}
          className="bg-gradient-accent border-0 hover:opacity-90 shadow-glow"
        >
          <Plus className="mr-1 h-4 w-4" /> Nueva
        </Button>
      </header>

      <section className="space-y-5 px-5">
        {groupedJobs.map(({ company, jobs: companyJobs }) => (
          <div key={company.id} className="space-y-3">
            {isRecruiter && (
              <div className="flex items-center justify-between gap-3 rounded-[1.6rem] border border-white/70 bg-white/60 p-3 shadow-soft backdrop-blur-xl">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={company.avatar}
                    alt={company.name}
                    className="h-11 w-11 rounded-2xl bg-card object-cover ring-1 ring-border/60"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-black">{company.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {company.industry} · {companyJobs.length} vacantes
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openCreate(company.id)}
                  className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary"
                >
                  + Vacante
                </button>
              </div>
            )}

            {companyJobs.map((j) => {
              const scored = vacancyCandidateLikes.filter((candidate) => candidate.jobId === j.id);
              const bestScore = scored.length ? Math.max(...scored.map((item) => item.score)) : null;
              return (
                <article
                  key={j.id}
                  className="overflow-hidden rounded-3xl border border-border/40 bg-gradient-card p-4 shadow-soft"
                >
                  <div className="flex items-start gap-3">
                    {!isRecruiter && (
                      <img
                        src={company.avatar}
                        alt={company.name}
                        className="h-12 w-12 rounded-2xl bg-card object-cover ring-1 ring-border/60"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="font-display text-lg font-black leading-tight">{j.title}</h2>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {company.name} · {j.location}
                          </p>
                        </div>
                        <Badge className="shrink-0 bg-gradient-accent text-secondary-foreground border-0">
                          {j.type}
                        </Badge>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {j.modality}
                        </span>
                        {j.salary && (
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> {j.salary}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" /> {j.applicants} candidatos
                        </span>
                        {bestScore && (
                          <span className="inline-flex items-center gap-1 font-black text-primary">
                            <Sparkles className="h-3 w-3" /> top {bestScore}%
                          </span>
                        )}
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{j.description}</p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {j.skills.map((s) => (
                          <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 grid grid-cols-[0.9fr_1.1fr] gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => openEdit(j)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-brand border-0 hover:opacity-90"
                          onClick={() => navigate(`/jobs/${j.id}/candidates`)}
                        >
                          <Sparkles className="mr-1 h-3.5 w-3.5" /> Candidatos
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </section>

      {creatorOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/45 p-3 backdrop-blur-md sm:items-center">
          <form
            onSubmit={saveVacancy}
            className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-[2rem] border border-white/75 bg-card p-5 shadow-card"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                  {isRecruiter ? "Reclutador" : "Empresa"}
                </p>
                <h2 className="font-display text-2xl font-black">
                  {editingJobId ? "Editar vacante" : "Crear vacante"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Define el puesto para que Talent Match ordene candidatos por coincidencia.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreatorOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4">
              {isRecruiter && (
                <label className="grid gap-2 text-sm font-bold">
                  Empresa cliente
                  <select
                    value={draft.companyId}
                    onChange={(event) => setDraft((prev) => ({ ...prev, companyId: event.target.value }))}
                    className="rounded-2xl border border-input bg-background px-4 py-3 font-medium outline-none focus:border-primary"
                  >
                    {companyOptions.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="grid gap-2 text-sm font-bold">
                Puesto
                <input
                  value={draft.title}
                  onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Ej. Junior Product Designer"
                  className="rounded-2xl border border-input bg-background px-4 py-3 font-medium outline-none focus:border-primary"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Rango salarial
                <input
                  value={draft.salary}
                  onChange={(event) => setDraft((prev) => ({ ...prev, salary: event.target.value }))}
                  placeholder="Ej. 24-28k €/año"
                  className="rounded-2xl border border-input bg-background px-4 py-3 font-medium outline-none focus:border-primary"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Modalidad
                <select
                  value={draft.modality}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, modality: event.target.value as Job["modality"] }))
                  }
                  className="rounded-2xl border border-input bg-background px-4 py-3 font-medium outline-none focus:border-primary"
                >
                  <option>Presencial</option>
                  <option>Híbrido</option>
                  <option>Remoto</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Skills clave
                <textarea
                  value={draft.skills}
                  onChange={(event) => setDraft((prev) => ({ ...prev, skills: event.target.value }))}
                  rows={3}
                  placeholder="React, Figma, SQL..."
                  className="rounded-2xl border border-input bg-background px-4 py-3 font-medium outline-none focus:border-primary"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Descripción
                <textarea
                  value={draft.description}
                  onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
                  rows={4}
                  placeholder="Qué hará la persona, equipo, requisitos principales..."
                  className="rounded-2xl border border-input bg-background px-4 py-3 font-medium outline-none focus:border-primary"
                />
              </label>
            </div>

            <div className="mt-5 rounded-3xl border border-primary/10 bg-primary/5 p-4">
              <p className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.14em] text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" /> IA Match
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Al publicar, los likes se ordenan por coincidencia con skills, modalidad, ubicación y prioridad del candidato.
              </p>
            </div>

            <Button type="submit" className="mt-5 h-12 w-full rounded-2xl border-0 bg-gradient-brand shadow-glow">
              {editingJobId ? "Guardar cambios" : "Publicar vacante demo"}
            </Button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
