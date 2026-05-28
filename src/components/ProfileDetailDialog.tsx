import { Banknote, Briefcase, GraduationCap, ListChecks, MapPin, MessageCircle, Sparkles, X } from "lucide-react";
import { jobs, type Profile } from "@/data/mock";
import { Button } from "@/components/ui/button";

interface ProfileDetailDialogProps {
  profile: Profile | null;
  open: boolean;
  onClose: () => void;
  onLike?: () => void;
  onPass?: () => void;
  mode?: "swipe" | "match";
  onChat?: () => void;
  onRemove?: () => void;
}

export function ProfileDetailDialog({
  profile,
  open,
  onClose,
  onLike,
  onPass,
  mode = "swipe",
  onChat,
  onRemove,
}: ProfileDetailDialogProps) {
  if (!open || !profile) return null;

  const isCompany = profile.type === "company";
  const isRecruiter = profile.type === "recruiter";
  const roleLabel = isCompany ? "Empresa" : isRecruiter ? "Reclutador" : "Estudiante";
  const featuredJob = isCompany ? jobs.find((job) => job.companyId === profile.id) : undefined;
  const detailItems = [
    profile.university,
    profile.master,
    profile.industry,
    profile.size,
    profile.agency,
    ...(profile.specialties ?? []),
    ...(profile.lookingFor ?? []),
    ...(featuredJob?.skills ?? profile.openings ?? []),
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-3 backdrop-blur-md sm:items-center">
      <article className="flex h-[min(92svh,700px)] w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-white/75 bg-card shadow-card">
        <div className="relative h-48 shrink-0 overflow-hidden bg-gradient-brand">
          <div className="absolute inset-0 opacity-30 mix-blend-overlay [background-image:radial-gradient(circle_at_25%_20%,white_0,transparent_36%),radial-gradient(circle_at_80%_72%,white_0,transparent_30%)]" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur-xl"
            aria-label="Cerrar detalle"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-5 right-5 flex items-end gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-20 w-20 rounded-[1.25rem] border-4 border-white/50 bg-card object-cover shadow-2xl"
            />
            <div className="min-w-0 text-white">
              <span className="mb-1 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-xl">
                {featuredJob?.type ?? roleLabel}
              </span>
              <h2 className="font-display text-2xl font-black leading-tight">
                {featuredJob?.title ?? profile.name}
              </h2>
              <p className="line-clamp-2 text-sm text-white/78">
                {featuredJob ? `${profile.name} · ${featuredJob.location}` : profile.headline}
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain bg-card p-5">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {featuredJob?.location ?? profile.location}
            </span>
            {featuredJob?.salary && (
              <span className="inline-flex items-center gap-1 font-bold text-primary">
                <Banknote className="h-4 w-4" /> {featuredJob.salary}
              </span>
            )}
            {profile.university && (
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="h-4 w-4" /> {profile.university}
              </span>
            )}
            {profile.industry && (
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-4 w-4" /> {profile.industry}
              </span>
            )}
          </div>

          <section>
            <p className="mb-2 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {featuredJob ? "Sobre la vacante" : "Sobre el match"}
            </p>
            <p className="text-sm leading-7 text-foreground/78">
              {featuredJob?.description ?? profile.bio}
            </p>
          </section>

          {featuredJob?.requirements && (
            <section className="rounded-3xl border border-primary/10 bg-primary/5 p-4">
              <p className="mb-3 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
                <ListChecks className="h-3.5 w-3.5" /> Lo que pide
              </p>
              <div className="flex flex-wrap gap-2">
                {featuredJob.requirements.map((item) => (
                  <span key={item} className="rounded-full bg-card px-3 py-1.5 text-xs font-bold shadow-soft">
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {featuredJob?.benefits && (
            <section>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
                Beneficios
              </p>
              <div className="flex flex-wrap gap-2">
                {featuredJob.benefits.map((item) => (
                  <span key={item} className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {featuredJob && (
            <section>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
                Sobre la empresa
              </p>
              <p className="text-sm leading-7 text-foreground/78">{profile.bio}</p>
            </section>
          )}

          <section>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
              {featuredJob ? "Skills de la vacante" : "Skills y señales"}
            </p>
            <div className="flex flex-wrap gap-2">
              {[...profile.skills, ...detailItems].slice(0, 12).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-semibold text-foreground/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        </div>

        {mode === "match" ? (
          <div className="grid shrink-0 grid-cols-[0.9fr_1.1fr] gap-3 border-t border-border/50 bg-card p-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl text-destructive hover:text-destructive"
              onClick={onRemove}
            >
              Desistir
            </Button>
            <Button
              type="button"
              className="h-12 rounded-2xl border-0 bg-gradient-brand shadow-glow"
              onClick={onChat}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Abrir chat
            </Button>
          </div>
        ) : (
          <div className="grid shrink-0 grid-cols-[0.9fr_1.1fr] gap-3 border-t border-border/50 bg-card p-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl"
              onClick={onPass}
            >
              Dislike
            </Button>
            <Button
              type="button"
              className="h-12 rounded-2xl border-0 bg-gradient-brand shadow-glow"
              onClick={onLike}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Like
            </Button>
          </div>
        )}
      </article>
    </div>
  );
}
