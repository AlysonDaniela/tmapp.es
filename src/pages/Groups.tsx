import { CalendarDays, MapPin, MessageCircle, Users } from "lucide-react";
import { groups } from "@/data/mock";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const meetups = [
  {
    id: "madrid-product",
    title: "Quedada Producto & UX",
    group: "Producto & UX",
    date: "Jueves · 19:00",
    place: "Campus café, Madrid",
    spots: 12,
  },
  {
    id: "data-demo",
    title: "Mini demo night Data & IA",
    group: "Data & IA",
    date: "Viernes · 18:30",
    place: "Online",
    spots: 28,
  },
  {
    id: "growth-breakfast",
    title: "Desayuno Marketing & Growth",
    group: "Marketing & Growth",
    date: "Martes · 09:30",
    place: "Talent Hub",
    spots: 8,
  },
];

export default function Groups() {
  return (
    <AppShell>
      <header className="relative z-10 px-5 pb-3 pt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Networking</p>
        <h1 className="font-display text-2xl font-extrabold">Grupos y quedadas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Únete a comunidades, apúntate a quedadas y empieza conversaciones con gente afín.
        </p>
      </header>

      <section className="relative z-10 px-5 py-3">
        <article className="overflow-hidden rounded-[2rem] border border-white/75 bg-white/72 shadow-card backdrop-blur-2xl">
          <div className="bg-gradient-brand p-5 text-primary-foreground">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
              Próxima quedada destacada
            </p>
            <h2 className="mt-2 font-display text-2xl font-black">{meetups[0].title}</h2>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" /> {meetups[0].date}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {meetups[0].place}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-3 p-4">
            <div>
              <p className="text-sm font-semibold">{meetups[0].group}</p>
              <p className="text-xs text-muted-foreground">{meetups[0].spots} plazas disponibles</p>
            </div>
            <Button
              className="rounded-2xl border-0 bg-gradient-brand shadow-glow"
              onClick={() => toast.success("Te apuntaste a la quedada")}
            >
              Apuntarme
            </Button>
          </div>
        </article>
      </section>

      <section className="relative z-10 px-5 py-3">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Comunidades
        </h2>
        <ul className="grid grid-cols-2 gap-3">
          {groups.map((g) => (
            <li key={g.id}>
              <button
                onClick={() => toast.success(`Te has unido a ${g.name}`)}
                className={`group flex h-full min-h-40 w-full flex-col items-start gap-2 rounded-[1.6rem] border border-white/30 bg-gradient-to-br ${g.color} p-4 text-left text-white shadow-card transition-transform active:scale-95`}
              >
                <span className="text-3xl">{g.emoji}</span>
                <span className="font-display font-bold leading-tight">{g.name}</span>
                <span className="text-xs text-white/70">Chat, recursos y quedadas</span>
                <span className="mt-auto inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">
                  <Users className="h-3 w-3" /> {g.members}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative z-10 px-5 py-3 pb-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Próximas actividades
        </h2>
        <ul className="space-y-3">
          {meetups.slice(1).map((meetup) => (
            <li
              key={meetup.id}
              className="rounded-[1.5rem] border border-white/75 bg-white/72 p-4 shadow-soft backdrop-blur-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display font-bold">{meetup.title}</p>
                  <p className="text-sm text-muted-foreground">{meetup.group}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {meetup.spots} plazas
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" /> {meetup.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {meetup.place}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => toast("Chat de grupo próximamente")}
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Chat
                </Button>
                <Button
                  className="rounded-2xl border-0 bg-gradient-brand shadow-glow"
                  onClick={() => toast.success(`Reservaste plaza en ${meetup.title}`)}
                >
                  Apuntarme
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
