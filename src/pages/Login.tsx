import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Check, GraduationCap, Plus, SearchCheck, UserPlus, X } from "lucide-react";
import { useAuth, UserRole } from "@/hooks/useAuth";
import { toast } from "sonner";
import logo from "@/assets/talent-match-logo.svg";

const demoProfiles: Array<{
  role: UserRole;
  title: string;
  eyebrow: string;
  name: string;
  email: string;
  copy: string;
  Icon: typeof GraduationCap;
  visual: string;
}> = [
  {
    role: "student",
    title: "Estudiante",
    eyebrow: "Buscar oportunidades",
    name: "Aly Demo",
    email: "demo.student@talentmatch.app",
    copy: "Descubre empresas, grupos, oportunidades y matches desde la experiencia de estudiante.",
    Icon: GraduationCap,
    visual: "from-primary to-primary-glow",
  },
  {
    role: "company",
    title: "Empresa",
    eyebrow: "Activar comunidad",
    name: "Campus Partner",
    email: "demo.company@talentmatch.app",
    copy: "Prueba la demo como empresa o institución que quiere conectar con talento joven.",
    Icon: Building2,
    visual: "from-primary to-secondary",
  },
  {
    role: "recruiter",
    title: "Reclutador",
    eyebrow: "Encontrar talento",
    name: "Recruiter Demo",
    email: "demo.recruiter@talentmatch.app",
    copy: "Explora perfiles junior, matches y conversaciones desde el modo de reclutamiento.",
    Icon: SearchCheck,
    visual: "from-secondary to-primary",
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: "",
    email: "",
    role: "student" as UserRole,
    tags: ["Networking", "Prácticas"],
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const starterTags = [
    "Networking",
    "Prácticas",
    "Primer empleo",
    "Mentoría",
    "Producto",
    "Marketing",
    "Data",
    "Diseño",
    "Startup",
    "Remoto",
    "Híbrido",
    "Eventos",
  ];

  function selectDemo(profile: (typeof demoProfiles)[number]) {
    login({ email: profile.email, name: profile.name, role: profile.role });
    toast.success(`Entraste como ${profile.title}`);
    navigate("/discover", { replace: true });
  }

  function toggleTag(tag: string) {
    setNewProfile((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }));
  }

  function createProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newProfile.name.trim();
    const email = newProfile.email.trim();
    if (!name || !email) {
      toast.error("Completa nombre y email para crear el perfil");
      return;
    }
    login({ email, name, role: newProfile.role });
    toast.success("Perfil creado", {
      description: "Ya puedes revisar tu perfil y ajustar preferencias.",
    });
    navigate("/profile", { replace: true });
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
  }

  return (
    <div className="min-h-screen bg-gradient-soft px-5 py-6">
      <header className="mx-auto mb-8 flex max-w-6xl items-center gap-3 rounded-2xl border border-white/70 bg-white/70 p-3 shadow-soft backdrop-blur-xl">
        <img src={logo} alt="Talent Match" className="h-14 w-auto max-w-[210px]" />
        <p className="ml-auto hidden text-sm text-muted-foreground sm:block">Elige una demo para entrar</p>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Demo interactiva</p>
          <h1 className="mt-3 font-display text-4xl font-black leading-tight text-foreground sm:text-6xl">
            Selecciona un perfil y entra directo.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            No hay formulario ni contraseña. La tarjeta que elijas abre la app existente con ese modo activo.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4" aria-label="Seleccion de perfil demo">
          {demoProfiles.map((profile) => {
            const Icon = profile.Icon;
            return (
              <button
                key={profile.role}
                type="button"
                onClick={() => selectDemo(profile)}
                className="group grid gap-4 rounded-[2rem] border border-white/80 bg-white/75 p-4 text-left shadow-card backdrop-blur-2xl transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className={`grid aspect-[1.3] place-items-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${profile.visual}`}>
                  <div className="grid h-28 w-28 place-items-center rounded-[2rem] border border-white/30 bg-white/20 shadow-2xl backdrop-blur-xl transition-transform group-hover:scale-105">
                    <Icon className="h-14 w-14 text-white" strokeWidth={1.8} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{profile.eyebrow}</p>
                  <h2 className="mt-2 font-display text-2xl font-black text-foreground">{profile.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{profile.copy}</p>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="group grid gap-4 rounded-[2rem] border border-primary/20 bg-primary text-left text-primary-foreground shadow-card transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="grid aspect-[1.3] place-items-center overflow-hidden rounded-t-[2rem] bg-gradient-accent p-4">
              <div className="grid h-28 w-28 place-items-center rounded-[2rem] border border-white/30 bg-white/18 shadow-2xl backdrop-blur-xl transition-transform group-hover:scale-105">
                <UserPlus className="h-14 w-14 text-white" strokeWidth={1.8} />
              </div>
            </div>
            <div className="px-4 pb-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/74">Nuevo perfil</p>
              <h2 className="mt-2 font-display text-2xl font-black">Crear perfil</h2>
              <p className="mt-2 text-sm leading-6 text-white/78">
                Arma una cuenta demo con nombre, rol, foto o logo y etiquetas para ver la experiencia completa.
              </p>
            </div>
          </button>
        </section>
      </main>

      {createOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-primary/70 p-4 backdrop-blur-xl">
          <form
            onSubmit={createProfile}
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/16 bg-[#0b0d16] text-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b0d16]/92 p-5 backdrop-blur-xl">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-secondary">Talent Match</p>
                <h2 className="font-display text-3xl font-black">Crear perfil</h2>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/18"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-8 p-5 lg:grid-cols-[1fr_1.05fr]">
              <section className="grid content-start gap-5">
                <div className="grid gap-2">
                  <label htmlFor="new-name" className="text-sm font-bold text-white/82">
                    Nombre
                  </label>
                  <input
                    id="new-name"
                    value={newProfile.name}
                    onChange={(event) => setNewProfile((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Tu nombre o marca"
                    className="rounded-2xl border border-white/12 bg-black/45 px-4 py-3 text-white outline-none transition focus:border-secondary"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="new-email" className="text-sm font-bold text-white/82">
                    Email
                  </label>
                  <input
                    id="new-email"
                    value={newProfile.email}
                    onChange={(event) => setNewProfile((current) => ({ ...current, email: event.target.value }))}
                    placeholder="tu@email.com"
                    type="email"
                    className="rounded-2xl border border-white/12 bg-black/45 px-4 py-3 text-white outline-none transition focus:border-secondary"
                  />
                </div>

                <div className="grid gap-3">
                  <p className="text-sm font-bold text-white/82">Tipo de perfil</p>
                  <div className="grid grid-cols-3 gap-2">
                    {demoProfiles.map((profile) => {
                      const Icon = profile.Icon;
                      const selected = newProfile.role === profile.role;
                      return (
                        <button
                          key={profile.role}
                          type="button"
                          onClick={() => setNewProfile((current) => ({ ...current, role: profile.role }))}
                          className={`grid gap-2 rounded-2xl border p-3 text-center text-sm font-black transition ${
                            selected
                              ? "border-secondary bg-secondary text-white"
                              : "border-white/12 bg-white/6 text-white/78 hover:bg-white/10"
                          }`}
                        >
                          <Icon className="mx-auto h-5 w-5" />
                          {profile.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3">
                  <p className="text-sm font-bold text-white/82">Intereses y keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {starterTags.map((tag) => {
                      const selected = newProfile.tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-bold transition ${
                            selected
                              ? "border-secondary bg-secondary text-white"
                              : "border-white/14 bg-white/7 text-white/76 hover:bg-white/12"
                          }`}
                        >
                          {selected && <Check className="h-3.5 w-3.5" />}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="grid content-start gap-5">
                <div>
                  <p className="mb-3 text-sm font-bold text-white/82">Fotos o logo</p>
                  <input
                    id="profile-photo-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhoto}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <label
                        key={index}
                        htmlFor="profile-photo-upload"
                        className="group relative aspect-[.72] overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/[.06]"
                      >
                        {index === 0 && previewImage ? (
                          <img src={previewImage} alt="Vista previa" className="absolute inset-0 h-full w-full object-cover" />
                        ) : index === 0 ? (
                          <div className="absolute inset-0 bg-gradient-brand" />
                        ) : null}
                        <span className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-secondary text-white shadow-glow transition group-hover:scale-105">
                          <Plus className="h-4 w-4" />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-white/14 bg-white/[.06]">
                  <div className="relative aspect-[3/4]">
                    {previewImage ? (
                      <img src={previewImage} alt="Perfil" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/72">Vista previa</p>
                      <h3 className="mt-2 font-display text-4xl font-black">
                        {newProfile.name || "Tu perfil"}
                      </h3>
                      <p className="mt-2 text-sm text-white/80">
                        {newProfile.role === "student"
                          ? "Estudiante buscando oportunidades"
                          : newProfile.role === "company"
                            ? "Empresa buscando talento"
                            : "Reclutador conectando talento"}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {newProfile.tags.slice(0, 5).map((tag) => (
                          <span key={tag} className="rounded-full bg-white/18 px-3 py-1 text-xs font-bold backdrop-blur-xl">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="border-t border-white/10 bg-gradient-to-r from-primary/35 to-secondary/55 p-5 backdrop-blur-xl">
              <button
                type="submit"
                className="mx-auto block w-full max-w-sm rounded-full bg-white px-6 py-4 text-base font-black text-primary shadow-glow transition hover:-translate-y-0.5"
              >
                Crear perfil
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
