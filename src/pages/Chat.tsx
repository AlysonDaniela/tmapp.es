import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { initialChats, initialMatches, profiles, type ChatMessage } from "@/data/mock";

export default function Chat() {
  const { matchId = "" } = useParams();
  const match = initialMatches.find((m) => m.id === matchId);
  const directProfileId = matchId.startsWith("profile-") ? matchId.replace("profile-", "") : "";
  const profile = match
    ? profiles.find((p) => p.id === match.profileId)
    : profiles.find((p) => p.id === directProfileId);
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialChats[matchId] ??
      (profile
        ? [
            {
              id: `${matchId}-intro`,
              matchId,
              fromMe: false,
              text: `Hola, soy ${profile.name.split(" ")[0]}. Gracias por revisar mi candidatura.`,
              at: "Ahora",
            },
          ]
        : [])
  );
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <p>Conversación no encontrada. <Link to="/matches" className="text-primary underline">Volver</Link></p>
      </div>
    );
  }

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      matchId,
      fromMe: true,
      text: text.trim(),
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((m) => [...m, msg]);
    setText("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now().toString() + "r",
          matchId,
          fromMe: false,
          text: "¡Genial! Te escribo más detalles en breve 😊",
          at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1100);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-soft">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/50 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <Link to="/matches" aria-label="Volver" className="flex h-9 w-9 items-center justify-center rounded-xl bg-card shadow-soft">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <img src={profile.avatar} alt={profile.name} className="h-10 w-10 rounded-xl bg-muted object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{profile.name}</p>
          <p className="truncate text-xs text-muted-foreground">{profile.headline}</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 space-y-2 px-4 py-4">
        <div className="mb-3 rounded-2xl bg-gradient-brand/10 border border-primary/20 p-3 text-center text-xs text-foreground/70">
          {match ? `¡Hicisteis match ${match.matchedAt.toLowerCase()}!` : "Conversación iniciada desde candidatos."} Rompe el hielo 👇
        </div>
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-soft ${
                m.fromMe
                  ? "bg-gradient-brand text-primary-foreground rounded-br-md"
                  : "bg-card text-foreground rounded-bl-md"
              }`}
            >
              <p>{m.text}</p>
              <p className={`mt-1 text-[10px] ${m.fromMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.at}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </main>

      <form
        onSubmit={send}
        className="sticky bottom-0 mx-auto flex w-full max-w-md items-center gap-2 border-t border-border/50 bg-background/85 p-3 backdrop-blur-lg"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje…"
          className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          aria-label="Enviar"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow disabled:opacity-50"
          disabled={!text.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
