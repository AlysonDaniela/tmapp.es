import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, GraduationCap, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/talent-match-logo.svg";

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/discover", { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-soft text-foreground">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 p-2 pr-4 shadow-soft backdrop-blur-xl">
          <img src={logo} alt="Talent Match" className="h-12 w-auto max-w-[190px]" />
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-92px)] max-w-6xl items-center gap-10 px-5 pb-10 md:grid-cols-[0.95fr_1.05fr] md:px-8">
        <section className="max-w-2xl space-y-6">
          <span className="inline-flex w-max items-center gap-2 rounded-full border border-primary/15 bg-card/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary shadow-soft backdrop-blur-xl">
            <Sparkles className="h-4 w-4" /> Networking universitario
          </span>
          <div className="space-y-4">
            <h1 className="font-display text-6xl font-black leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
              Swipe, match y <span className="text-gradient-brand">trabajo</span>.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Una demo visual para conectar estudiantes, empresas y reclutadores con
              oportunidades reales, grupos afines y conversaciones dentro de la app.
            </p>
          </div>
          <Link to="/login">
            <Button size="lg" className="h-14 rounded-2xl border-0 bg-gradient-brand px-8 text-base font-extrabold shadow-glow hover:opacity-90">
              Probar <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>

        <section className="relative mx-auto h-[430px] w-full max-w-xl sm:h-[540px]" aria-hidden>
          <div className="absolute inset-x-8 top-8 h-[80%] rounded-[2.5rem] border border-white/70 bg-white/45 shadow-card backdrop-blur-2xl" />
          <article className="absolute left-1/2 top-7 z-20 grid w-[min(86vw,360px)] -translate-x-1/2 -rotate-3 gap-4 rounded-[2rem] border border-white/70 bg-white/82 p-6 text-foreground shadow-card backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-xl font-black text-primary-foreground shadow-glow">
                TM
              </span>
              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-extrabold text-primary">
                94% compatible
              </span>
            </div>
            <div>
              <h2 className="font-display text-2xl font-black">Frontend Intern</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Practicas hibridas, startup y comunidad cerca de Madrid.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["product", "web", "networking"].map((tag) => (
                <span key={tag} className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-sm font-semibold">
                  {tag}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <span className="grid h-12 place-items-center rounded-2xl bg-muted font-bold text-primary">
                Dislike
              </span>
              <span className="grid h-12 place-items-center rounded-2xl bg-gradient-brand font-bold text-primary-foreground shadow-glow">
                Like
              </span>
            </div>
          </article>
          <article className="absolute bottom-12 right-0 z-10 hidden w-64 rotate-6 rounded-[1.8rem] border border-white/70 bg-white/55 p-5 shadow-card backdrop-blur-xl sm:grid">
            <Building2 className="mb-4 h-10 w-10 text-primary" />
            <strong className="font-display text-xl">Empresa</strong>
            <span className="text-sm text-muted-foreground">Talento junior con fit real</span>
          </article>
          <article className="absolute bottom-7 left-0 z-30 hidden w-56 -rotate-6 rounded-[1.8rem] border border-white/70 bg-white/55 p-5 shadow-card backdrop-blur-xl sm:grid">
            <GraduationCap className="mb-4 h-10 w-10 text-primary" />
            <strong className="font-display text-xl">Estudiante</strong>
            <span className="text-sm text-muted-foreground">Oportunidades y comunidad</span>
          </article>
          <div className="absolute right-4 top-0 z-30 rounded-2xl border border-white/70 bg-white/65 p-4 shadow-card backdrop-blur-xl">
            <Search className="mb-2 h-5 w-5" />
            <p className="text-sm font-bold">Sin formulario</p>
            <p className="text-xs text-muted-foreground">elige tarjeta y entra</p>
          </div>
        </section>
      </main>
    </div>
  );
}
