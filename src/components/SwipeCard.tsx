import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Banknote, Briefcase, GraduationCap, Info, ListChecks, MapPin, Sparkles } from "lucide-react";
import { jobs, type Profile } from "@/data/mock";
import { Badge } from "@/components/ui/badge";

interface Props {
  profile: Profile;
  onSwipe: (dir: "left" | "right") => void;
  onMore?: (profile: Profile) => void;
  active?: boolean;
  stackIndex?: number;
}

export function SwipeCard({ profile, onSwipe, onMore, active = true, stackIndex = 0 }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [40, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -40], [1, 0]);

  const handleEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 110) onSwipe("right");
    else if (info.offset.x < -110) onSwipe("left");
  };

  const isCompany = profile.type === "company";
  const isRecruiter = profile.type === "recruiter";
  const roleLabel = isCompany ? "Empresa" : isRecruiter ? "Reclutador" : "Estudiante";
  const heroImage = profile.cover ?? profile.avatar;
  const featuredJob = isCompany ? jobs.find((job) => job.companyId === profile.id) : undefined;
  const primaryTags = [
    ...(featuredJob?.skills ?? []),
    ...(featuredJob?.requirements ?? []),
    ...(profile.lookingFor ?? []),
    ...(profile.specialties ?? []),
    ...profile.skills,
  ].slice(0, 5);

  return (
    <motion.article
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleEnd}
      style={{ x, rotate }}
      initial={{ scale: 1 - stackIndex * 0.04, y: stackIndex * 10, opacity: 1 }}
      animate={{ scale: 1 - stackIndex * 0.04, y: stackIndex * 10 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="absolute inset-0 flex cursor-grab flex-col overflow-hidden rounded-[2rem] border border-white/75 bg-white shadow-card active:cursor-grabbing"
    >
      <div className="relative h-[42%] min-h-0 shrink-0 overflow-hidden bg-primary">
        <img
          src={heroImage}
          alt={profile.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(109,47,144,.42),transparent_32%)] mix-blend-multiply" />

        {isCompany && (
          <div className="absolute left-5 top-5 grid h-20 w-20 place-items-center overflow-hidden rounded-3xl border border-white/70 bg-white/92 p-2 shadow-glow backdrop-blur-xl">
            <img src={profile.avatar} alt={`${profile.name} logo`} className="h-full w-full rounded-2xl object-cover" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <Badge className="mb-2 border border-white/25 bg-white/18 text-white backdrop-blur-xl">
                {roleLabel}
              </Badge>
              <h3 className="font-display text-3xl font-black leading-none sm:text-4xl">
                {featuredJob?.title ?? profile.name}
              </h3>
              {featuredJob && <p className="mt-1 text-sm font-bold text-white/88">{profile.name}</p>}
            </div>
            <span className="shrink-0 rounded-full bg-white/18 px-3 py-1 text-xs font-semibold backdrop-blur-xl">
              {featuredJob?.type ?? (isCompany ? profile.size : profile.master ? "Máster" : "Networking")}
            </span>
          </div>
        </div>

        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute left-5 top-5 rounded-xl border-4 border-success bg-white/85 px-3 py-1 text-2xl font-extrabold uppercase text-success shadow-soft backdrop-blur"
        >
          Like
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute right-5 top-5 rounded-xl border-4 border-destructive bg-white/85 px-3 py-1 text-2xl font-extrabold uppercase text-destructive shadow-soft backdrop-blur"
        >
          Dislike
        </motion.div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 bg-white/94 p-4 text-foreground backdrop-blur-xl">
        <div>
          <p className="text-sm font-bold leading-5 text-foreground">
            {featuredJob ? featuredJob.description : profile.headline}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {featuredJob?.location ?? profile.location}
            </span>
            {featuredJob?.salary && (
              <span className="inline-flex items-center gap-1 font-bold text-primary">
                <Banknote className="h-3.5 w-3.5" /> {featuredJob.salary}
              </span>
            )}
            {profile.university && (
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5" /> {profile.university}
              </span>
            )}
            {profile.industry && (
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" /> {profile.industry}
              </span>
            )}
          </div>
        </div>

        {featuredJob?.requirements && (
          <div className="rounded-[1.3rem] border border-primary/10 bg-primary/5 p-2.5">
            <p className="mb-1.5 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] text-primary">
              <ListChecks className="h-3.5 w-3.5" /> Lo que pide
            </p>
            <div className="flex flex-wrap gap-1.5">
              {featuredJob.requirements.slice(0, 3).map((item) => (
                <span key={item} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-foreground shadow-soft">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMore?.(profile);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/12 bg-primary px-4 py-3 text-sm font-black text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5"
        >
          <Info className="h-4 w-4" /> Saber más
        </button>

        {!featuredJob && (
          <>
            <div className="flex flex-wrap gap-1.5">
              {primaryTags.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-primary/12 bg-primary/8 px-2.5 py-1 text-[11px] font-bold text-primary"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="rounded-[1.3rem] border border-border/70 bg-gradient-card p-2.5 text-foreground shadow-soft">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <p className="line-clamp-2 text-sm font-semibold leading-5 text-foreground/82">{profile.bio}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.article>
  );
}
