export type ProfileType = "student" | "company" | "recruiter";

export interface Profile {
  id: string;
  type: ProfileType;
  name: string;
  headline: string;
  location: string;
  avatar: string;
  cover?: string;
  bio: string;
  skills: string[];
  // student-only
  university?: string;
  master?: string;
  lookingFor?: string[];
  // company-only
  industry?: string;
  size?: string;
  openings?: string[];
  // recruiter-only
  agency?: string;
  specialties?: string[];
  managedCompanies?: string[];
}

export interface Job {
  id: string;
  companyId: string;
  recruiterId?: string;
  title: string;
  location: string;
  modality: "Remoto" | "Híbrido" | "Presencial";
  type: "Prácticas" | "Junior" | "Beca";
  salary?: string;
  skills: string[];
  requirements?: string[];
  benefits?: string[];
  description: string;
  applicants: number;
}

export type PipelineStage = "Nuevo" | "Entrevista" | "Oferta" | "Contratado";

export interface PipelineCandidate {
  candidateId: string;
  jobId: string;
  stage: PipelineStage;
  note?: string;
}

export interface VacancyCandidateLike {
  candidateId: string;
  jobId: string;
  score: number;
  likedAt: string;
  reason: string;
}

export interface Match {
  id: string;
  profileId: string;
  matchedAt: string;
  lastMessage?: string;
  unread?: boolean;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  fromMe: boolean;
  text: string;
  at: string;
}

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=82`;

const logo = (name: string, bg = "233160", color = "ffffff") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=${color}&bold=true&format=svg&size=256`;

export const profiles: Profile[] = [
  {
    id: "s1",
    type: "student",
    name: "Lucía Fernández",
    headline: "Máster en Marketing Digital · Buscando prácticas",
    location: "Madrid, ES",
    avatar: photo("photo-1494790108377-be9c29b29330"),
    cover: photo("photo-1494790108377-be9c29b29330"),
    bio: "Apasionada del growth marketing y la analítica. Busco prácticas de 6 meses para aplicar lo aprendido y crecer en un equipo data-driven.",
    skills: ["SEO", "Google Ads", "Analytics", "HubSpot", "Notion"],
    university: "IE Business School",
    master: "Máster en Marketing Digital",
    lookingFor: ["Prácticas remuneradas", "Mentoría", "Networking"],
  },
  {
    id: "c1",
    type: "company",
    name: "Nimbus Studio",
    headline: "Agencia creativa · 25 personas · Híbrido Madrid",
    location: "Madrid, ES",
    avatar: logo("Nimbus Studio", "233160"),
    cover: photo("photo-1497366754035-f200968a6e72"),
    bio: "Diseñamos productos digitales para startups europeas. Buscamos talento joven con ganas de aprender en un entorno colaborativo.",
    skills: ["UI/UX", "Branding", "Webflow", "Figma"],
    industry: "Diseño & Producto",
    size: "11-50",
    openings: ["Becario UX/UI", "Junior Brand Designer"],
  },
  {
    id: "s2",
    type: "student",
    name: "Mateo Ruiz",
    headline: "Máster en Data Science · Open to work",
    location: "Barcelona, ES",
    avatar: photo("photo-1500648767791-00dcc994a43e"),
    cover: photo("photo-1500648767791-00dcc994a43e"),
    bio: "Background en ingeniería + obsesión por los datos. Busco un primer rol como Data Analyst/Scientist en producto.",
    skills: ["Python", "SQL", "Pandas", "Tableau", "Machine Learning"],
    university: "UPC Barcelona",
    master: "Máster en Data Science",
    lookingFor: ["Primer empleo", "Networking tech"],
  },
  {
    id: "c2",
    type: "company",
    name: "Kairos Health",
    headline: "Healthtech · Serie A · Remoto",
    location: "Remoto · UE",
    avatar: logo("Kairos Health", "6d2f90"),
    cover: photo("photo-1576091160550-2173dba999ef"),
    bio: "Mejoramos el seguimiento de pacientes crónicos con IA. Equipo internacional, mucho impacto, learning budget de 1.500€/año.",
    skills: ["React", "Node", "AWS", "ML Ops"],
    industry: "Healthtech",
    size: "51-200",
    openings: ["Frontend Intern", "Data Analyst Junior"],
  },
  {
    id: "s3",
    type: "student",
    name: "Aisha Khan",
    headline: "MBA · Estrategia y producto",
    location: "Valencia, ES",
    avatar: photo("photo-1531123897727-8f129e1688ce"),
    cover: photo("photo-1531123897727-8f129e1688ce"),
    bio: "Ex-consultora junior con interés en producto y estrategia. Me encantaría colaborar con founders o entrar en un equipo de PM.",
    skills: ["Estrategia", "Product Management", "Excel avanzado", "Inglés C2"],
    university: "EDEM",
    master: "MBA Internacional",
    lookingFor: ["Prácticas estrategia", "Networking founders"],
  },
  {
    id: "c3",
    type: "company",
    name: "Verde Ventures",
    headline: "Climate tech · Seed · 12 personas",
    location: "Bilbao, ES",
    avatar: logo("Verde Ventures", "1f7a56"),
    cover: photo("photo-1500530855697-b586d89ba3ee"),
    bio: "Construimos software para descarbonizar la cadena de suministro. Buscamos perfiles con propósito.",
    skills: ["Python", "GIS", "Sostenibilidad"],
    industry: "Climate Tech",
    size: "1-10",
    openings: ["Operations Intern", "Data Engineer Jr."],
  },
  {
    id: "s4",
    type: "student",
    name: "Diego Santos",
    headline: "Máster en Ciberseguridad",
    location: "Sevilla, ES",
    avatar: photo("photo-1506794778202-cad84cf45f1d"),
    cover: photo("photo-1506794778202-cad84cf45f1d"),
    bio: "Entusiasta del red team y CTFs. Busco prácticas en SOC o pentesting.",
    skills: ["Pentesting", "Linux", "Python", "Burp Suite"],
    university: "Universidad de Sevilla",
    master: "Máster en Ciberseguridad",
    lookingFor: ["Prácticas remoto", "Mentor senior"],
  },
  {
    id: "r1",
    type: "recruiter",
    name: "Carla Méndez",
    headline: "Tech Recruiter · 6 años · 120 contrataciones",
    location: "Madrid, ES",
    avatar: photo("photo-1580489944761-15a19d654956"),
    cover: photo("photo-1580489944761-15a19d654956"),
    bio: "Ayudo a startups tech a encontrar su primer Data/Product talent. Especializada en perfiles junior con potencial.",
    skills: ["Sourcing", "Tech screening", "Employer branding"],
    agency: "TalentBridge",
    specialties: ["Data", "Producto", "Engineering"],
    managedCompanies: ["Kairos Health", "Verde Ventures"],
  },
  {
    id: "r2",
    type: "recruiter",
    name: "Iván Torres",
    headline: "Recruiter creativo · Diseño & Marketing",
    location: "Barcelona, ES",
    avatar: photo("photo-1519085360753-af0119f7cbe7"),
    cover: photo("photo-1519085360753-af0119f7cbe7"),
    bio: "Conecto talento creativo con agencias y startups. Foco en perfiles UX, branding y growth.",
    skills: ["Headhunting", "UX hiring", "Negociación"],
    agency: "Creativa Talent",
    specialties: ["UX/UI", "Marketing", "Branding"],
    managedCompanies: ["Nimbus Studio"],
  },
];

export const jobs: Job[] = [
  {
    id: "j1",
    companyId: "c1",
    recruiterId: "r2",
    title: "Becario/a UX/UI",
    location: "Madrid · Híbrido",
    modality: "Híbrido",
    type: "Prácticas",
    salary: "900 €/mes",
    skills: ["Figma", "UI", "Prototipado"],
    requirements: ["Portfolio básico", "Ganas de aprender", "Disponibilidad 6 meses"],
    benefits: ["Mentoría semanal", "Equipo senior", "Horario flexible"],
    description: "Únete al equipo de producto para diseñar pantallas y prototipos junto a seniors.",
    applicants: 14,
  },
  {
    id: "j2",
    companyId: "c2",
    recruiterId: "r1",
    title: "Frontend Intern (React)",
    location: "Remoto · UE",
    modality: "Remoto",
    type: "Prácticas",
    salary: "1.100 €/mes",
    skills: ["React", "TypeScript", "Tailwind"],
    requirements: ["React básico", "Git", "Inglés B2"],
    benefits: ["Remoto UE", "Learning budget", "Pair programming"],
    description: "Construye features del producto con React + Tailwind. Mentoría semanal.",
    applicants: 22,
  },
  {
    id: "j3",
    companyId: "c2",
    recruiterId: "r1",
    title: "Data Analyst Junior",
    location: "Remoto · UE",
    modality: "Remoto",
    type: "Junior",
    salary: "26-30k €/año",
    skills: ["SQL", "Python", "Tableau"],
    requirements: ["SQL intermedio", "Python/Pandas", "Mentalidad producto"],
    benefits: ["Contrato indefinido", "Equipo internacional", "Impacto clínico"],
    description: "Análisis de cohortes, dashboards de producto y reporting clínico.",
    applicants: 31,
  },
  {
    id: "j4",
    companyId: "c3",
    recruiterId: "r1",
    title: "Operations Intern",
    location: "Bilbao · Híbrido",
    modality: "Híbrido",
    type: "Beca",
    salary: "850 €/mes",
    skills: ["Excel", "Procesos"],
    requirements: ["Excel avanzado", "Organización", "Interés climate tech"],
    benefits: ["Beca remunerada", "Contacto con founders", "Plan de carrera"],
    description: "Apoya al equipo de ops a escalar procesos en una climate-tech en crecimiento.",
    applicants: 9,
  },
];

export const pipeline: PipelineCandidate[] = [
  { candidateId: "s2", jobId: "j3", stage: "Entrevista", note: "Muy buena 1ª llamada técnica" },
  { candidateId: "s1", jobId: "j1", stage: "Nuevo" },
  { candidateId: "s3", jobId: "j3", stage: "Oferta", note: "Pendiente firma" },
  { candidateId: "s4", jobId: "j2", stage: "Nuevo" },
  { candidateId: "s2", jobId: "j2", stage: "Entrevista" },
];

export const vacancyCandidateLikes: VacancyCandidateLike[] = [
  { candidateId: "s1", jobId: "j1", score: 91, likedAt: "Hoy 10:24", reason: "Figma, marketing y portfolio" },
  { candidateId: "s3", jobId: "j1", score: 84, likedAt: "Ayer 18:10", reason: "Producto, estrategia y comunicación" },
  { candidateId: "s2", jobId: "j2", score: 89, likedAt: "Hoy 09:42", reason: "Python, React base y mentalidad data" },
  { candidateId: "s4", jobId: "j2", score: 87, likedAt: "Ayer 16:05", reason: "React base, Linux y aprendizaje rápido" },
  { candidateId: "s2", jobId: "j3", score: 94, likedAt: "Hoy 11:18", reason: "Python, SQL y foco producto" },
  { candidateId: "s3", jobId: "j3", score: 78, likedAt: "Lun 12:30", reason: "Excel avanzado y visión de negocio" },
  { candidateId: "s3", jobId: "j4", score: 82, likedAt: "Hoy 08:55", reason: "Estrategia, operaciones y sostenibilidad" },
  { candidateId: "s1", jobId: "j4", score: 76, likedAt: "Dom 20:16", reason: "Growth, análisis y ganas de aprender" },
];

export const initialMatches: Match[] = [
  { id: "m1", profileId: "c1", matchedAt: "Hoy", lastMessage: "¡Encantados de conocerte! ¿Tienes 15 min mañana?", unread: true },
  { id: "m2", profileId: "s2", matchedAt: "Ayer", lastMessage: "Te paso mi GitHub 🚀" },
  { id: "m3", profileId: "r1", matchedAt: "Hoy", lastMessage: "Tengo una vacante que te puede encajar.", unread: true },
];

export const initialChats: Record<string, ChatMessage[]> = {
  m1: [
    { id: "1", matchId: "m1", fromMe: false, text: "¡Hola! Vimos tu perfil y nos encaja mucho 🙌", at: "10:12" },
    { id: "2", matchId: "m1", fromMe: true, text: "¡Gracias! Me interesa mucho la beca de UX.", at: "10:14" },
    { id: "3", matchId: "m1", fromMe: false, text: "¡Encantados de conocerte! ¿Tienes 15 min mañana?", at: "10:20" },
  ],
  m2: [
    { id: "1", matchId: "m2", fromMe: false, text: "Vi que también te interesa la analítica 👀", at: "Ayer" },
    { id: "2", matchId: "m2", fromMe: true, text: "¡Sí! ¿Montamos un grupo de estudio?", at: "Ayer" },
    { id: "3", matchId: "m2", fromMe: false, text: "Te paso mi GitHub 🚀", at: "Ayer" },
  ],
  m3: [
    { id: "1", matchId: "m3", fromMe: false, text: "Hola! Soy Carla, recruiter de TalentBridge.", at: "9:02" },
    { id: "2", matchId: "m3", fromMe: false, text: "Tengo una vacante que te puede encajar.", at: "9:03" },
  ],
};

export const groups = [
  { id: "g1", name: "Marketing & Growth", members: 184, emoji: "📈", color: "from-primary to-primary-glow" },
  { id: "g2", name: "Data & IA", members: 312, emoji: "🤖", color: "from-primary to-secondary" },
  { id: "g3", name: "Producto & UX", members: 147, emoji: "🎨", color: "from-secondary to-primary" },
  { id: "g4", name: "Finanzas & Consultoría", members: 209, emoji: "💼", color: "from-primary-glow to-primary" },
  { id: "g5", name: "Sostenibilidad", members: 88, emoji: "🌱", color: "from-primary to-primary-glow" },
  { id: "g6", name: "Ciberseguridad", members: 76, emoji: "🛡️", color: "from-primary to-secondary" },
];
