import { useRef, useState } from "react";
import { BadgeCheck, Briefcase, GraduationCap, LogOut, MapPin, Pencil, Settings, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const roleSettings = {
  student: {
    km: 25,
    preference: ["Empresas", "Prácticas", "Grupos", "Startups", "Mentoría"],
    modality: ["Híbrido", "Remoto"],
    intent: ["Prácticas", "Networking", "Proyectos"],
    location: "Madrid, ES",
    about:
      "Estudiante de máster con muchas ganas de empezar mi carrera. Me motiva aprender en equipos diversos y descubrir oportunidades con buen encaje.",
    skills: ["Python", "Comunicación", "Inglés C1", "Trabajo en equipo", "Análisis"],
    stats: [
      { label: "Likes", value: 24 },
      { label: "Matches", value: 7 },
      { label: "Vistas", value: 156 },
    ],
  },
  company: {
    km: 60,
    preference: ["Talento junior", "Universidades", "Becas", "Producto", "Tech"],
    modality: ["Presencial", "Híbrido"],
    intent: ["Contratación", "Employer branding", "Pipeline"],
    location: "Madrid, ES",
    about:
      "Empresa que apuesta por el talento joven, la mentoría real y procesos de selección más humanos.",
    skills: ["Mentoría", "Producto", "Cultura", "Beca remunerada"],
    stats: [
      { label: "Likes", value: 42 },
      { label: "Matches", value: 18 },
      { label: "Vistas", value: 310 },
    ],
  },
  recruiter: {
    km: 80,
    preference: ["Tech", "Producto", "Data", "Growth", "Junior"],
    modality: ["Remoto", "Híbrido"],
    intent: ["Pipeline", "Entrevistas", "Shortlist"],
    location: "Barcelona, ES",
    about:
      "Reclutador conectando talento joven con oportunidades de calidad. Especializado en perfiles tech, producto y growth.",
    skills: ["Sourcing", "Tech screening", "Negociación", "Employer branding"],
    stats: [
      { label: "Likes", value: 39 },
      { label: "Matches", value: 21 },
      { label: "Vistas", value: 284 },
    ],
  },
};

const kmStops = [5, 10, 25, 50, 80, 120, 150];
const preferenceKeywords = [
  "Empresas",
  "Prácticas",
  "Primer empleo",
  "Becas",
  "Startups",
  "Corporativo",
  "Universidades",
  "Grupos",
  "Mentoría",
  "Eventos",
  "Hackathons",
  "Talento junior",
  "Tech",
  "Producto",
  "Data",
  "IA",
  "UX/UI",
  "Marketing",
  "Growth",
  "Ventas",
  "Finanzas",
  "Consultoría",
  "Sostenibilidad",
  "Ciberseguridad",
];
const modalityKeywords = [
  "Presencial",
  "Híbrido",
  "Remoto",
  "Flexible",
  "Media jornada",
  "Tiempo completo",
  "Freelance",
  "Prácticas curriculares",
  "Prácticas extracurriculares",
];
const priorityKeywords = [
  "Networking",
  "Prácticas",
  "Proyectos",
  "Portfolio",
  "Mentoría",
  "Contratación",
  "Pipeline",
  "Entrevistas",
  "Shortlist",
  "Comunidad",
  "Quedadas",
  "Aprendizaje",
  "Cultura",
  "Salario",
  "Crecimiento",
  "Impacto",
];

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const settingsRef = useRef<HTMLElement | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState(() => ({
    name: user?.name ?? "Tu nombre",
    email: user?.email ?? "tu@email.com",
    km: String(roleSettings[user?.role ?? "student"].km),
    preference: roleSettings[user?.role ?? "student"].preference,
    modality: roleSettings[user?.role ?? "student"].modality,
    intent: roleSettings[user?.role ?? "student"].intent,
  }));
  const display = user ?? { name: "Tu nombre", email: "tu@email.com", role: "student" as const };
  const displayName = form.name || display.name;
  const displayEmail = form.email || display.email;
  const isStudent = display.role === "student";
  const isRecruiter = display.role === "recruiter";
  const roleLabel = isStudent ? "Estudiante" : isRecruiter ? "Reclutador" : "Empresa";
  const RoleIcon = isStudent ? GraduationCap : isRecruiter ? SlidersHorizontal : Briefcase;
  const settings = roleSettings[display.role];
  const visibleSettings = {
    ...settings,
    km: Number(form.km) || settings.km,
    preference: form.preference,
    modality: form.modality,
    intent: form.intent,
  };
  const openSettings = () => {
    settingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const toggleTag = (field: "preference" | "modality" | "intent", tag: string) => {
    setForm((prev) => {
      const selected = prev[field];
      return {
        ...prev,
        [field]: selected.includes(tag)
          ? selected.filter((item) => item !== tag)
          : [...selected, tag],
      };
    });
  };

  return (
    <AppShell>
      <main className="relative z-10 flex-1 px-5 pb-4 pt-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/75 bg-white/72 shadow-card backdrop-blur-2xl">
          <div className="relative h-36 bg-gradient-brand">
            <div className="absolute inset-0 opacity-30 mix-blend-overlay [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_36%),radial-gradient(circle_at_85%_70%,white_0,transparent_30%)]" />
            <div className="absolute right-4 top-4 flex gap-2">
              <button
                onClick={openSettings}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-white/20 bg-white/20 text-white backdrop-blur-xl"
                aria-label="Ajustes"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-white/20 bg-white/20 text-white backdrop-blur-xl"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="-mt-14 p-5 pt-0">
            <div className="relative flex items-end gap-4">
              <div className="h-24 w-24 overflow-hidden rounded-[1.5rem] bg-card shadow-glow ring-4 ring-background">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <h1 className="truncate font-display text-2xl font-extrabold leading-tight">
                  {displayName}
                </h1>
                <p className="truncate text-sm text-muted-foreground">{displayEmail}</p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gradient-brand px-3 py-1 text-xs font-bold text-primary-foreground shadow-glow">
                  <RoleIcon className="h-3.5 w-3.5" /> {roleLabel}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 rounded-2xl" onClick={() => setEditorOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </Button>
              <Button
                className="h-12 rounded-2xl border-0 bg-gradient-brand shadow-glow"
                onClick={() => setEditorOpen(true)}
              >
                <Settings className="mr-2 h-4 w-4" /> Ajustes
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-3 gap-3">
          {visibleSettings.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-3xl border border-white/75 bg-white/72 p-3 text-center shadow-soft backdrop-blur-2xl"
            >
              <p className="font-display text-2xl font-extrabold text-gradient-brand">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>

        <section
          ref={settingsRef}
          className="mt-4 scroll-mt-6 rounded-[2rem] border border-white/75 bg-white/72 p-5 shadow-soft backdrop-blur-2xl"
        >
          <h2 className="font-display text-lg font-bold">Ajustes de matching</h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Radio de búsqueda</span>
                <span className="font-bold text-primary">{visibleSettings.km} km</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-brand"
                  style={{ width: `${Math.min((visibleSettings.km / 150) * 100, 100)}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-bold text-muted-foreground">
                {kmStops.map((km) => (
                  <span key={km}>{km}</span>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <SettingTags label="Preferencias" values={visibleSettings.preference} />
              <SettingTags label="Modalidad" values={visibleSettings.modality} />
              <SettingTags label="Prioridad" values={visibleSettings.intent} />
              <SettingRow
                label="Ubicación"
                value={settings.location}
                icon={<MapPin className="h-4 w-4" />}
              />
            </div>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[2rem] border border-white/75 bg-white/72 shadow-soft backdrop-blur-2xl">
          <div className="grid grid-cols-[auto_1fr] items-center gap-4 p-5">
            <div className="relative grid h-24 w-24 place-items-center rounded-[1.7rem] bg-gradient-brand shadow-glow">
              <div className="absolute -right-1 -top-1 grid h-8 w-8 place-items-center rounded-full bg-card text-primary shadow-soft">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div className="relative h-16 w-16 rounded-2xl border-2 border-white/45 bg-white/18 backdrop-blur">
                <div className="absolute left-3 top-5 h-3 w-3 animate-pulse rounded-full bg-white" />
                <div className="absolute right-3 top-5 h-3 w-3 animate-pulse rounded-full bg-white [animation-delay:180ms]" />
                <div className="absolute bottom-4 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-white/90" />
                <div className="absolute -top-3 left-1/2 h-4 w-1 -translate-x-1/2 rounded-full bg-white/75" />
              </div>
            </div>
            <div>
              <p className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> Verificado
              </p>
              <h2 className="mt-2 font-display text-lg font-bold">Verificación de identidad</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Rostro validado por simulación biométrica. Tu perfil aparece con mayor confianza en matches y chats.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[2rem] border border-white/75 bg-white/72 p-5 shadow-soft backdrop-blur-2xl">
          <h2 className="font-display text-lg font-bold">Sobre mí</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{visibleSettings.about}</p>
        </section>

        <section className="mt-4 rounded-[2rem] border border-white/75 bg-white/72 p-5 shadow-soft backdrop-blur-2xl">
          <h2 className="mb-3 font-display text-lg font-bold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {visibleSettings.skills.map((s) => (
              <span key={s} className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold">
                {s}
              </span>
            ))}
          </div>
        </section>
        {editorOpen ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/45 p-3 backdrop-blur-md sm:items-center">
            <form
              className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-[2rem] border border-white/75 bg-card p-5 shadow-card"
              onSubmit={(event) => {
                event.preventDefault();
                setEditorOpen(false);
                openSettings();
                toast.success("Preferencias actualizadas en la demo");
              }}
            >
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                  Editar demo
                </p>
                <h2 className="font-display text-2xl font-black">Perfil y preferencias</h2>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-3">
                  <label className="grid gap-2">
                    <Label>Nombre</Label>
                    <Input
                      value={form.name}
                      onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    />
                  </label>
                </div>

                <div className="grid gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <Label>Radio de búsqueda</Label>
                    <strong className="text-primary">{form.km} km</strong>
                  </div>
                  <input
                    min="5"
                    max="150"
                    step="5"
                    type="range"
                    value={form.km}
                    onChange={(event) => setForm((prev) => ({ ...prev, km: event.target.value }))}
                    className="h-2 w-full accent-primary"
                  />
                  <div className="flex items-center justify-between gap-1">
                    {kmStops.map((km) => (
                      <button
                        key={km}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, km: String(km) }))}
                        className={`grid min-h-9 min-w-9 place-items-center rounded-full px-2 text-[11px] font-bold transition-all ${
                          Number(form.km) === km
                            ? "bg-gradient-brand text-primary-foreground shadow-glow"
                            : "bg-card text-muted-foreground"
                        }`}
                      >
                        {km}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  />
                </label>

                <TagPicker
                  label="Preferencias"
                  options={preferenceKeywords}
                  selected={form.preference}
                  onToggle={(tag) => toggleTag("preference", tag)}
                />

                <TagPicker
                  label="Modalidad"
                  options={modalityKeywords}
                  selected={form.modality}
                  onToggle={(tag) => toggleTag("modality", tag)}
                />

                <TagPicker
                  label="Prioridad"
                  options={priorityKeywords}
                  selected={form.intent}
                  onToggle={(tag) => toggleTag("intent", tag)}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-2xl"
                  onClick={() => setEditorOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="h-12 rounded-2xl border-0 bg-gradient-brand shadow-glow">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        ) : null}
      </main>
    </AppShell>
  );
}

function SettingRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/50 bg-card/60 p-3">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        {icon}
        {label}
      </span>
      <strong className="max-w-[58%] text-right text-sm text-foreground">{value}</strong>
    </div>
  );
}

function SettingTags({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="grid gap-2 rounded-2xl border border-border/50 bg-card/60 p-3">
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function TagPicker({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (tag: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="max-h-32 overflow-y-auto rounded-2xl border border-border/60 bg-muted/35 p-2">
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const active = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => onToggle(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-gradient-brand text-primary-foreground shadow-glow"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
