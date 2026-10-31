import type { IconType } from 'react-icons';
import { FaAws } from 'react-icons/fa6';
import {
  SiAstro,
  SiComptia,
  SiDocker,
  SiGo,
  SiHuawei,
  SiJsonwebtokens,
  SiLinux,
  SiLinuxfoundation,
  SiMikrotik,
  SiNatsdotio,
  SiOpenapiinitiative,
  SiOpenid,
  SiPostgresql,
  SiRedis,
  SiTerraform,
  SiWireguard,
} from 'react-icons/si';
import consultingItLogo from './assets/companies/consulting-it.png';
import teramotLogo from './assets/companies/teramot.png';
import uaiLogo from './assets/companies/uai.png';
import uaiCrest from './assets/companies/uai-crest.png';
// Project previews: live pages captured in dark mode at 1280×800, except
// VT-Lens (the app's own screenshot, synthetic data), Ragnaros (a photo of the
// device) and the firewall (the last frame of the repo's demo GIF).
import openSecurityLabsPreview from './assets/projects/open-security-labs.webp';
import lensScreenshot from './assets/projects/vt-lens.webp';
import plumaScreenshot from './assets/projects/pluma.webp';
import ragnarosPhoto from './assets/projects/ragnaros-device.jpg';
import secretShareScreenshot from './assets/projects/secretshare.webp';
import securityFixesScreenshot from './assets/projects/security-fixes.webp';
import radarAudienceScreenshot from './assets/projects/vt-radar-audience-demo.webp';
import agentFirewallDemo from './assets/projects/agent-firewall.webp';
import comandleScreenshot from './assets/projects/comandle.webp';
import quartermasterScreenshot from './assets/projects/quartermaster.webp';
import archivistScreenshot from './assets/projects/archivist.webp';
import tidbitScreenshot from './assets/projects/tidbit.webp';

import { siteChromeByLanguage, siteNav, type HeaderLabels, type Language, type NavItem } from './siteContent';

export type StackTag = string | {
  label: string;
  icon?: IconType;
};

export type FeaturedRepo = {
  name: string;
  href: string;
  description: string;
  language: string;
  languageColor: string;
  stage: string;
  proof: string;
  tags: StackTag[];
  tone: string;
  featured?: boolean;
  previewImage?: string;
  previewKind?: 'screenshot' | 'photo';
  previewAlt?: string;
  previewAddress?: string;
  previewDarkAdapt?: boolean;
  previewCrop?: 'top' | 'bottom';
  previewSize?: { width: number; height: number };
  siteHref?: string;
  caseStudy: {
    problem: string;
    architecture: string;
    security: string;
  };
};

/**
 * Work presented without a public repository or product URL. Its preview may
 * use a screenshot whose displayed metrics were replaced with synthetic data.
 */
export type PrivateProject = Omit<
  FeaturedRepo,
  'href' | 'featured' | 'siteHref'
>;

type PageContent = {
  documentTitle: string;
  seo: {
    description: string;
    locale: 'es_AR' | 'en_US';
  };
  header: HeaderLabels;
  navItems: NavItem[];
  heroEyebrow: string;
  /** Small tag and text of the announcement above the name, linking to /libro. */
  heroBookTag: string;
  heroBookLabel: string;
  heroStatement: string;
  heroSocialLabel: string;
  heroProjectsLabel: string;
  heroBlogLabel: string;
  heroContactLabel: string;
  terminalLines: Array<{ prompt: string; command: string; output: string }>;
  profile: {
    eyebrow: string;
    title: string;
    intro: string;
    statement: string;
    facts: Array<{ key: string; title: string; text: string }>;
  };
  experience: {
    eyebrow: string;
    title: string;
    items: Array<{
      role: string;
      company: string;
      period: string;
      description: string;
      tags: StackTag[];
      logo: string;
      logoMode: 'symbol' | 'wordmark' | 'institution';
      hideCompanyLabel?: boolean;
      /** Public writing about this role, shown under the description. */
      writing?: { label: string; links: Array<{ label: string; href: string }> };
    }>;
  };
  education: {
    eyebrow: string;
    title: string;
    academicTitle: string;
    certificationsTitle: string;
    institutionLogo: string;
    items: Array<{ title: string; place: string; period: string; status: string }>;
    certifications: Array<{
      name: string;
      detail: string;
      focus: string;
      icon: IconType;
      tone: string;
    }>;
    /** A community programme, shown under the certifications: it is not one. */
    community: { label: string; name: string; text: string; href: string };
  };
  stack: {
    eyebrow: string;
    title: string;
    intro: string;
    groups: Array<{
      title: string;
      text: string;
      tags: StackTag[];
      tone: string;
    }>;
  };
  research: {
    eyebrow: string;
    title: string;
    talksEyebrow: string;
    talksTitle: string;
    talksIntro: string;
    speakingTitle: string;
    repositoriesTitle: string;
    featuredLabel: string;
    upcomingTalksLabel: string;
    previousTalksLabel: string;
    nextTalkLabel: string;
    allTalksLabel: string;
    hubLabel: string;
    /** Link to /speaker-kit, the page for event organizers. */
    speakerKitLabel: string;
    /** Link to /libro, the upcoming book and its waitlist. */
    bookLabel: string;
    openTalkLabel: string;
    openProjectLabel: string;
    openRepoLabel: string;
    proofLabel: string;
    additionalLabel: string;
    contributionLabel: string;
    contributionProof: string;
    developerSetupLabel: string;
    githubProfileLabel: string;
    projectDetailsLabel: string;
    closeProjectLabel: string;
    problemLabel: string;
    architectureLabel: string;
    securityLabel: string;
    visitProjectLabel: string;
    repos: FeaturedRepo[];
    /** Heading over the private-work cards, below the open-source grid. */
    privateWorkLabel: string;
    /** Shown where a public card links its repository. */
    privateCodeLabel: string;
    privateProjects: PrivateProject[];
    /** Legios, the open source studio with Sol Soletti, below the featured grid. */
    legios: {
      label: string;
      intro: string;
      links: Array<{ label: string; href: string }>;
      projects: Array<{ name: string; href: string; repo: string; image: string; alt: string; text: string }>;
    };
    /** Extra rows in "More work", after the Podman contribution and the developer setup. */
    moreWork: Array<{ label: string; text: string; links: Array<{ label: string; href: string }> }>;
  };
  contact: {
    eyebrow: string;
    title: string;
    text: string;
    emailLabel: string;
    copyEmailLabel: string;
    copiedEmailLabel: string;
    socialLabel: string;
    youtubeLabel: string;
    timezone: string;
    availability: string;
  };
  footer: {
    tagline: string;
    backToTopLabel: string;
    location: string;
  };
};

const cloudTags: StackTag[] = [
  { label: 'ECS/Fargate', icon: FaAws },
  { label: 'IAM', icon: FaAws },
  { label: 'SSO Admin', icon: FaAws },
  { label: 'Secrets Manager', icon: FaAws },
  { label: 'CloudTrail', icon: FaAws },
  { label: 'GuardDuty', icon: FaAws },
  { label: 'VPC', icon: FaAws },
  { label: 'Terraform', icon: SiTerraform },
];

const complianceTags: StackTag[] = [
  'SOC 2 Type II',
  'ISO/IEC 27001',
  'ISMS/SGSI',
  'Audit Evidence',
  { label: 'OIDC', icon: SiOpenid },
  { label: 'Secrets Handling', icon: FaAws },
];

const backendTags: StackTag[] = [
  { label: 'Go', icon: SiGo },
  { label: 'chi', icon: SiGo },
  { label: 'AWS SDK v2', icon: FaAws },
  { label: 'NATS', icon: SiNatsdotio },
  { label: 'pgx', icon: SiPostgresql },
  'Atlas',
  { label: 'JWT/JWKS', icon: SiJsonwebtokens },
  { label: 'OpenAPI', icon: SiOpenapiinitiative },
];

const systemsTags: StackTag[] = [
  { label: 'Linux', icon: SiLinux },
  'TCP/IP',
  { label: 'WireGuard', icon: SiWireguard },
  { label: 'MikroTik', icon: SiMikrotik },
  'Sophos',
  'Nagios',
  { label: 'Docker', icon: SiDocker },
];

const repoFacts = {
  openSecurityLabs: {
    name: 'Open-Security-Labs',
    href: 'https://github.com/ValentinTorassa/Open-Security-Labs',
    language: 'Astro',
    languageColor: '#ff7a45',
    tags: [{ label: 'Astro', icon: SiAstro }, 'Linux', 'Networking', 'Security'],
    tone: 'learning',
    featured: true,
    previewImage: openSecurityLabsPreview,
    previewKind: 'screenshot' as const,
    previewAddress: 'securitylabs.valentorassa.com',
    siteHref: 'https://securitylabs.valentorassa.com',
  },
  securityFixes: {
    name: 'VT-Security-Fixes',
    href: 'https://github.com/ValentinTorassa/VT-Security-Fixes',
    language: 'Shell',
    languageColor: '#89e051',
    tags: ['DEP-3', 'Ubuntu', 'CVE', 'Patch provenance'],
    tone: 'security',
    previewImage: securityFixesScreenshot,
    previewKind: 'screenshot' as const,
    previewAddress: 'github.com/ValentinTorassa/VT-Security-Fixes',
  },
  secretShare: {
    name: 'VT-SecretShare',
    href: 'https://github.com/ValentinTorassa/VT-SecretShare',
    language: 'Go',
    languageColor: '#00add8',
    tags: [{ label: 'Go', icon: SiGo }, { label: 'Redis', icon: SiRedis }, 'WebCrypto', 'One-time links'],
    tone: 'security',
    siteHref: 'https://secretshare.valentorassa.com',
    previewImage: secretShareScreenshot,
    previewKind: 'screenshot' as const,
    previewAddress: 'secretshare.valentorassa.com',
  },
  pluma: {
    name: 'pluma',
    href: 'https://github.com/ValentinTorassa/pluma',
    language: 'TypeScript',
    languageColor: '#3178c6',
    tags: ['Next.js', 'TypeScript', 'Turso', 'Publishing API'],
    tone: 'product',
    siteHref: 'https://vtsecurity.com.ar',
    previewImage: plumaScreenshot,
    previewKind: 'screenshot' as const,
    previewAddress: 'vtsecurity.com.ar',
  },
  ragnaros: {
    name: 'VT-Ragnaros',
    href: 'https://github.com/ValentinTorassa/VT-Ragnaros',
    language: 'Python',
    languageColor: '#f7c95a',
    tags: ['Linux', 'USB', 'libusb', 'systemd'],
    tone: 'systems',
    previewImage: ragnarosPhoto,
    previewKind: 'photo' as const,
    previewAddress: 'VT-Ragnaros / USB',
  },
  lens: {
    name: 'VT-Lens',
    href: 'https://github.com/ValentinTorassa/VT-Lens',
    language: 'Rust',
    languageColor: '#d98a54',
    tags: ['Rust', 'Linux /proc', 'Processes', 'Networks'],
    tone: 'systems',
    previewImage: lensScreenshot,
    previewKind: 'screenshot' as const,
    previewAddress: 'VT-Lens / demo',
  },
  agentFirewall: {
    name: 'VT-Agent-Firewall',
    href: 'https://github.com/ValentinTorassa/VT-Agent-Firewall',
    language: 'Python',
    languageColor: '#f7c95a',
    tags: ['MCP', 'Prompt injection', 'Default-deny', 'Audit log'],
    tone: 'security',
    previewImage: agentFirewallDemo,
    previewKind: 'screenshot' as const,
    previewAddress: 'VT-Agent-Firewall / demo',
  },
  comandle: {
    name: 'comandle',
    href: 'https://github.com/legiosai/comandle',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    tags: ['Linux', 'Terminal', 'Web', 'Legios'],
    tone: 'learning',
    siteHref: 'https://comandle.valentorassa.com/?ref=portfolio',
    previewImage: comandleScreenshot,
    previewKind: 'screenshot' as const,
    previewAddress: 'comandle.valentorassa.com',
  },
};

const esRepos: FeaturedRepo[] = [
  {
    ...repoFacts.openSecurityLabs,
    previewAlt: 'Vista de la plataforma Open Security Labs',
    stage: 'Plataforma pública',
    proof: 'Laboratorios MDX versionados · seis rutas de aprendizaje',
    description: 'Laboratorios abiertos en español para aprender Linux, redes, backend y seguridad entendiendo cómo funcionan los sistemas.',
    caseStudy: {
      problem: 'La formación técnica en español suele quedarse en teoría o depender de plataformas cerradas.',
      architecture: 'Sitio estático en Astro con rutas temáticas, laboratorios versionados en GitHub y progreso guardado localmente en el navegador.',
      security: 'Sin cuentas ni seguimiento remoto del progreso; los ejercicios se ejecutan en la máquina del estudiante y el contenido es auditable como código.',
    },
  },
  {
    ...repoFacts.agentFirewall,
    previewAlt: 'Demo de VT-Agent-Firewall en la terminal: cada pedido del agente, permitido o bloqueado, con su regla',
    stage: 'Laboratorio de seguridad',
    proof: 'Demo de prompt injection: cero exfiltraciones y cada decisión auditada',
    description: 'Gateway local entre un agente de IA y sus herramientas: archivos, shell, red y MCP. Bloquea lo que la política no permite, pide aprobación humana y deja un registro de auditoría.',
    caseStudy: {
      problem: 'Un agente con herramientas puede leer un archivo con instrucciones maliciosas y usarlas para sacar secretos de la máquina.',
      architecture: 'Cada pedido del agente pasa por un motor de políticas default-deny antes de tocar archivos, shell, red, APIs o un servidor MCP. Python con la biblioteca estándar, probado contra 58 casos sintéticos de inyección.',
      security: 'Es un laboratorio y no está listo para producción. Si no puede escribir el registro de auditoría, bloquea todo. La demo usa un .env falso y un receptor local.',
    },
  },
  {
    ...repoFacts.comandle,
    previewAlt: 'Pantalla de comandle con el tablero vacío del comando del día y el teclado',
    stage: 'Juego en vivo · Legios',
    proof: 'Más de 1.500 partidas · versión de terminal y web',
    description: 'Adiviná el comando de Linux o de seguridad del día en seis intentos, desde la terminal o el navegador. Al final te explica qué hace.',
    caseStudy: {
      problem: 'Los comandos de Linux y de seguridad se suelen aprender de memoria, con listas. Un juego diario da una razón para volver y aprender uno por día.',
      architecture: 'Un cliente de terminal y una versión web comparten la lista de comandos. El contador de partidas y las salas para jugar en una clase usan la API de pluma.',
      security: 'No hace falta crear cuenta ni elegir nombre. En una sala, la pantalla muestra cuántos terminaron y en cuántos intentos, sin nombres.',
    },
  },
  {
    ...repoFacts.securityFixes,
    previewAlt: 'El registro fixes.yaml de VT-Security-Fixes en GitHub',
    stage: 'Candidatos de parche',
    proof: 'Tres parches DEP-3 con trazabilidad de CVE y upstream',
    description: 'Parches para CVEs de paquetes Ubuntu universe, con procedencia y estado documentados por paquete.',
    caseStudy: {
      problem: 'Una corrección upstream no siempre llega al paquete estándar que utiliza una persona.',
      architecture: 'Cada candidato reúne el parche DEP-3, la referencia upstream, el CVE, las versiones afectadas y un registro de seguimiento.',
      security: 'El repositorio contiene candidatos de parche. Su presencia no demuestra que Ubuntu los haya aceptado o publicado; ese estado se verifica por CVE.',
    },
  },
  {
    ...repoFacts.secretShare,
    previewAlt: 'Captura de la interfaz pública de VT-SecretShare',
    stage: 'Servicio en vivo',
    proof: 'Cifrado WebCrypto · lectura única con Redis GETDEL',
    description: 'Enlaces de una sola lectura: el navegador cifra el secreto y un backend en Go coordina su vencimiento.',
    caseStudy: {
      problem: 'Compartir credenciales por chat o email deja copias persistentes y difíciles de revocar.',
      architecture: 'El navegador cifra con WebCrypto; el servicio Go guarda solo el texto cifrado en Redis y consume cada enlace con GETDEL atómico.',
      security: 'La clave viaja en el fragmento del enlace y no se almacena en el servidor. CSP, TTL y límites de uso reducen riesgos adicionales, sin eliminar los del navegador o el receptor.',
    },
  },
  {
    ...repoFacts.pluma,
    previewAlt: 'El blog de VT Security, publicado con pluma',
    stage: 'Aplicación en uso',
    proof: 'Un código · dos sitios públicos · API con permisos',
    description: 'Plataforma de publicación con editor, imágenes y comentarios, desplegada para sitios independientes desde un mismo código.',
    caseStudy: {
      problem: 'Publicar en sitios distintos suele duplicar el producto o mezclar contenido, configuración y permisos.',
      architecture: 'Next.js, Turso y un contrato de tenants separan los despliegues; el editor y la API comparten el modelo de publicaciones.',
      security: 'El panel usa sesión de administrador y la API emplea tokens con scopes; el contenido y los comentarios requieren validación y moderación.',
    },
  },
  {
    ...repoFacts.ragnaros,
    previewAlt: 'Foto del control deck real funcionando con el daemon de Ragnaros',
    stage: 'Daemon Linux',
    proof: 'Protocolo USB reconstruido · controles y pantallas vía libusb',
    description: 'Daemon Linux y perfiles configurables para un control deck USB, con transporte libusb y controles en espacio de usuario.',
    caseStudy: {
      problem: 'El dispositivo no ofrecía una integración Linux nativa para sus teclas, perillas y pantalla táctil.',
      architecture: 'Un servicio de usuario decodifica eventos USB, dibuja pantallas y enlaza acciones a perfiles YAML; el transporte usa libusb.',
      security: 'Es un daemon de espacio de usuario, no un controlador del kernel. Las acciones de shell configuradas en perfiles requieren revisión del operador.',
    },
  },
  {
    ...repoFacts.lens,
    previewAlt: 'VT Lens con datos sintéticos: procesos a la izquierda y sus conexiones a la derecha',
    stage: 'Aplicación de escritorio',
    proof: 'GUI Rust · procesos, conexiones y exportación de evidencia',
    description: 'Interfaz nativa para inspeccionar procesos y conexiones de Linux y convertir una selección en evidencia legible.',
    caseStudy: {
      problem: 'Relacionar procesos con conexiones y explicar una observación concreta exige reunir datos dispersos del sistema.',
      architecture: 'Una GUI en Rust lee metadatos de /proc, permite enfocar un proceso y exporta la selección en Markdown.',
      security: 'Es una herramienta educativa, no un EDR. Su función opcional de consulta a un modelo puede transmitir la evidencia seleccionada y necesita una explicación de privacidad clara.',
    },
  },
];

const enRepos: FeaturedRepo[] = [
  {
    ...repoFacts.openSecurityLabs,
    previewAlt: 'Preview of the Open Security Labs platform',
    stage: 'Public learning platform',
    proof: 'Versioned MDX labs · six learning paths',
    description: 'Open Spanish-language labs for learning Linux, networking, backend systems, and security from the underlying mechanisms.',
    caseStudy: {
      problem: 'Spanish-language technical education often stops at theory or depends on closed learning platforms.',
      architecture: 'Static Astro site with themed paths, GitHub-versioned labs, and progress stored locally in the browser.',
      security: 'No accounts or remote progress tracking; exercises run on the learner’s machine and the content remains auditable as code.',
    },
  },
  {
    ...repoFacts.agentFirewall,
    previewAlt: 'VT-Agent-Firewall demo in the terminal: each agent request, allowed or blocked, with its rule',
    stage: 'Security lab',
    proof: 'Prompt injection demo: zero exfiltration and every decision audited',
    description: 'A local gateway between an AI agent and its tools: files, shell, network, and MCP. It blocks whatever the policy does not allow, asks a human for approval, and keeps an audit log.',
    caseStudy: {
      problem: 'An agent with tools can read a file that carries malicious instructions and use them to pull secrets off the machine.',
      architecture: 'Every agent request goes through a default-deny policy engine before it reaches files, the shell, the network, APIs, or an MCP server. Python standard library only, tested against 58 synthetic injection cases.',
      security: 'It is a lab and not production-ready. If it cannot write the audit log, it blocks everything. The demo uses a fake .env and a local receiver.',
    },
  },
  {
    ...repoFacts.comandle,
    previewAlt: 'comandle with the empty board for the command of the day and the keyboard',
    stage: 'Live game · Legios',
    proof: 'More than 1,500 games played · terminal and web',
    description: 'Guess the Linux or security command of the day in six tries, from the terminal or the browser. At the end it explains what the command does.',
    caseStudy: {
      problem: 'Linux and security commands are usually learned by memorizing lists. A daily game gives a reason to come back and learn one a day.',
      architecture: 'A terminal client and a web version share the command list. The game counter and the rooms for playing in a class use the pluma API.',
      security: 'No account or player name needed. In a room, the screen shows how many finished and in how many tries, with no names.',
    },
  },
  {
    ...repoFacts.securityFixes,
    previewAlt: 'Dark-adapted view of the VT Security Fixes fixes.yaml registry on GitHub',
    stage: 'Patch candidates',
    proof: 'Three DEP-3 patches with CVE and upstream provenance',
    description: 'Candidate patches for Ubuntu universe CVEs, with source and package status recorded for each fix.',
    caseStudy: {
      problem: 'An upstream fix does not always reach the standard package people use.',
      architecture: 'Each candidate includes a DEP-3 patch, upstream reference, CVE, affected releases, and a status record.',
      security: 'The repository contains patch candidates. Their presence does not prove Ubuntu accepted or released them; verify that status per CVE.',
    },
  },
  {
    ...repoFacts.secretShare,
    previewAlt: 'Screenshot of the public VT-SecretShare interface',
    stage: 'Live service',
    proof: 'WebCrypto encryption · one read through Redis GETDEL',
    description: 'Single-read links: the browser encrypts the secret and a Go backend coordinates its expiration.',
    caseStudy: {
      problem: 'Sharing credentials through chat or email leaves persistent copies that are difficult to revoke.',
      architecture: 'The browser encrypts with WebCrypto; the Go service stores only ciphertext in Redis and consumes each link with atomic GETDEL.',
      security: 'The key stays in the URL fragment and is not stored by the server. CSP, TTL, and rate limits reduce other risks without eliminating browser or recipient risks.',
    },
  },
  {
    ...repoFacts.pluma,
    previewAlt: 'Dark-adapted view of the VT Security blog published with Pluma',
    stage: 'Live application',
    proof: 'One codebase · two public sites · scoped API',
    description: 'Publishing platform with an editor, images, and comments, deployed for independent sites from one codebase.',
    caseStudy: {
      problem: 'Publishing across separate sites often duplicates the product or mixes content, configuration, and permissions.',
      architecture: 'Next.js, Turso, and a tenant contract separate deployments; the editor and API share a publishing model.',
      security: 'The admin panel uses a session and the API uses scoped tokens; content and comments require validation and moderation.',
    },
  },
  {
    ...repoFacts.ragnaros,
    previewAlt: 'Photo of the real USB control deck running the Ragnaros daemon',
    stage: 'Linux daemon',
    proof: 'Reverse-engineered USB protocol · libusb controls and displays',
    description: 'Linux daemon and configurable profiles for a USB control deck, with libusb transport and user-space controls.',
    caseStudy: {
      problem: 'The device lacked a native Linux integration for its keys, knobs, and touch display.',
      architecture: 'A user service decodes USB events, renders displays, and maps actions through YAML profiles; transport uses libusb.',
      security: 'This is a userspace daemon, not a kernel driver. Shell actions configured in profiles require operator review.',
    },
  },
  {
    ...repoFacts.lens,
    previewAlt: 'Dark-adapted VT Lens view using synthetic demo data',
    stage: 'Desktop app',
    proof: 'Rust GUI · processes, connections, evidence export',
    description: 'Native app for inspecting Linux processes and connections and turning a selection into readable evidence.',
    caseStudy: {
      problem: 'Connecting processes to network activity and explaining an observation requires gathering scattered system data.',
      architecture: 'A Rust GUI reads /proc metadata, lets users focus on a process, and exports the selected evidence as Markdown.',
      security: 'An educational instrument, not an EDR. Its optional model request can send selected evidence and needs a clear privacy explanation.',
    },
  },
];

const radarFacts = {
  name: 'VT-Radar',
  language: 'TypeScript',
  languageColor: '#3178c6',
  tags: ['Next.js', 'TypeScript', 'Tailscale', 'Gatus'],
  tone: 'product',
  previewImage: radarAudienceScreenshot,
  previewKind: 'screenshot' as const,
  previewSize: { width: 2143, height: 734 },
};

const esPrivateProjects: PrivateProject[] = [
  {
    ...radarFacts,
    previewAddress: 'VT-Radar · datos sintéticos',
    previewAlt: 'Captura de la vista Audiencia de VT-Radar editada con métricas sintéticas',
    stage: 'Tablero privado en uso',
    proof: 'Atlas de proyectos · agenda de 14 días · señales de salud',
    description: 'Tablero de solo lectura que reúne proyectos, infraestructura, publicaciones y estado operativo de VT Security y VT Art.',
    caseStudy: {
      problem: 'El estado de los proyectos, los servicios y el calendario de contenido estaba repartido entre varias fuentes.',
      architecture: 'Una aplicación Next.js combina señales de GitHub, Gatus, Tailscale y herramientas de publicación. Presenta un atlas de repositorios e infraestructura, una agenda de 14 días y vistas de salud y rendimiento con la procedencia de cada dato.',
      security: 'El acceso requiere login y red privada Tailscale. El tablero solo lee: no publica ni agenda contenido; las vistas y API protegidas exigen autenticación.',
    },
  },
];

const enPrivateProjects: PrivateProject[] = [
  {
    ...radarFacts,
    previewAddress: 'VT-Radar · synthetic data',
    previewAlt: 'Screenshot of the VT-Radar Audience view edited with synthetic metrics',
    stage: 'Private dashboard in use',
    proof: 'Project atlas · 14-day schedule · health signals',
    description: 'Read-only dashboard bringing together projects, infrastructure, publishing, and operational health for VT Security and VT Art.',
    caseStudy: {
      problem: 'Project status, service health, and the publishing calendar were scattered across several sources.',
      architecture: 'A Next.js app combines signals from GitHub, Gatus, Tailscale, and publishing tools. It presents a repository and infrastructure atlas, a 14-day schedule, and health and performance views with source provenance.',
      security: 'Access requires a login on the private Tailscale network. The dashboard only reads: it does not publish or schedule content, and protected views and APIs require authentication.',
    },
  },
];

/** Public posts on Teramot's engineering blog, both written by Valentín. */
const teramotPosts = [
  { label: 'How to Get SOC 2 Certified Without Dying in the Attempt', href: 'https://docs.teramot.com/blog/soc-2-without-dying/' },
  { label: 'When Can Software Honestly Say Done?', href: 'https://docs.teramot.com/blog/when-can-software-say-done/' },
];

const awsBuilderProfile = 'https://builder.aws.com/community/vtsecurity';
const legiosApps = {
  quartermaster: { name: 'quartermaster', href: 'https://quartermaster.legios.com.ar/', repo: 'https://github.com/legiosai/quartermaster', image: quartermasterScreenshot },
  archivist: { name: 'archivist', href: 'https://archivist.legios.com.ar/', repo: 'https://github.com/legiosai/archivist', image: archivistScreenshot },
  tidbit: { name: 'tidbit', href: 'https://tidbit.legios.com.ar/', repo: 'https://github.com/legiosai/tidbit', image: tidbitScreenshot },
};
const legiosLinks = [
  { label: 'legios.com.ar', href: 'https://legios.com.ar/' },
  { label: 'github.com/legiosai', href: 'https://github.com/legiosai' },
];
const awsStandbyArticle =
  'https://builder.aws.com/content/3KsTKSPIcI2vPjk1pr5gAQPPdTE/un-standby-frio-en-aws-para-mi-servidor-casero-que-medi-y-que-falta-probar';

export const contentByLanguage: Record<Language, PageContent> = {
  es: {
    documentTitle: 'Valentín Torassa Colombero · Ciberseguridad y Backend',
    seo: {
      description: 'Valentín Torassa Colombero, ingeniero en ciberseguridad y arquitecto de software en Rosario. Seguridad cloud, agentes de IA, Go y Linux, con charlas, proyectos open source y un libro en preparación.',
      locale: 'es_AR',
    },
    header: siteChromeByLanguage.es.header,
    navItems: siteNav('home', 'es'),
    heroEyebrow: 'CIBERSEGURIDAD · BACKEND · LINUX',
    heroBookTag: 'Nuevo',
    heroBookLabel: 'Leé gratis el capítulo 1 de mi libro',
    heroStatement: 'Diseño sistemas, creo herramientas para Linux y comparto lo que aprendo.',
    heroSocialLabel: 'Redes y contacto',
    heroProjectsLabel: 'Ver proyectos',
    heroBlogLabel: 'Leer el blog',
    heroContactLabel: 'Contacto',
    terminalLines: [
      { prompt: '$', command: 'whoami', output: 'Cybersecurity Engineer & Software Architect' },
      {
        prompt: '$',
        command: 'grep -i focus ./stack.log',
        output: 'AI agent authorization, MCP, OAuth/OIDC, AWS IAM, Go, Linux',
      },
      {
        prompt: '$',
        command: 'certs --active',
        output: 'CompTIA Security+, AWS CCP, LFCA, HCIA Datacom',
      },
    ],
    profile: {
      eyebrow: 'perfil',
      title: 'Entender los sistemas a fondo para construirlos, protegerlos y explicarlos.',
      intro:
        'Trabajo en seguridad cloud y en backend. Me ocupo de permisos, identidad, datos sensibles y de la evidencia que piden las auditorías, y escribo buena parte del código que implementa esos controles. Mi base son Linux y las redes, de cuando hacía seguridad de redes y operación de SOC en Consulting IT.',
      statement:
        'En Teramot lidero ciberseguridad y compliance. Coordiné la auditoría SOC 2, del Tipo 1 al informe final del Tipo 2, y diseño Aleph, el backend en Go que les da a agentes de IA acceso controlado a datos de empresa.',
      facts: [
        {
          key: 'sec',
          title: 'Seguridad en agentes de IA',
          text: 'OAuth y permisos cuando el que llama es un agente, servidores MCP y controles que viven fuera del modelo. Es el tema de mis charlas de 2026 en Ekoparty, JCC y ROS:SEC.',
        },
        {
          key: 'arch',
          title: 'Arquitectura backend',
          text: 'Servicios en Go con APIs, eventos en NATS, PostgreSQL y OAuth 2.1, instrumentados con OpenTelemetry. Es el stack de Aleph en Teramot.',
        },
        {
          key: 'ops',
          title: 'Operaciones de seguridad y hardening cloud',
          text: 'AWS ECS/Fargate, IAM, SSO, CloudTrail, GuardDuty, OIDC en GitHub Actions, secretos, remediación e instrumentación con OpenTelemetry.',
        },
      ],
    },
    experience: {
      eyebrow: 'experiencia',
      title: 'Trayectoria profesional',
      items: [
        {
          role: 'Cybersecurity Engineer & Software Architect',
          company: 'Teramot',
          period: 'nov. 2025 - actualidad',
          description:
            'Lidero ciberseguridad y compliance en una startup de IA. Coordiné la auditoría SOC 2 de Teramot, del Tipo 1 (dic. 2025) al informe final del Tipo 2 (sep. 2026). Soy arquitecto principal de Aleph, un backend en Go para que agentes de IA accedan a datos empresariales de forma segura y escalable.',
          tags: ['Go 1.25', 'AWS SDK v2', 'MCP', 'OAuth 2.1', 'OIDC', 'NATS', 'PostgreSQL', 'OpenTelemetry'],
          logo: teramotLogo,
          logoMode: 'symbol',
          writing: { label: 'En el blog de ingeniería de Teramot', links: teramotPosts },
        },
        {
          role: 'Analista de Ciberseguridad y Compliance',
          company: 'Teramot',
          period: 'jun. 2025 - nov. 2025',
          description:
            'Estructuración del área de seguridad, automatización de controles, evidencia de auditoría y hardening de infraestructura AWS para datos sensibles usados por agentes de IA.',
          tags: ['SOC 2', 'ISO/IEC 27001', 'AWS Security', 'Audit Evidence', 'Data Protection'],
          logo: teramotLogo,
          logoMode: 'symbol',
        },
        {
          role: 'Analista de Ciberseguridad',
          company: 'Consulting IT',
          period: 'ago. 2024 - jul. 2025',
          description:
            'Estrategia de seguridad para clientes de outsourcing, arquitectura de red segura, hardening, automatización y operación SOC con Sophos Central, Avast Business y Nagios.',
          tags: ['SOC', 'Sophos', 'Avast', 'Nagios', 'Firewalls', 'Networking'],
          logo: consultingItLogo,
          logoMode: 'wordmark',
          hideCompanyLabel: true,
        },
        {
          role: 'Ayudante de Cátedra · Arquitectura de Computadoras II',
          company: 'Universidad Abierta Interamericana',
          period: 'sept. 2024 - jun. 2025',
          description:
            'Acompañamiento académico en arquitectura de procesadores, jerarquía de memoria, I/O y conceptos de sistemas de bajo nivel.',
          tags: ['Low-level systems', 'CPU Architecture', 'Memory', 'I/O', 'Teaching'],
          logo: uaiLogo,
          logoMode: 'institution',
          hideCompanyLabel: true,
        },
      ],
    },
    education: {
      eyebrow: 'formación',
      title: 'Academia y certificaciones',
      academicTitle: 'Formación académica',
      certificationsTitle: 'Certificaciones',
      institutionLogo: uaiCrest,
      items: [
        {
          title: 'Ingeniería en Sistemas Informáticos',
          place: 'Universidad Abierta Interamericana',
          period: 'abr. 2022 - dic. 2026',
          status: 'Último año',
        },
        {
          title: 'Analista de Sistemas Informáticos',
          place: 'Universidad Abierta Interamericana',
          period: 'abr. 2022 - dic. 2024',
          status: 'Promedio 9,25 / 10',
        },
        {
          title: 'Módulo Pedagógico para Auxiliares en Docencia',
          place: 'UAI · Diplomatura Académica en Docencia Universitaria',
          period: '2026',
          status: 'Certificado obtenido',
        },
      ],
      community: {
        label: 'Comunidad',
        name: 'AWS Community Builder',
        text: 'Primer año en el programa.',
        href: awsBuilderProfile,
      },
      certifications: [
        {
          name: 'CompTIA Security+',
          detail: 'SY0-701 · vigente hasta feb. 2029',
          focus: 'Operaciones, riesgo, arquitectura de seguridad y fundamentos de respuesta a incidentes.',
          icon: SiComptia,
          tone: 'security',
        },
        {
          name: 'AWS Certified Cloud Practitioner',
          detail: 'CLF-C02 · vigente hasta jul. 2028',
          focus: 'Conceptos cloud, seguridad, servicios, facturación y responsabilidad compartida en AWS.',
          icon: FaAws,
          tone: 'aws',
        },
        {
          name: 'Linux Foundation Certified IT Associate',
          detail: 'LFCA · vigente hasta abr. 2028',
          focus: 'Linux, cloud, DevOps, fundamentos de seguridad y sistemas de TI modernos.',
          icon: SiLinuxfoundation,
          tone: 'linux',
        },
        {
          name: 'Huawei HCIA Datacom',
          detail: 'Huawei Certified ICT Associate · Datacom',
          focus: 'Routing, switching, redes IP y fundamentos de conectividad empresarial.',
          icon: SiHuawei,
          tone: 'huawei',
        },
      ],
    },
    stack: {
      eyebrow: 'stack',
      title: 'Stack operativo',
      intro: 'Tecnologías y prácticas presentes en producto, seguridad cloud, auditorías y operación en producción.',
      groups: [
        {
          title: 'Seguridad cloud',
          text: 'Seguridad e infraestructura AWS para workloads de producto, datos sensibles y despliegues auditables.',
          tags: cloudTags,
          tone: 'cloud',
        },
        {
          title: 'Compliance engineering',
          text: 'Controles implementados en sistemas, evidencia, poblaciones de auditoría y remediación técnica.',
          tags: complianceTags,
          tone: 'compliance',
        },
        {
          title: 'Arquitectura backend',
          text: 'Servicios en Go para APIs, eventos, autenticación, observabilidad y contratos compartidos con frontend.',
          tags: backendTags,
          tone: 'backend',
        },
        {
          title: 'Sistemas y redes',
          text: 'Administración Linux, redes, VPNs, firewalls, monitoreo y troubleshooting operativo.',
          tags: systemsTags,
          tone: 'systems',
        },
      ],
    },
    research: {
      eyebrow: 'open source',
      title: 'Proyectos seleccionados',
      talksEyebrow: 'charlas',
      talksTitle: 'Charlas y reconocimiento',
      talksIntro: 'En 2026 hablé en Ekoparty, DebConf26, CACIC, JCC y Hacking Day, y di clases invitadas en la UAI. Cada charla tiene su página con las slides.',
      speakingTitle: 'Speaking y reconocimiento',
      repositoriesTitle: 'Repositorios destacados',
      featuredLabel: 'Proyecto destacado',
      upcomingTalksLabel: 'Próximas charlas',
      previousTalksLabel: 'Charlas y reconocimientos anteriores',
      nextTalkLabel: 'Próxima charla',
      allTalksLabel: 'Ver todas las charlas',
      hubLabel: 'Explorar las charlas y sus slides',
      speakerKitLabel: 'Invitarme a tu evento',
      bookLabel: 'El libro: leé el capítulo 1',
      openTalkLabel: 'Ver agenda oficial',
      openProjectLabel: 'Abrir Open Security Labs',
      openRepoLabel: 'Abrir repositorio',
      proofLabel: 'Evidencia',
      additionalLabel: 'Más trabajo',
      contributionLabel: 'Contribución a Podman',
      contributionProof: 'Soporte de reintentos para manifest push, integrado upstream.',
      developerSetupLabel: 'Entornos de desarrollo',
      githubProfileLabel: 'Ver todos los repositorios',
      projectDetailsLabel: 'Explorar proyecto',
      closeProjectLabel: 'Cerrar proyecto',
      problemLabel: 'Problema',
      architectureLabel: 'Arquitectura',
      securityLabel: 'Decisiones de seguridad',
      visitProjectLabel: 'Abrir proyecto',
      repos: esRepos,
      privateWorkLabel: 'trabajo privado',
      privateCodeLabel: 'Acceso privado',
      privateProjects: esPrivateProjects,
      legios: {
        label: 'Legios',
        intro: 'Con Sol Soletti armamos Legios. Publicamos como open source las herramientas que primero necesitábamos nosotros. comandle, entre los destacados, también es de Legios.',
        links: legiosLinks,
        projects: [
          { ...legiosApps.quartermaster, alt: 'Página de quartermaster con el panel de cuota de cada cuenta', text: 'Cuánta cuota te queda en todas tus cuentas de agentes: cada perfil de Claude Code, Codex y opencode, sin red y sin credenciales.' },
          { ...legiosApps.archivist, alt: 'Página de archivist con la vista de la biblioteca', text: 'Manga, cómics, películas y series desde tu propio disco, con lector, reproductor, API y servidor MCP. Se acuerda de dónde te quedaste.' },
          { ...legiosApps.tidbit, alt: 'Portada de tidbit con el buscador de términos', text: 'Términos de tecnología explicados en palabras simples, en español e inglés, con API JSON y servidor MCP.' },
        ],
      },
      moreWork: [
        {
          label: 'Homelab',
          text: 'Mi servidor casero como plano reproducible: monitoreo, restore probado cada semana y un standby frío en AWS.',
          links: [
            { label: 'Repositorio', href: 'https://github.com/ValentinTorassa/homelab-blueprint' },
            { label: 'Artículo en AWS Builder Center', href: awsStandbyArticle },
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'contacto',
      title: 'Escribime.',
      text: 'Estoy en Rosario, Argentina. Respondo mails sobre seguridad cloud, backend, agentes de IA y Linux, e invitaciones a charlas y clases.',
      emailLabel: 'Enviar email',
      copyEmailLabel: 'Copiar email',
      copiedEmailLabel: 'Email copiado',
      socialLabel: 'Perfiles sociales',
      youtubeLabel: 'Ver en YouTube',
      timezone: 'UTC-3 · Rosario',
      availability: 'Disponible para conversaciones técnicas',
    },
    footer: siteChromeByLanguage.es.footer,
  },
  en: {
    documentTitle: 'Valentin Torassa Colombero · Cybersecurity & Backend',
    seo: {
      description: 'Valentín Torassa Colombero, cybersecurity engineer and software architect in Rosario, Argentina. Cloud security, AI agents, Go, and Linux, with talks, open source projects, and an upcoming book.',
      locale: 'en_US',
    },
    header: siteChromeByLanguage.en.header,
    navItems: siteNav('home', 'en'),
    heroEyebrow: 'CYBERSECURITY · BACKEND · LINUX',
    heroBookTag: 'New',
    heroBookLabel: 'Read chapter 1 of my book, free',
    heroStatement: 'I design systems, build tools for Linux, and share what I learn.',
    heroSocialLabel: 'Social profiles and contact',
    heroProjectsLabel: 'Explore projects',
    heroBlogLabel: 'Read the blog',
    heroContactLabel: 'Contact',
    terminalLines: [
      { prompt: '$', command: 'whoami', output: 'Cybersecurity Engineer & Software Architect' },
      {
        prompt: '$',
        command: 'grep -i focus ./stack.log',
        output: 'AI agent authorization, MCP, OAuth/OIDC, AWS IAM, Go, Linux',
      },
      {
        prompt: '$',
        command: 'certs --active',
        output: 'CompTIA Security+, AWS CCP, LFCA, HCIA Datacom',
      },
    ],
    profile: {
      eyebrow: 'profile',
      title: 'Understanding systems well enough to build them, secure them, and explain them.',
      intro:
        'I work on cloud security and backend systems. I handle permissions, identity, sensitive data, and the evidence audits ask for, and I write much of the code that implements those controls. My background is Linux and networking, from my time doing network security and SOC operations at Consulting IT.',
      statement:
        'At Teramot I lead cybersecurity and compliance. I coordinated the SOC 2 audit, from Type 1 to the final Type 2 report, and I design Aleph, the Go backend that gives AI agents controlled access to company data.',
      facts: [
        {
          key: 'sec',
          title: 'Security for AI agents',
          text: 'OAuth and permissions when the caller is an agent, MCP servers, and controls that live outside the model. It is the subject of my 2026 talks at Ekoparty, JCC, and ROS:SEC.',
        },
        {
          key: 'arch',
          title: 'Backend architecture',
          text: 'Go services with APIs, NATS events, PostgreSQL, and OAuth 2.1, instrumented with OpenTelemetry. It is the stack behind Aleph at Teramot.',
        },
        {
          key: 'ops',
          title: 'Security operations and cloud hardening',
          text: 'AWS ECS/Fargate, IAM, SSO, CloudTrail, GuardDuty, GitHub Actions OIDC, secrets, remediation, and OpenTelemetry instrumentation.',
        },
      ],
    },
    experience: {
      eyebrow: 'experience',
      title: 'Professional experience',
      items: [
        {
          role: 'Cybersecurity Engineer & Software Architect',
          company: 'Teramot',
          period: 'Nov. 2025 - present',
          description:
            'I lead cybersecurity and compliance at an AI startup. I coordinated Teramot’s SOC 2 audit, from the Type 1 (Dec. 2025) to the final Type 2 report (Sep. 2026). I am the principal architect of Aleph, a Go backend that gives AI agents secure, scalable access to enterprise data.',
          tags: ['Go 1.25', 'AWS SDK v2', 'MCP', 'OAuth 2.1', 'OIDC', 'NATS', 'PostgreSQL', 'OpenTelemetry'],
          logo: teramotLogo,
          logoMode: 'symbol',
          writing: { label: 'On the Teramot engineering blog', links: teramotPosts },
        },
        {
          role: 'Cybersecurity & Compliance Analyst',
          company: 'Teramot',
          period: 'Jun. 2025 - Nov. 2025',
          description:
            'Built the security function, automated controls and audit evidence, and hardened AWS infrastructure for sensitive data used by AI agents.',
          tags: ['SOC 2', 'ISO/IEC 27001', 'AWS Security', 'Audit Evidence', 'Data Protection'],
          logo: teramotLogo,
          logoMode: 'symbol',
        },
        {
          role: 'Cybersecurity Analyst',
          company: 'Consulting IT',
          period: 'Aug. 2024 - Jul. 2025',
          description:
            'Security strategy for outsourcing clients, secure network architecture, hardening, automation, and SOC operations with Sophos Central, Avast Business, and Nagios.',
          tags: ['SOC', 'Sophos', 'Avast', 'Nagios', 'Firewalls', 'Networking'],
          logo: consultingItLogo,
          logoMode: 'wordmark',
          hideCompanyLabel: true,
        },
        {
          role: 'Teaching Assistant · Computer Architecture II',
          company: 'Universidad Abierta Interamericana',
          period: 'Sep. 2024 - Jun. 2025',
          description:
            'Academic support across processor architecture, memory hierarchies, I/O, and low-level systems concepts.',
          tags: ['Low-level systems', 'CPU Architecture', 'Memory', 'I/O', 'Teaching'],
          logo: uaiLogo,
          logoMode: 'institution',
          hideCompanyLabel: true,
        },
      ],
    },
    education: {
      eyebrow: 'education',
      title: 'Education and certifications',
      academicTitle: 'Academic background',
      certificationsTitle: 'Certifications',
      institutionLogo: uaiCrest,
      items: [
        {
          title: 'Information Systems Engineering',
          place: 'Universidad Abierta Interamericana',
          period: 'Apr. 2022 - Dec. 2026',
          status: 'Final year',
        },
        {
          title: 'Information Systems Analyst',
          place: 'Universidad Abierta Interamericana',
          period: 'Apr. 2022 - Dec. 2024',
          status: 'GPA 9.25 / 10',
        },
        {
          title: 'Pedagogical Module for Teaching Assistants',
          place: 'UAI · Academic Diploma in University Teaching pathway',
          period: '2026',
          status: 'Certificate obtained',
        },
      ],
      community: {
        label: 'Community',
        name: 'AWS Community Builder',
        text: 'First year in the programme.',
        href: awsBuilderProfile,
      },
      certifications: [
        {
          name: 'CompTIA Security+',
          detail: 'SY0-701 · valid through Feb. 2029',
          focus: 'Security operations, risk, architecture, and incident response fundamentals.',
          icon: SiComptia,
          tone: 'security',
        },
        {
          name: 'AWS Certified Cloud Practitioner',
          detail: 'CLF-C02 · valid through Jul. 2028',
          focus: 'AWS cloud concepts, security, services, billing, and shared responsibility.',
          icon: FaAws,
          tone: 'aws',
        },
        {
          name: 'Linux Foundation Certified IT Associate',
          detail: 'LFCA · valid through Apr. 2028',
          focus: 'Linux, cloud, DevOps, security fundamentals, and modern IT systems.',
          icon: SiLinuxfoundation,
          tone: 'linux',
        },
        {
          name: 'Huawei HCIA Datacom',
          detail: 'Huawei Certified ICT Associate · Datacom',
          focus: 'Routing, switching, IP networking, and enterprise connectivity fundamentals.',
          icon: SiHuawei,
          tone: 'huawei',
        },
      ],
    },
    stack: {
      eyebrow: 'stack',
      title: 'Operational stack',
      intro: 'Technologies and practices used across product engineering, cloud security, audits, and production operations.',
      groups: [
        {
          title: 'Cloud security',
          text: 'AWS security and infrastructure for product workloads, sensitive data, and auditable deployments.',
          tags: cloudTags,
          tone: 'cloud',
        },
        {
          title: 'Compliance engineering',
          text: 'System-level controls, evidence, audit populations, and technical remediation.',
          tags: complianceTags,
          tone: 'compliance',
        },
        {
          title: 'Backend architecture',
          text: 'Go services for APIs, events, authentication, observability, and shared frontend contracts.',
          tags: backendTags,
          tone: 'backend',
        },
        {
          title: 'Systems and networks',
          text: 'Linux administration, networking, VPNs, firewalls, monitoring, and operational troubleshooting.',
          tags: systemsTags,
          tone: 'systems',
        },
      ],
    },
    research: {
      eyebrow: 'open source',
      title: 'Selected work',
      talksEyebrow: 'talks',
      talksTitle: 'Talks and recognition',
      talksIntro: 'In 2026 I spoke at Ekoparty, DebConf26, CACIC, JCC, and Hacking Day, and gave guest classes at UAI. Each talk has its own page with the slides.',
      speakingTitle: 'Speaking and recognition',
      repositoriesTitle: 'Featured repositories',
      featuredLabel: 'Featured project',
      upcomingTalksLabel: 'Upcoming talks',
      previousTalksLabel: 'Previous talks and recognition',
      nextTalkLabel: 'Upcoming talk',
      allTalksLabel: 'See all talks',
      hubLabel: 'Browse the talks and their slides',
      speakerKitLabel: 'Invite me to your event',
      bookLabel: 'The book: read chapter 1',
      openTalkLabel: 'View official schedule',
      openProjectLabel: 'Open Open Security Labs',
      openRepoLabel: 'Open repository',
      proofLabel: 'Evidence',
      additionalLabel: 'More work',
      contributionLabel: 'Podman contribution',
      contributionProof: 'Retry support for manifest push, merged upstream.',
      developerSetupLabel: 'Developer setup',
      githubProfileLabel: 'View all repositories',
      projectDetailsLabel: 'Explore project',
      closeProjectLabel: 'Close project',
      problemLabel: 'Problem',
      architectureLabel: 'Architecture',
      securityLabel: 'Security decisions',
      visitProjectLabel: 'Open project',
      repos: enRepos,
      privateWorkLabel: 'private work',
      privateCodeLabel: 'Private access',
      privateProjects: enPrivateProjects,
      legios: {
        label: 'Legios',
        intro: 'Sol Soletti and I started Legios. We publish as open source the tools we first needed ourselves. comandle, among the featured projects, is also a Legios project.',
        links: legiosLinks,
        projects: [
          { ...legiosApps.quartermaster, alt: 'The quartermaster page with the quota panel for each account', text: 'How much quota you have left across all your agent accounts: every Claude Code profile, Codex, and opencode, offline and without credentials.' },
          { ...legiosApps.archivist, alt: 'The archivist page with the library view', text: 'Manga, comics, films, and series from your own disk, with a reader, a player, an API, and an MCP server. It remembers where you stopped.' },
          { ...legiosApps.tidbit, alt: 'The tidbit home page with the term search', text: 'Technology terms explained in plain words, in Spanish and English, with a JSON API and an MCP server.' },
        ],
      },
      moreWork: [
        {
          label: 'Homelab',
          text: 'My home server as a reproducible blueprint: monitoring, a restore tested every week, and a cold standby in AWS.',
          links: [
            { label: 'Repository', href: 'https://github.com/ValentinTorassa/homelab-blueprint' },
            { label: 'Article on AWS Builder Center', href: awsStandbyArticle },
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'contact',
      title: 'Get in touch.',
      text: 'I am in Rosario, Argentina. I answer email about cloud security, backend systems, AI agents, and Linux, and invitations to talks and classes.',
      emailLabel: 'Send email',
      copyEmailLabel: 'Copy email',
      copiedEmailLabel: 'Email copied',
      socialLabel: 'Social profiles',
      youtubeLabel: 'Watch on YouTube',
      timezone: 'UTC-3 · Rosario',
      availability: 'Open to technical conversations',
    },
    footer: siteChromeByLanguage.en.footer,
  },
};
