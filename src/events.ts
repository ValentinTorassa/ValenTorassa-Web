/**
 * Talks, classes and paper presentations: the single source for /eventos and
 * for the home page's speaking panel.
 *
 * To add or edit a talk, change this array only. Order does not matter: pages
 * sort by date, and a talk moves to "past" by itself once its last day is
 * before today in Argentina (America/Argentina/Buenos_Aires).
 *
 * Dates and times are Argentina time (UTC-3). Keep copy factual and use plain
 * hyphens, not em dashes.
 */

export type Localized = { es: string; en: string };

export type TalkMode = 'presencial' | 'virtual';

/**
 * confirmed: date and slot confirmed.
 * tentative: slot offered but not confirmed yet.
 * tbd: confirmed participation, day or time still to be announced.
 * closed: invitation-only audience, not open to the public.
 */
export type TalkStatus = 'confirmed' | 'tentative' | 'tbd' | 'closed';

export type Talk = {
  /** Stable slug, unique in the list. Also used as the anchor on /eventos (#id). */
  id: string;
  /** ISO `YYYY-MM-DD`. For a multi-day slot without a fixed day yet, the first day. */
  date: string;
  /** ISO `YYYY-MM-DD`, last day of a multi-day slot. */
  endDate?: string;
  /**
   * Only for past talks whose exact day is not on record: `date` then holds
   * the first day of that month or year.
   */
  datePrecision?: 'month' | 'year';
  /** Start time `HH:MM`, Argentina time. */
  time?: string;
  /** End time `HH:MM`, Argentina time. */
  endTime?: string;
  /** Event name, e.g. "Ekoparty 2026". Consecutive talks at the same event are grouped. */
  event: string;
  /** Village, track or workshop inside the event. */
  track?: string;
  title: Localized;
  /** Venue or room. Never a street address. */
  place?: Localized;
  city?: string;
  mode?: TalkMode;
  status: TalkStatus;
  /** Official event or talk page. */
  url?: string;
  /** Public slides. The page shows the link from the talk's day on (Argentina time). */
  slidesUrl?: string;
  note?: Localized;
  /** Award or distinction received for the talk. */
  recognition?: Localized;
  /** Keep it in the home page's "previous talks" list once it is past. */
  highlight?: boolean;
};

const ekoparty = 'Ekoparty 2026';
const cec = 'CEC Buenos Aires';

export const talks: Talk[] = [
  // Upcoming
  {
    id: 'uai-clase-invitada-2026-09',
    date: '2026-09-25',
    time: '18:30',
    event: 'UAI',
    title: { es: 'Sistemas operativos Linux', en: 'Linux operating systems' },
    place: { es: 'UAI Rosario', en: 'UAI Rosario' },
    city: 'Rosario',
    mode: 'presencial',
    status: 'closed',
    slidesUrl: 'https://drive.google.com/file/d/1WDZIur1X77AJtnx35nQ93twQf8FNBnwA/view',
    note: {
      es: 'Clase invitada en la cursada de Santiago Roatta.',
      en: "Guest lecture in Santiago Roatta's course.",
    },
  },
  {
    id: 'joven-argentina-fnga-2026',
    date: '2026-09-28',
    time: '20:30',
    event: 'Joven Argentina (FNGA)',
    title: {
      es: 'Ciberseguridad desde la ingeniería',
      en: 'Cybersecurity from an engineering perspective',
    },
    city: 'Rosario',
    mode: 'presencial',
    status: 'closed',
    note: {
      es: 'Sesión compartida con Matías Ocariz, fiscal especializado en cibercrimen.',
      en: 'Joint session with Matías Ocariz, a prosecutor specialized in cybercrime.',
    },
  },
  {
    id: 'hacking-day-2026',
    date: '2026-10-02',
    time: '11:15',
    endTime: '12:00',
    event: 'Hacking Day 2026',
    title: {
      es: 'Firewall para agentes de IA: prompt injection en vivo',
      en: 'Firewall for AI agents: live prompt injection',
    },
    place: { es: 'Auditorio Principal', en: 'Main Auditorium' },
    city: 'Paraná, Entre Ríos',
    mode: 'presencial',
    status: 'confirmed',
    url: 'https://www.hackingday.com.ar/',
    slidesUrl: 'https://drive.google.com/file/d/1ELc0PAu_XoN2Z0rSs594N_mPxt2WtPee/view',
    note: {
      es: 'Charla de 45 minutos sobre permisos, policy enforcement y controles fuera del modelo.',
      en: 'A 45-minute talk on permissions, policy enforcement, and controls outside the model.',
    },
    highlight: true,
  },
  {
    id: 'cacic-2026-podman',
    date: '2026-10-06',
    event: 'CACIC 2026',
    track: 'Workshop de Ingeniería de Software',
    title: {
      es: 'Contribuciones a Proyectos de Software Libre como Estrategia de Formación en Ingeniería de Software: un Marco Metodológico Aplicado al Ecosistema Podman',
      en: 'Contribuciones a Proyectos de Software Libre como Estrategia de Formación en Ingeniería de Software: un Marco Metodológico Aplicado al Ecosistema Podman',
    },
    mode: 'virtual',
    status: 'tbd',
    url: 'https://www.frcu.utn.edu.ar/cacic-2026',
    slidesUrl: 'https://drive.google.com/file/d/1mPDE4FnB6czxPlq86ihIzeVnuskxvRTZ/view',
    note: {
      es: 'Presentación de paper. Los workshops se dan de 14:30 a 19:00.',
      en: 'Paper presentation. Workshops run from 14:30 to 19:00.',
    },
  },
  {
    id: 'ekoparty-2026-owasp-village',
    date: '2026-10-07',
    time: '15:30',
    endTime: '16:15',
    event: ekoparty,
    track: 'OWASP Village',
    title: {
      es: 'Dónde se rompe OAuth cuando el que llama es un agente',
      en: 'Where OAuth breaks when the caller is an agent',
    },
    place: { es: cec, en: cec },
    city: 'Buenos Aires',
    mode: 'presencial',
    status: 'tentative',
  },
  {
    id: 'ekoparty-2026-cyberfinance',
    date: '2026-10-08',
    time: '11:15',
    endTime: '12:00',
    event: ekoparty,
    track: 'CyberFinance',
    title: {
      es: 'Cuando el webhook llega dos veces: estados imposibles en flujos de pago',
      en: 'When the webhook arrives twice: impossible states in payment flows',
    },
    place: { es: `${cec}, Sala E`, en: `${cec}, Room E` },
    city: 'Buenos Aires',
    mode: 'presencial',
    status: 'confirmed',
  },
  {
    id: 'ekoparty-2026-bluespace',
    date: '2026-10-09',
    time: '09:00',
    endTime: '09:45',
    event: ekoparty,
    track: 'BlueSpace (Purple Arena)',
    title: {
      es: 'Logs bajo fuego: leer el rastro de un ataque que está pasando al lado',
      en: 'Logs under fire: reading the trail of an attack happening next door',
    },
    place: { es: `${cec}, Sala D`, en: `${cec}, Room D` },
    city: 'Buenos Aires',
    mode: 'presencial',
    status: 'confirmed',

    slidesUrl: 'https://drive.google.com/file/d/16Bf12aZ-_Yt0zhHgGhPFsEsE5kvaxQI1/view',
  },
  {
    id: 'ekoparty-2026-ai-resilience-hub',
    date: '2026-10-07',
    endDate: '2026-10-09',
    event: ekoparty,
    track: 'AI Resilience Hub',
    title: {
      es: 'Prompt injection en agentes con tools: permisos, aislamiento y auditoría',
      en: 'Prompt injection in tool-using agents: permissions, isolation, and auditing',
    },
    place: { es: cec, en: cec },
    city: 'Buenos Aires',
    mode: 'presencial',
    status: 'tbd',
  },
  {
    id: 'ekoparty-2026-devsecops-space',
    date: '2026-10-09',
    time: '10:30',
    event: ekoparty,
    track: 'DevSecOps Space',
    title: {
      es: 'GitOps: cuando la fuente de verdad también es el riesgo',
      en: 'GitOps: when the source of truth is also the risk',
    },
    place: { es: `${cec}, Sala A3`, en: `${cec}, Room A3` },
    city: 'Buenos Aires',
    mode: 'presencial',
    status: 'confirmed',
    url: 'https://ekodevsecops.space/',
  },
  {
    id: 'jcc-2026',
    date: '2026-10-21',
    time: '18:00',
    event: 'JCC 2026',
    title: {
      es: 'El problema no es el prompt: seguridad real en aplicaciones con IA',
      en: 'The problem is not the prompt: real security in AI applications',
    },
    place: { es: 'FCEIA, UNR', en: 'FCEIA, UNR' },
    city: 'Rosario',
    mode: 'presencial',
    status: 'confirmed',
    url: 'https://jcc.dcc.fceia.unr.edu.ar/2026/',
    note: {
      es: 'Charla invitada en las Jornadas de Ciencias de la Computación: 45 minutos más preguntas.',
      en: 'Invited talk at the Jornadas de Ciencias de la Computación: 45 minutes plus Q&A.',
    },
    highlight: true,
  },

  // Past
  {
    id: 'uai-webinar-2026-08',
    date: '2026-08-19',
    event: 'Webinar UAI',
    track: 'Tecnología Informática',
    title: {
      es: 'Orquestación, workers y arquitectura moderna: cómo diseñar sistemas que escalan',
      en: 'Orchestration, workers, and modern architecture: designing systems that scale',
    },
    mode: 'virtual',
    status: 'confirmed',
    note: {
      es: 'Webinar técnico sobre sistemas distribuidos, workers y decisiones de arquitectura.',
      en: 'Technical webinar on distributed systems, workers, and architectural decisions.',
    },
    highlight: true,
  },
  {
    id: 'debconf26',
    date: '2026-07-24',
    event: 'DebConf26',
    title: {
      es: 'Abstraction Leaks: Why Understanding Linux Internals Still Matters',
      en: 'Abstraction Leaks: Why Understanding Linux Internals Still Matters',
    },
    city: 'Santa Fe',
    mode: 'presencial',
    status: 'confirmed',
    url: 'https://debconf26.debconf.org/talks/75-abstraction-leaks-why-understanding-linux-internals-still-matters/',
    note: {
      es: 'Por qué comprender kernel, procesos, memoria y redes sigue siendo esencial detrás de las abstracciones modernas.',
      en: 'Why understanding kernels, processes, memory, and networking still matters behind modern abstractions.',
    },
    highlight: true,
  },
  {
    id: 'vincular-inteligente-2026',
    date: '2026-05-22',
    event: 'Vincular Inteligente 2026',
    title: {
      es: 'Seguridad con IA: monitoreo inteligente y respuesta temprana',
      en: 'Security with AI: intelligent monitoring and early response',
    },
    status: 'confirmed',
    url: 'https://vincular-inteligente-2026.vercel.app/',
    note: {
      es: 'Monitoreo inteligente, respuesta temprana y automatización aplicada a defensa.',
      en: 'Intelligent monitoring, early response, and automation applied to defensive security.',
    },
    highlight: true,
  },
  {
    id: 'cybersectuc-meetup-3',
    date: '2026-05-01',
    datePrecision: 'month',
    event: 'CyberSecTuc Meetup #3',
    title: {
      es: 'La realidad de un Ingeniero en Ciberseguridad',
      en: 'The reality of working as a Cybersecurity Engineer',
    },
    status: 'confirmed',
    note: {
      es: 'Charla sobre carrera, criterio técnico y trabajo práctico en seguridad.',
      en: 'A practical talk about career development, technical judgment, and security work.',
    },
    highlight: true,
  },
  {
    id: 'cacic-2024',
    date: '2024-10-01',
    datePrecision: 'month',
    event: 'CACIC 2024',
    title: {
      es: 'Análisis y Desarrollo de Herramientas de Reverse Shell para Pruebas de Penetración',
      en: 'Análisis y Desarrollo de Herramientas de Reverse Shell para Pruebas de Penetración',
    },
    status: 'confirmed',
    note: {
      es: 'Reverse shells aplicadas a pruebas de penetración y análisis ofensivo.',
      en: 'Reverse shells applied to penetration testing and offensive analysis.',
    },
    recognition: {
      es: 'Expositor Distinguido en Seguridad Informática',
      en: 'Distinguished Speaker in Information Security',
    },
    highlight: true,
  },
  {
    id: 'sacs-jaiio-2024',
    date: '2024-01-01',
    datePrecision: 'year',
    event: 'SACS / 53 JAIIO 2024',
    title: {
      es: 'Botnets: estado del arte y taxonomía de una amenaza sigilosa',
      en: 'Botnets: estado del arte y taxonomía de una amenaza sigilosa',
    },
    status: 'confirmed',
    note: {
      es: 'Investigación sobre botnets, comportamiento distribuido y taxonomía de amenazas.',
      en: 'Research on botnets, distributed behavior, and threat taxonomy.',
    },
    recognition: { es: 'Mejor Exposición', en: 'Best Presentation' },
    highlight: true,
  },
];
