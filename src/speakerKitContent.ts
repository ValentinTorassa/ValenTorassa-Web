import type { TalkMode } from './events';
import { siteNav, type Language, type NavItem } from './siteContent';

/**
 * Copy for /speaker-kit, the page for event organizers.
 *
 * Facts follow the home page and VT-Knowledge-Engine-Brain (cv/cv-facts.md):
 * no invented titles, awards, numbers or dates. Until December 2026 the degree
 * is in progress ("último año" / "final year"). Plain hyphens, no em dashes.
 *
 * The talks themselves are not copied here: each topic lists talk ids from
 * src/events.ts, and the page reads titles, events and dates from there.
 */

export type TopicId = 'agents' | 'linux' | 'backend' | 'detection' | 'devsecops' | 'career';

/** The talks in src/events.ts that back each topic, by id. */
export const topicTalkIds: Record<TopicId, string[]> = {
  agents: ['hacking-day-2026', 'ekoparty-2026-ai-resilience-hub', 'ekoparty-2026-owasp-village', 'jcc-2026'],
  linux: ['debconf26', 'uai-clase-invitada-2026-09'],
  backend: ['uai-webinar-2026-08', 'ekoparty-2026-cyberfinance'],
  detection: ['ekoparty-2026-bluespace', 'vincular-inteligente-2026'],
  devsecops: ['ekoparty-2026-devsecops-space', 'cacic-2026-ubuntu', 'cacic-2026-podman'],
  career: ['cybersectuc-meetup-3', 'joven-argentina-fnga-2026'],
};

export const topicOrder: TopicId[] = ['agents', 'linux', 'backend', 'detection', 'devsecops', 'career'];

export type InviteFormat = 'talk' | 'demo' | 'class' | 'webinar' | 'shared' | 'other';
export type InviteDuration = '20' | '30' | '45' | '60' | 'tbd';

export const inviteFormats: InviteFormat[] = ['talk', 'demo', 'class', 'webinar', 'shared', 'other'];
export const inviteDurations: InviteDuration[] = ['20', '30', '45', '60', 'tbd'];
export const inviteModes: TalkMode[] = ['presencial', 'virtual'];

type SpeakerKitContent = {
  documentTitle: string;
  seo: { description: string; locale: 'es_AR' | 'en_US' };
  navItems: NavItem[];
  eyebrow: string;
  title: string;
  intro: string;
  inviteCta: string;
  jumpLabel: string;
  jump: Record<'bio' | 'temas' | 'charlas' | 'datos' | 'invitar', string>;
  photo: { alt: string; download: string; caption: string };
  bio: {
    eyebrow: string;
    title: string;
    intro: string;
    shortLabel: string;
    longLabel: string;
    short: string;
    long: string[];
    words: (count: number) => string;
    copy: string;
    copied: string;
    otherLanguage: string;
    program: { title: string; role: string; place: string; profiles: string };
  };
  topics: {
    eyebrow: string;
    title: string;
    intro: string;
    talksLabel: string;
    items: Record<TopicId, { title: string; text: string }>;
  };
  talks: {
    eyebrow: string;
    title: string;
    intro: string;
    upcomingTitle: string;
    pastTitle: string;
    emptyUpcoming: string;
    papers: (count: number) => string;
    hubLink: string;
    agendaLink: string;
  };
  practical: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{ key: string; label: string; text: string }>;
  };
  invite: {
    eyebrow: string;
    title: string;
    intro: string;
    fields: {
      event: string;
      eventPlaceholder: string;
      eventUrl: string;
      date: string;
      city: string;
      mode: string;
      format: string;
      duration: string;
      topic: string;
      audience: string;
      audiencePlaceholder: string;
      name: string;
      email: string;
      org: string;
      orgPlaceholder: string;
      message: string;
      messagePlaceholder: string;
    };
    formats: Record<InviteFormat, string>;
    durations: Record<InviteDuration, string>;
    otherTopic: string;
    requiredNote: string;
    submit: string;
    draftTitle: string;
    draftLead: string;
    openMail: string;
    copyDraft: string;
    copiedDraft: string;
    fallbackBefore: string;
    fallbackAfter: string;
    privacy: string;
    mail: {
      subject: (event: string, date: string) => string;
      greeting: string;
      opening: string;
      labels: Record<'event' | 'site' | 'date' | 'place' | 'format' | 'duration' | 'topic' | 'audience' | 'contact' | 'email' | 'org' | 'message', string>;
      closing: string;
    };
  };
};

export const speakerKitByLanguage: Record<Language, SpeakerKitContent> = {
  es: {
    documentTitle: 'Kit para organizadores · Valentín Torassa',
    seo: {
      description: 'Bio, foto, temas, charlas anteriores y datos prácticos para invitar a Valentín Torassa Colombero a dar una charla en tu evento.',
      locale: 'es_AR',
    },
    navItems: siteNav('speaker-kit', 'es'),
    eyebrow: '// speaker kit',
    title: 'Kit para organizadores',
    intro: 'Lo que suele pedir un evento antes de confirmar una charla: bio, foto, temas, charlas anteriores y datos prácticos. Si querés invitarme, el formulario del final arma el mail por vos.',
    inviteCta: 'Invitarme a tu evento',
    jumpLabel: 'En esta página',
    jump: { bio: 'Bio', temas: 'Temas', charlas: 'Charlas', datos: 'Datos prácticos', invitar: 'Invitación' },
    photo: {
      alt: 'Retrato de Valentín Torassa Colombero',
      download: 'Descargar foto',
      caption: 'PNG, 720 × 720 px. Para la difusión de tu evento.',
    },
    bio: {
      eyebrow: '// bio',
      title: 'Bio para el programa',
      intro: 'En tercera persona y lista para pegar: una corta y una larga.',
      shortLabel: 'Bio corta',
      longLabel: 'Bio larga',
      short:
        'Valentín Torassa Colombero es Cybersecurity Engineer & Software Architect en Teramot, donde lidera la estrategia técnica de ciberseguridad y compliance y es arquitecto principal de Aleph, un backend en Go que da a agentes de IA acceso seguro a datos empresariales. Cursa el último año de Ingeniería en Sistemas Informáticos en la Universidad Abierta Interamericana (UAI) y creó VT Security, un canal en español sobre ciberseguridad, Linux y sistemas.',
      long: [
        'Valentín Torassa Colombero vive en Rosario, Argentina, y trabaja como Cybersecurity Engineer & Software Architect en Teramot. Lidera la estrategia técnica de ciberseguridad y compliance de la empresa y un equipo de cuatro personas entre seguridad y backend. Coordinó la auditoría SOC 2 de Teramot, del Tipo 1 al informe final del Tipo 2, y lleva los controles de SOC 2 e ISO/IEC 27001 a la infraestructura y al producto. Es arquitecto principal de Aleph, un backend en Go que da a agentes de IA acceso seguro a archivos, bases de datos y APIs.',
        'Antes fue analista de ciberseguridad en Consulting IT y ayudante de cátedra de Arquitectura de Computadoras II en la Universidad Abierta Interamericana (UAI), donde cursa el último año de Ingeniería en Sistemas Informáticos. Tiene las certificaciones CompTIA Security+, AWS Certified Cloud Practitioner, LFCA y Huawei HCIA Datacom, y es AWS Community Builder.',
        'Presentó investigación sobre botnets, reverse shells, seguridad en redes WiFi y servidores SCADA en JAIIO, CACIC y WICC. Lo distinguieron con la Mejor Exposición en SACS (53 JAIIO, 2024) y como Expositor Distinguido en Seguridad Informática en CACIC 2024. En DebConf26 habló de por qué entender Linux por dentro sigue importando. Creó VT Security, un canal en español sobre ciberseguridad, Linux, cloud y sistemas.',
      ],
      words: (count) => `${count} palabras`,
      copy: 'Copiar',
      copied: 'Copiada',
      otherLanguage: 'Ver la bio en inglés',
      program: {
        title: 'Para el programa',
        role: 'Cybersecurity Engineer & Software Architect · Teramot',
        place: 'Rosario, Argentina',
        profiles: 'Perfiles para mencionar',
      },
    },
    topics: {
      eyebrow: '// temas',
      title: 'De qué puedo hablar',
      intro: 'Temas sobre los que ya di o tengo confirmadas charlas. Cada uno enlaza sus charlas en valentorassa.com/charlas.',
      talksLabel: 'Charlas',
      items: {
        agents: {
          title: 'Seguridad en agentes de IA',
          text: 'Prompt injection, permisos, OAuth cuando el que llama es un agente y controles que viven fuera del modelo.',
        },
        linux: {
          title: 'Linux por dentro',
          text: 'Kernel, procesos, memoria y redes: lo que sigue importando detrás de las abstracciones.',
        },
        backend: {
          title: 'Arquitectura backend',
          text: 'Orquestación, workers y sistemas distribuidos, y los estados imposibles que aparecen cuando un webhook llega dos veces.',
        },
        detection: {
          title: 'Detección y respuesta',
          text: 'Leer logs mientras pasa un ataque, monitoreo y respuesta temprana.',
        },
        devsecops: {
          title: 'DevSecOps y software libre',
          text: 'GitOps como riesgo, parches de seguridad comunitarios en Ubuntu y contribuciones a Podman.',
        },
        career: {
          title: 'Carrera en ciberseguridad',
          text: 'Cómo es el trabajo en seguridad por dentro, y charlas de seguridad para público no técnico.',
        },
      },
    },
    talks: {
      eyebrow: '// charlas',
      title: 'Charlas anteriores y próximas',
      intro: 'Dónde hablé y dónde voy a hablar, con link a cada charla.',
      upcomingTitle: 'Próximas',
      pastTitle: 'Anteriores',
      emptyUpcoming: 'No hay charlas anunciadas por ahora.',
      papers: (count) => `Además, ${count} papers y pósters publicados.`,
      hubLink: 'Ver charlas, slides y papers',
      agendaLink: 'Ver la agenda',
    },
    practical: {
      eyebrow: '// datos',
      title: 'Datos prácticos',
      intro: 'Lo que suelen preguntarme antes de cerrar una fecha.',
      items: [
        { key: 'formats', label: 'Formatos', text: 'Charla técnica, con o sin demo en vivo, clase invitada, webinar o sesión compartida con otra persona.' },
        { key: 'mode', label: 'Modalidad', text: 'Presencial o virtual. Vivo en Rosario, Argentina (UTC-3).' },
        { key: 'length', label: 'Duración', text: 'Entre 20 y 60 minutos. Lo más habitual es 45 minutos con preguntas.' },
        { key: 'language', label: 'Idioma', text: 'Español.' },
        { key: 'audience', label: 'Público', text: 'Conferencias de seguridad, congresos académicos, comunidades técnicas y universidades. También doy charlas para público no técnico.' },
        { key: 'tech', label: 'Equipo técnico', text: 'Una pantalla o proyector con entrada HDMI. Llevo las slides offline y un PDF de respaldo, así que no dependo del wifi. Si hay demo en vivo, también llevo una grabación por si falla.' },
        { key: 'online', label: 'Eventos virtuales', text: 'Me conecto desde la plataforma del evento. Si hace falta, mando antes un video de respaldo.' },
        { key: 'slides', label: 'Slides', text: 'Quedan públicas en la página de cada charla desde el día que la doy.' },
      ],
    },
    invite: {
      eyebrow: '// invitación',
      title: 'Invitarme a tu evento',
      intro: 'Completá los datos y se arma un mail con lo que necesito para responderte. No se envía nada desde este sitio: el mail sale desde tu correo.',
      fields: {
        event: 'Evento',
        eventPlaceholder: 'Nombre del evento',
        eventUrl: 'Sitio del evento',
        date: 'Fecha',
        city: 'Ciudad',
        mode: 'Modalidad',
        format: 'Formato',
        duration: 'Duración',
        topic: 'Tema',
        audience: 'Público',
        audiencePlaceholder: 'Quiénes van y cuántas personas, más o menos',
        name: 'Tu nombre',
        email: 'Tu email',
        org: 'Organización',
        orgPlaceholder: 'Universidad, comunidad, empresa',
        message: 'Mensaje',
        messagePlaceholder: 'Lo que quieras agregar: horario, otras charlas, preguntas',
      },
      formats: {
        talk: 'Charla',
        demo: 'Charla con demo en vivo',
        class: 'Clase invitada',
        webinar: 'Webinar',
        shared: 'Sesión compartida o panel',
        other: 'Otro (contalo en el mensaje)',
      },
      durations: { '20': '20 minutos', '30': '30 minutos', '45': '45 minutos', '60': '60 minutos', tbd: 'A definir' },
      otherTopic: 'Otro o a definir',
      requiredNote: 'Los campos con * son obligatorios.',
      submit: 'Armar el mail',
      draftTitle: 'Tu pedido',
      draftLead: 'Revisalo y mandalo desde tu correo.',
      openMail: 'Abrir en tu correo',
      copyDraft: 'Copiar el texto',
      copiedDraft: 'Copiado',
      fallbackBefore: 'Si no se abre tu correo, copiá el texto y mandalo a',
      fallbackAfter: '.',
      privacy: 'El formulario no guarda ni envía datos: el mail se arma en tu navegador.',
      mail: {
        subject: (event, date) => `Invitación a dar una charla: ${event}${date ? ` (${date})` : ''}`,
        greeting: 'Hola, Valentín:',
        opening: 'Te escribo para invitarte a dar una charla.',
        labels: {
          event: 'Evento',
          site: 'Sitio',
          date: 'Fecha',
          place: 'Lugar',
          format: 'Formato',
          duration: 'Duración',
          topic: 'Tema',
          audience: 'Público',
          contact: 'Contacto',
          email: 'Email',
          org: 'Organización',
          message: 'Mensaje',
        },
        closing: 'Saludos,',
      },
    },
  },
  en: {
    documentTitle: 'Speaker kit · Valentín Torassa',
    seo: {
      description: 'Bio, headshot, topics, past talks, and practical details for inviting Valentín Torassa Colombero to speak at your event.',
      locale: 'en_US',
    },
    navItems: siteNav('speaker-kit', 'en'),
    eyebrow: '// speaker kit',
    title: 'Speaker kit',
    intro: 'What an event usually asks for before confirming a talk: bio, headshot, topics, past talks, and the practical details. To invite me, the form at the end drafts the email for you.',
    inviteCta: 'Invite me to your event',
    jumpLabel: 'On this page',
    jump: { bio: 'Bio', temas: 'Topics', charlas: 'Talks', datos: 'Practical details', invitar: 'Invitation' },
    photo: {
      alt: 'Headshot of Valentín Torassa Colombero',
      download: 'Download headshot',
      caption: 'PNG, 720 × 720 px, for promoting your event.',
    },
    bio: {
      eyebrow: '// bio',
      title: 'Bio for the program',
      intro: 'Third person and ready to paste: one short, one long.',
      shortLabel: 'Short bio',
      longLabel: 'Long bio',
      short:
        'Valentín Torassa Colombero is a Cybersecurity Engineer & Software Architect at Teramot, where he leads the technical cybersecurity and compliance strategy and is the principal architect of Aleph, a Go backend that gives AI agents secure access to enterprise data. He is in the final year of Information Systems Engineering at Universidad Abierta Interamericana (UAI) and created VT Security, a Spanish-language channel on cybersecurity, Linux, and systems.',
      long: [
        'Valentín Torassa Colombero is based in Rosario, Argentina, and works as a Cybersecurity Engineer & Software Architect at Teramot. He leads the company’s technical cybersecurity and compliance strategy and a team of four across security and backend work. He coordinated Teramot’s SOC 2 audit, from the Type 1 to the final Type 2 report, and embeds SOC 2 and ISO/IEC 27001 controls into infrastructure and product. He is the principal architect of Aleph, a Go backend that gives AI agents secure access to files, databases, and APIs.',
        'He previously worked as a Cybersecurity Analyst at Consulting IT and as a Teaching Assistant for Computer Architecture II at Universidad Abierta Interamericana (UAI), where he is in the final year of Information Systems Engineering. He holds the CompTIA Security+, AWS Certified Cloud Practitioner, LFCA, and Huawei HCIA Datacom certifications, and is an AWS Community Builder.',
        'He has presented research on botnets, reverse shells, WiFi network security, and SCADA servers at JAIIO, CACIC, and WICC, and was recognized with Best Presentation at SACS (53 JAIIO, 2024) and as Distinguished Speaker in Information Security at CACIC 2024. At DebConf26 he spoke about why understanding Linux internals still matters. He created VT Security, a Spanish-language channel on cybersecurity, Linux, cloud, and systems.',
      ],
      words: (count) => `${count} words`,
      copy: 'Copy',
      copied: 'Copied',
      otherLanguage: 'See the bio in Spanish',
      program: {
        title: 'For the program',
        role: 'Cybersecurity Engineer & Software Architect · Teramot',
        place: 'Rosario, Argentina',
        profiles: 'Profiles to tag',
      },
    },
    topics: {
      eyebrow: '// topics',
      title: 'What I talk about',
      intro: 'Topics I have given or have confirmed talks on. Each one links to its talks on valentorassa.com/charlas.',
      talksLabel: 'Talks',
      items: {
        agents: {
          title: 'AI agent security',
          text: 'Prompt injection, permissions, OAuth when the caller is an agent, and controls that live outside the model.',
        },
        linux: {
          title: 'Linux internals',
          text: 'Kernels, processes, memory, and networking: what still matters behind modern abstractions.',
        },
        backend: {
          title: 'Backend architecture',
          text: 'Orchestration, workers, and distributed systems, and the impossible states that appear when a webhook arrives twice.',
        },
        detection: {
          title: 'Detection and response',
          text: 'Reading logs while an attack is happening, monitoring, and early response.',
        },
        devsecops: {
          title: 'DevSecOps and open source',
          text: 'GitOps as a risk, community security patches in Ubuntu, and contributing to Podman.',
        },
        career: {
          title: 'Careers in cybersecurity',
          text: 'What security work looks like from the inside, and security talks for non-technical audiences.',
        },
      },
    },
    talks: {
      eyebrow: '// talks',
      title: 'Past and upcoming talks',
      intro: 'Where I have spoken and where I will speak next, with a link to each talk.',
      upcomingTitle: 'Upcoming',
      pastTitle: 'Past',
      emptyUpcoming: 'No talks announced right now.',
      papers: (count) => `Plus ${count} published papers and posters.`,
      hubLink: 'Browse talks, slides, and papers',
      agendaLink: 'See the events page',
    },
    practical: {
      eyebrow: '// details',
      title: 'Practical details',
      intro: 'What organizers usually ask before locking in a date.',
      items: [
        { key: 'formats', label: 'Formats', text: 'Technical talk, with or without a live demo, guest lecture, webinar, or a shared session with another speaker.' },
        { key: 'mode', label: 'In person or online', text: 'Both. Based in Rosario, Argentina (UTC-3).' },
        { key: 'length', label: 'Length', text: 'Between 20 and 60 minutes. The usual slot is 45 minutes with Q&A.' },
        { key: 'language', label: 'Language', text: 'Spanish.' },
        { key: 'audience', label: 'Audience', text: 'Security conferences, academic congresses, tech communities, and universities. I also give talks for non-technical audiences.' },
        { key: 'tech', label: 'Tech needs', text: 'A screen or projector with an HDMI input. I bring the slides offline plus a backup PDF, so I do not depend on the venue Wi-Fi. For a live demo I also bring a recording in case it fails.' },
        { key: 'online', label: 'Online events', text: 'I join through the event platform. If needed, I send a backup video ahead of time.' },
        { key: 'slides', label: 'Slides', text: 'Each talk’s slides go public on its page from the day I give it.' },
      ],
    },
    invite: {
      eyebrow: '// invitation',
      title: 'Invite me to your event',
      intro: 'Fill in the details and the page drafts an email with what I need to reply. Nothing is sent from this site: the email goes out from your own mail app.',
      fields: {
        event: 'Event',
        eventPlaceholder: 'Event name',
        eventUrl: 'Event website',
        date: 'Date',
        city: 'City',
        mode: 'In person or online',
        format: 'Format',
        duration: 'Length',
        topic: 'Topic',
        audience: 'Audience',
        audiencePlaceholder: 'Who attends and roughly how many people',
        name: 'Your name',
        email: 'Your email',
        org: 'Organization',
        orgPlaceholder: 'University, community, company',
        message: 'Message',
        messagePlaceholder: 'Anything else: time slot, other talks, questions',
      },
      formats: {
        talk: 'Talk',
        demo: 'Talk with a live demo',
        class: 'Guest lecture',
        webinar: 'Webinar',
        shared: 'Shared session or panel',
        other: 'Other (tell me in the message)',
      },
      durations: { '20': '20 minutes', '30': '30 minutes', '45': '45 minutes', '60': '60 minutes', tbd: 'To be decided' },
      otherTopic: 'Other or to be decided',
      requiredNote: 'Fields marked * are required.',
      submit: 'Draft the email',
      draftTitle: 'Your request',
      draftLead: 'Review it and send it from your mail app.',
      openMail: 'Open in your mail app',
      copyDraft: 'Copy the text',
      copiedDraft: 'Copied',
      fallbackBefore: 'If your mail app does not open, copy the text and send it to',
      fallbackAfter: '.',
      privacy: 'The form stores and sends nothing: the email is drafted in your browser.',
      mail: {
        subject: (event, date) => `Speaking invitation: ${event}${date ? ` (${date})` : ''}`,
        greeting: 'Hi Valentín,',
        opening: 'I am writing to invite you to speak at our event.',
        labels: {
          event: 'Event',
          site: 'Website',
          date: 'Date',
          place: 'Place',
          format: 'Format',
          duration: 'Length',
          topic: 'Topic',
          audience: 'Audience',
          contact: 'Contact',
          email: 'Email',
          org: 'Organization',
          message: 'Message',
        },
        closing: 'Best,',
      },
    },
  },
};
