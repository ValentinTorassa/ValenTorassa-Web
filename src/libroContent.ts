import { siteNav, type Language, type NavItem } from './siteContent';

/**
 * Copy for /libro, the page for the upcoming book and its waitlist.
 *
 * The book is in Spanish, so its title, subtitle and chapter titles are the
 * Spanish originals; the English page translates the chapters for reference.
 * Public copy rules: plain hyphens at most (no em or en dashes), no hype, no
 * exclamation marks, and nothing about publishers, page count, price, dates,
 * ISBN or presale until the owner announces them. The approved sample PDF
 * is 15 pages; that is not the page count of the upcoming book.
 */

/**
 * The waitlist form lives on vtsecurity.com.ar/libro: it has the anti-bot
 * check and counts sign-ups per ?ref=. This page only links to it, with its
 * incoming campaign ref (or web-libro by default), so nothing here posts to
 * the mailing list directly.
 */
export const waitlistUrl = 'https://vtsecurity.com.ar/libro?ref=web-libro';
export const samplePdfUrl = '/libro/muestra-capitulo-1.pdf';

export const book = {
  title: 'No podés defender lo que no entendés',
  subtitle: 'Linux, las abstracciones que fallan y el camino a la ciberseguridad',
};

export const youtubeChannelUrl = 'https://www.youtube.com/@vtcibersecurity';
export const sourceTalkHref = '/charlas/debconf26';

type Chapter = { number?: number; title: string };
type BookPart = { label: string; chapters: Chapter[] };

type LibroContent = {
  documentTitle: string;
  seo: { description: string; locale: 'es_AR' | 'en_US' };
  navItems: NavItem[];
  eyebrow: string;
  /** Shown under the subtitle on the English page only. */
  languageNote?: string;
  lead: string[];
  coverAlt: string;
  waitlistCta: string;
  contentsCta: string;
  sample: {
    eyebrow: string;
    title: string;
    text: string;
    cta: string;
    meta: string;
    optional: string;
    previewAlt: string;
  };
  features: { title: string; items: string[] };
  contents: {
    title: string;
    badge: string;
    note?: string;
    prologue: Chapter & { label: string };
    parts: BookPart[];
    epilogue: Chapter & { label: string };
  };
  audience: { title: string; text: string };
  waitlist: {
    title: string;
    text: string;
    /** Label of the button that opens the form on vtsecurity.com.ar. */
    cta: string;
    privacy: string;
  };
  author: { title: string; text: string; talkLink: string; channelLink: string };
};

export const libroByLanguage: Record<Language, LibroContent> = {
  es: {
    documentTitle: `${book.title} · Valentín Torassa`,
    seo: {
      description:
        'Un libro de Valentín Torassa Colombero sobre Linux, las abstracciones que fallan y el camino a la ciberseguridad. Leé el primer capítulo gratis, sin registro.',
      locale: 'es_AR',
    },
    navItems: siteNav('libro', 'es'),
    eyebrow: 'Libro · en preparación',
    lead: [
      'El tablero está en verde. El servicio responde. El host figura como sano. Y aun así, el sistema no funciona. Pasa cuando una abstracción filtra. Algo que no se ve desde la capa en la que trabajás está fallando más abajo.',
      'Este libro recorre esas capas desde Linux, con comandos probados en Debian, diagramas y ejercicios cuyo resultado podés mostrar. No hace falta memorizar el kernel. Hace falta un mapa de lo que esconde cada abstracción.',
    ],
    coverAlt: `Tapa de ${book.title}: un iceberg con capas, cada una con un objeto`,
    waitlistCta: 'Anotarme en la lista de espera',
    contentsCta: 'Ver el índice',
    sample: {
      eyebrow: 'Capítulo de muestra',
      title: 'Leé el capítulo 1 completo',
      text: '«Toda abstracción filtra»: un tablero en verde, un proceso que muere y una prueba para entender qué se estaba mirando mal. Con el texto, los dibujos y los ejemplos tal como están en el libro.',
      cta: 'Leer el capítulo gratis',
      meta: 'PDF · 15 páginas · sin registro',
      optional: 'La lista del libro es opcional. Podés leer la muestra sin anotarte.',
      previewAlt: 'Página de apertura del capítulo 1, Toda abstracción filtra. Abrir la muestra completa en PDF.',
    },
    features: {
      title: 'Qué vas a encontrar',
      items: [
        'Qué hace el kernel cuando escribís un comando',
        'Quién actúa en tu sistema y con qué permiso',
        'Por qué un contenedor no es una máquina virtual',
        'Cómo mostrar lo que sabés para entrar a la ciberseguridad',
      ],
    },
    contents: {
      title: 'Cómo está armado',
      badge: 'Índice provisorio',
      prologue: { label: 'Prólogo', title: 'Borré mi compu' },
      parts: [
        {
          label: 'Parte I. El mapa',
          chapters: [
            { number: 1, title: 'Toda abstracción filtra' },
            { number: 2, title: 'Del comando al kernel' },
            { number: 3, title: 'Programa, proceso, thread' },
            { number: 4, title: 'Quién actúa, y con qué permiso' },
            { number: 5, title: 'Todo es un archivo' },
            { number: 6, title: 'Arranque, servicios y logs' },
          ],
        },
        {
          label: 'Parte II. Las fugas',
          chapters: [
            { number: 7, title: 'Una request no es magia' },
            { number: 8, title: 'Un contenedor no es una VM' },
            { number: 9, title: 'La nube es la computadora de otro' },
            { number: 10, title: 'Agentes: el mismo problema con otra cara' },
          ],
        },
        {
          label: 'Parte III. La evidencia',
          chapters: [
            { number: 11, title: 'Debian, o el permiso para mirar' },
            { number: 12, title: 'La experiencia se demuestra' },
          ],
        },
      ],
      epilogue: { label: 'Epílogo', title: 'Diseñá para la fuga' },
    },
    audience: {
      title: 'Para quién',
      text: 'Para estudiantes y personas que empiezan en sistemas o ciberseguridad y quieren entender qué pasa debajo de las herramientas que usan. No hace falta experiencia previa con el kernel.',
    },
    waitlist: {
      title: 'Anotate en la lista de espera',
      text: 'Te aviso una sola vez cuando haya fecha, precio y dónde conseguirlo. Para anotarte, dejá tu mail en VT Security, mi blog. Vas a recibir un mail para confirmar.',
      cta: 'Anotarme en VT Security',
      privacy: 'La lista es mía, en un servidor propio. Te podés dar de baja con un clic desde cualquier mail.',
    },
    author: {
      title: 'Sobre el autor',
      text: 'Valentín Torassa Colombero trabaja en ciberseguridad en Rosario y hace VT Security, un canal sobre Linux y seguridad. El libro nace de su charla «Abstraction Leaks» en DebConf26.',
      talkLink: 'La charla y sus slides',
      channelLink: 'Canal de YouTube',
    },
  },
  en: {
    documentTitle: `${book.title} · Valentín Torassa`,
    seo: {
      description:
        'A book in Spanish by Valentín Torassa Colombero about Linux, the abstractions that fail and the road into cybersecurity. Read the first chapter for free, with no signup.',
      locale: 'en_US',
    },
    navItems: siteNav('libro', 'en'),
    eyebrow: 'Book · in progress',
    languageNote: 'The book is in Spanish. In English, the title means “You can’t defend what you don’t understand.”',
    lead: [
      'The dashboard is green. The service responds. The host shows as healthy. And still, the system does not work. That happens when an abstraction leaks. Something you cannot see from the layer you work in is failing further down.',
      'This book walks through those layers from Linux, with commands tested on Debian, diagrams, and exercises whose results you can show. You do not need to memorize the kernel. You need a map of what each abstraction hides.',
    ],
    coverAlt: `Cover of ${book.title}: an iceberg in layers, each one holding an object`,
    waitlistCta: 'Join the waitlist',
    contentsCta: 'See the contents',
    sample: {
      eyebrow: 'Sample chapter · in Spanish',
      title: 'Read the complete first chapter',
      text: '“Toda abstracción filtra”: a green dashboard, a process that dies, and a test to understand what was being overlooked. The text, illustrations and examples are exactly as they appear in the book.',
      cta: 'Read the free chapter',
      meta: 'PDF · 15 pages · no signup',
      optional: 'The book waitlist is optional. You can read the sample without joining.',
      previewAlt: 'Opening page of chapter 1, Toda abstracción filtra. Open the complete sample PDF in Spanish.',
    },
    features: {
      title: 'What you will find',
      items: [
        'What the kernel does when you type a command',
        'Who acts on your system, and with what permission',
        'Why a container is not a virtual machine',
        'How to show what you know to get into cybersecurity',
      ],
    },
    contents: {
      title: 'How it is organized',
      badge: 'Provisional contents',
      note: 'Chapter titles translated from the Spanish.',
      prologue: { label: 'Prologue', title: 'I wiped my computer' },
      parts: [
        {
          label: 'Part I. The map',
          chapters: [
            { number: 1, title: 'Every abstraction leaks' },
            { number: 2, title: 'From the command to the kernel' },
            { number: 3, title: 'Program, process, thread' },
            { number: 4, title: 'Who acts, and with what permission' },
            { number: 5, title: 'Everything is a file' },
            { number: 6, title: 'Boot, services and logs' },
          ],
        },
        {
          label: 'Part II. The leaks',
          chapters: [
            { number: 7, title: 'A request is not magic' },
            { number: 8, title: 'A container is not a VM' },
            { number: 9, title: 'The cloud is someone else’s computer' },
            { number: 10, title: 'Agents: the same problem with a different face' },
          ],
        },
        {
          label: 'Part III. The evidence',
          chapters: [
            { number: 11, title: 'Debian, or permission to look' },
            { number: 12, title: 'Experience is something you show' },
          ],
        },
      ],
      epilogue: { label: 'Epilogue', title: 'Design for the leak' },
    },
    audience: {
      title: 'Who it is for',
      text: 'For students and people starting out in systems or cybersecurity who want to understand what happens beneath the tools they use. No prior experience with the kernel is needed.',
    },
    waitlist: {
      title: 'Join the waitlist',
      text: 'I will write once, when there is a date, a price and a place to get it. To join, leave your email on VT Security, my blog (in Spanish). You will receive an email to confirm first.',
      cta: 'Join on VT Security',
      privacy: 'The list is mine, on my own server. You can unsubscribe with one click from any email.',
    },
    author: {
      title: 'About the author',
      text: 'Valentín Torassa Colombero works in cybersecurity in Rosario and makes VT Security, a channel about Linux and security. The book grew out of his talk “Abstraction Leaks” at DebConf26.',
      talkLink: 'The talk and its slides',
      channelLink: 'YouTube channel',
    },
  },
};
