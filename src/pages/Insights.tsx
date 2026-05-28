import { useState } from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Result {
  group: string;
  match: number;
  reasons: string[];
  recommendations: string[];
}

const KEYWORDS: Record<string, string[]> = {
  "Data & IA": ["data", "datos", "python", "sql", "machine learning", "ia", "ai", "analytics", "ml"],
  "Marketing & Growth": ["marketing", "growth", "seo", "ads", "branding", "redes", "contenido"],
  "Producto & UX": ["ux", "ui", "producto", "figma", "diseño", "design", "usabilidad"],
  "Finanzas & Consultoría": ["finanzas", "consultoría", "consulting", "excel", "valoración", "mba"],
  "Sostenibilidad": ["sostenibilidad", "climate", "esg", "verde", "impacto"],
  "Ciberseguridad": ["ciber", "security", "pentesting", "hacking", "soc"],
};

function analyze(text: string): Result {
  const t = text.toLowerCase();
  const scores = Object.entries(KEYWORDS).map(([group, kws]) => {
    const hits = kws.filter((k) => t.includes(k));
    return { group, hits, score: hits.length };
  });
  scores.sort((a, b) => b.score - a.score);
  const winner = scores[0];
  const base = Math.min(95, 55 + winner.score * 10 + Math.min(20, t.length / 10));
  return {
    group: winner.score > 0 ? winner.group : "Producto & UX",
    match: Math.round(base),
    reasons:
      winner.score > 0
        ? winner.hits.slice(0, 4).map((h) => `Mencionas “${h}”, clave en ${winner.group}.`)
        : ["Tu perfil es transversal: encajas bien explorando producto y estrategia."],
    recommendations: [
      "Conecta con 3 estudiantes del grupo para ampliar red.",
      "Revisa 5 ofertas afines en el feed Descubrir.",
      "Añade 2 proyectos concretos a tu bio para subir visibilidad.",
    ],
  };
}

export default function Insights() {
  const [text, setText] = useState(
    "Estudio un máster en Data Science, sé Python y SQL, busco prácticas en analytics."
  );
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(analyze(text));
      setLoading(false);
    }, 700);
  };

  return (
    <AppShell>
      <header className="px-5 pt-6 pb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">IA Match</p>
        <h1 className="font-display text-2xl font-extrabold">Encaja en grupos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pega tu bio o intereses y nuestra IA te sitúa en el grupo profesional ideal.
        </p>
      </header>

      <section className="space-y-3 px-5">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          className="rounded-2xl border-border bg-card"
          placeholder="Cuéntanos sobre ti, tu máster y qué buscas…"
        />
        <Button
          onClick={run}
          disabled={!text.trim() || loading}
          className="w-full bg-gradient-brand border-0 hover:opacity-90 shadow-glow"
          size="lg"
        >
          <Sparkles className="mr-1 h-4 w-4" />
          {loading ? "Analizando…" : "Analizar mi perfil"}
        </Button>
      </section>

      {result && (
        <section className="mx-5 mt-5 rounded-3xl bg-gradient-card p-5 shadow-card border border-border/40 animate-pop-in">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Mejor encaje</p>
              <p className="font-display text-xl font-extrabold">{result.group}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-gradient-brand">{result.match}%</p>
              <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <TrendingUp className="h-3 w-3" /> compatibilidad
              </p>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-brand transition-all"
              style={{ width: `${result.match}%` }}
            />
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Por qué</p>
              <ul className="space-y-1 text-sm">
                {result.reasons.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-primary">•</span>{r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Próximos pasos</p>
              <ul className="space-y-1 text-sm">
                {result.recommendations.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-secondary">→</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </AppShell>
  );
}
