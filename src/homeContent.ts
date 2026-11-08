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
  /** A short note in the first person, with the photo, low on the page before the contact. */
  about: {
    eyebrow: string;
    photoAlt: string;
    text: string[];
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
      icon: IconType;
      tone: string;
    }>;
    /** A community programme, shown under the certifications: it is not one. */
    community: { label: string; name: string; text: string; href: string };
  };
  stack: {
    eyebrow: string;
    title: string;
    groups: Array<{
      title: string;
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
    upcomingTalksLabel: string;
    previousTalksLabel: string;
    nextTalkLabel: string;
    allTalksLabel: string;
    hubLabel: string;
    /** Link to /speaker-kit, the page for event organizers. */
    speakerKitLabel: string;
    openTalkLabel: string;
    openProjectLabel: string;
    openRepoLabel: string;
    additionalLabel: string;
    contributionLabel: string;
    contributionProof: string;
    githubProfileLabel: string;
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
    /** Extra rows in "More work", after the Podman contribution. */
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
    description: 'Laboratorios abiertos en español para aprender Linux, redes, backend y seguridad viendo cómo funcionan los sistemas por dentro. Son seis rutas; los ejercicios se hacen en tu máquina y no hace falta crear una cuenta.',
  },
  {
    ...repoFacts.agentFirewall,
    previewAlt: 'Demo de VT-Agent-Firewall en la terminal: cada pedido del agente, permitido o bloqueado, con su regla',
    description: 'Gateway local entre un agente de IA y sus herramientas: archivos, shell, red y MCP. Bloquea lo que la política no permite, pide aprobación humana y registra cada decisión. Es un laboratorio, probado contra 58 casos de prompt injection; no está pensado para producción.',
  },
  {
    ...repoFacts.comandle,
    previewAlt: 'Pantalla de comandle con el tablero vacío del comando del día y el teclado',
    description: 'Adiviná el comando de Linux o de seguridad del día en seis intentos, desde la terminal o el navegador. Al final te explica qué hace. Lleva más de 1.500 partidas.',
  },
  {
    ...repoFacts.securityFixes,
    previewAlt: 'El registro fixes.yaml de VT-Security-Fixes en GitHub',
    description: 'Parches DEP-3 para CVEs en paquetes de Ubuntu universe, cada uno con su CVE, su referencia upstream y su estado. Son candidatos: que un parche esté acá no quiere decir que Ubuntu lo haya publicado.',
  },
  {
    ...repoFacts.secretShare,
    previewAlt: 'Captura de la interfaz pública de VT-SecretShare',
    description: 'Enlaces para pasar un secreto que se leen una sola vez. El navegador lo cifra y la clave queda en el fragmento del enlace; el servidor en Go solo guarda el texto cifrado en Redis y lo borra al leerlo.',
  },
  {
    ...repoFacts.pluma,
    previewAlt: 'El blog de VT Security, publicado con pluma',
    description: 'La plataforma con la que publico el blog: editor, imágenes, comentarios y una API con permisos por token. El mismo código sirve dos sitios separados.',
  },
  {
    ...repoFacts.ragnaros,
    previewAlt: 'Foto del control deck real funcionando con el daemon de Ragnaros',
    description: 'Daemon para usar en Linux un control deck USB que no tenía soporte. Reconstruí su protocolo: teclas, perillas y pantallas funcionan con libusb y las acciones se configuran en perfiles YAML.',
  },
  {
    ...repoFacts.lens,
    previewAlt: 'VT Lens con datos sintéticos: procesos a la izquierda y sus conexiones a la derecha',
    description: 'App de escritorio en Rust que muestra qué conexiones tiene cada proceso de Linux y exporta lo que seleccionás a Markdown.',
  },
];

const enRepos: FeaturedRepo[] = [
  {
    ...repoFacts.openSecurityLabs,
    previewAlt: 'Preview of the Open Security Labs platform',
    description: 'Open Spanish-language labs for learning Linux, networking, backend systems, and security by seeing how they work underneath. Six learning paths; the exercises run on your own machine, with no account needed.',
  },
  {
    ...repoFacts.agentFirewall,
    previewAlt: 'VT-Agent-Firewall demo in the terminal: each agent request, allowed or blocked, with its rule',
    description: 'A local gateway between an AI agent and its tools: files, shell, network, and MCP. It blocks whatever the policy does not allow, asks a human for approval, and logs every decision. It is a lab, tested against 58 prompt injection cases, and not meant for production.',
  },
  {
    ...repoFacts.comandle,
    previewAlt: 'comandle with the empty board for the command of the day and the keyboard',
    description: 'Guess the Linux or security command of the day in six tries, from the terminal or the browser. At the end it explains what the command does. More than 1,500 games played so far.',
  },
  {
    ...repoFacts.securityFixes,
    previewAlt: 'The VT-Security-Fixes fixes.yaml registry on GitHub',
    description: 'DEP-3 patches for CVEs in Ubuntu universe packages, each with its CVE, upstream reference, and status. They are candidates: a patch being here does not mean Ubuntu has released it.',
  },
  {
    ...repoFacts.secretShare,
    previewAlt: 'Screenshot of the public VT-SecretShare interface',
    description: 'Links for passing on a secret that can be read only once. The browser encrypts it and the key stays in the link fragment; the Go server stores only the ciphertext in Redis and deletes it on read.',
  },
  {
    ...repoFacts.pluma,
    previewAlt: 'The VT Security blog, published with pluma',
    description: 'The platform I publish the blog with: an editor, images, comments, and an API with scoped tokens. The same codebase serves two separate sites.',
  },
  {
    ...repoFacts.ragnaros,
    previewAlt: 'Photo of the real USB control deck running the Ragnaros daemon',
    description: 'A daemon that makes a USB control deck work on Linux, which it did not support. I reverse-engineered its protocol: keys, knobs, and displays run over libusb, and actions are set in YAML profiles.',
  },
  {
    ...repoFacts.lens,
    previewAlt: 'VT Lens with synthetic data: processes on the left and their connections on the right',
    description: 'A Rust desktop app that shows which connections each Linux process has and exports your selection as Markdown.',
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
    description: 'Tablero de solo lectura con el estado de mis proyectos, servicios y publicaciones. Está detrás de un login y de Tailscale; la captura usa datos de ejemplo.',
  },
];

const enPrivateProjects: PrivateProject[] = [
  {
    ...radarFacts,
    previewAddress: 'VT-Radar · synthetic data',
    previewAlt: 'Screenshot of the VT-Radar Audience view edited with synthetic metrics',
    description: 'Read-only dashboard with the status of my projects, services, and publishing. It sits behind a login and Tailscale; the screenshot uses sample data.',
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
const devSetupLinks = [
  { label: 'VT Terminal', href: 'https://github.com/ValentinTorassa/VT-Terminal-Project' },
  { label: 'VT IDE', href: 'https://github.com/ValentinTorassa/VT-Terminal-Project/tree/main/ide' },
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
    about: {
      eyebrow: 'sobre mí',
      photoAlt: 'Valentín Torassa Colombero',
      text: [
        'Soy Valentín. Trabajo en seguridad cloud y backend, y hoy lidero ciberseguridad y compliance en Teramot.',
        'Doy charlas sobre seguridad en agentes de IA y comparto lo que aprendo en el blog.',
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
            'Lidero ciberseguridad y compliance en una startup de IA. Coordiné la auditoría SOC 2 de Teramot, del Tipo 1 (dic. 2025) al informe final del Tipo 2 (sep. 2026). Soy el arquitecto principal de Aleph, el backend en Go con el que agentes de IA acceden a datos de empresa.',
          tags: ['Go', 'AWS SDK v2', 'MCP', 'OAuth 2.1', 'OIDC', 'NATS', 'PostgreSQL', 'OpenTelemetry'],
          logo: teramotLogo,
          logoMode: 'symbol',
          writing: { label: 'En el blog de ingeniería de Teramot', links: teramotPosts },
        },
        {
          role: 'Analista de Ciberseguridad y Compliance',
          company: 'Teramot',
          period: 'jun. 2025 - nov. 2025',
          description:
            'Armé el área de seguridad, automaticé controles y evidencia de auditoría e hice el hardening de la infraestructura AWS donde viven los datos sensibles que usan los agentes de IA.',
          tags: ['SOC 2', 'ISO/IEC 27001', 'AWS'],
          logo: teramotLogo,
          logoMode: 'symbol',
        },
        {
          role: 'Analista de Ciberseguridad',
          company: 'Consulting IT',
          period: 'ago. 2024 - jul. 2025',
          description:
            'Seguridad para clientes de outsourcing: diseño y hardening de redes, automatización y operación del SOC con Sophos Central, Avast Business y Nagios.',
          tags: ['SOC', 'Firewalls', 'Networking'],
          logo: consultingItLogo,
          logoMode: 'wordmark',
          hideCompanyLabel: true,
        },
        {
          role: 'Ayudante de Cátedra · Arquitectura de Computadoras II',
          company: 'Universidad Abierta Interamericana',
          period: 'sept. 2024 - jun. 2025',
          description:
            'Ayudé en las clases de arquitectura de procesadores, jerarquía de memoria y entrada/salida.',
          tags: [],
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
          icon: SiComptia,
          tone: 'security',
        },
        {
          name: 'AWS Certified Cloud Practitioner',
          detail: 'CLF-C02 · vigente hasta jul. 2028',
          icon: FaAws,
          tone: 'aws',
        },
        {
          name: 'Linux Foundation Certified IT Associate',
          detail: 'LFCA · vigente hasta abr. 2028',
          icon: SiLinuxfoundation,
          tone: 'linux',
        },
        {
          name: 'Huawei HCIA Datacom',
          detail: 'Huawei Certified ICT Associate · Datacom',
          icon: SiHuawei,
          tone: 'huawei',
        },
      ],
    },
    stack: {
      eyebrow: 'stack',
      title: 'Con qué trabajo',
      groups: [
        {
          title: 'Seguridad cloud',
          tags: cloudTags,
          tone: 'cloud',
        },
        {
          title: 'Compliance',
          tags: complianceTags,
          tone: 'compliance',
        },
        {
          title: 'Backend',
          tags: backendTags,
          tone: 'backend',
        },
        {
          title: 'Sistemas y redes',
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
      talksIntro: 'En 2026 di charlas en Ekoparty (cinco), DebConf26, CACIC, JCC, Hacking Day y ROS:SEC, y clases invitadas en la UAI. Cada charla tiene su página con las slides.',
      upcomingTalksLabel: 'Próximas charlas',
      previousTalksLabel: 'Charlas y reconocimientos anteriores',
      nextTalkLabel: 'Próxima charla',
      allTalksLabel: 'Ver todas las charlas',
      hubLabel: 'Explorar las charlas y sus slides',
      speakerKitLabel: 'Invitarme a tu evento',
      openTalkLabel: 'Ver agenda oficial',
      openProjectLabel: 'Abrir Open Security Labs',
      openRepoLabel: 'Repositorio',
      additionalLabel: 'Más trabajo',
      contributionLabel: 'Contribución a Podman',
      contributionProof: 'Soporte de reintentos para manifest push, integrado upstream.',
      githubProfileLabel: 'Ver todos los repositorios',
      repos: esRepos,
      privateWorkLabel: 'trabajo privado',
      privateCodeLabel: 'Acceso privado',
      privateProjects: esPrivateProjects,
      legios: {
        label: 'Legios',
        intro: 'Legios es el estudio open source que armamos con Sol Soletti. Publicamos las herramientas que primero necesitamos nosotros; comandle también es de Legios.',
        links: legiosLinks,
        projects: [
          { ...legiosApps.quartermaster, alt: 'Página de quartermaster con el panel de cuota de cada cuenta', text: 'Cuánta cuota te queda en todas tus cuentas de agentes: cada perfil de Claude Code, Codex y opencode, sin red y sin credenciales.' },
          { ...legiosApps.archivist, alt: 'Página de archivist con la vista de la biblioteca', text: 'Manga, cómics, películas y series desde tu propio disco, con lector, reproductor, API y servidor MCP. Se acuerda de dónde te quedaste.' },
          { ...legiosApps.tidbit, alt: 'Portada de tidbit con el buscador de términos', text: 'Términos de tecnología explicados en palabras simples, en español e inglés, con API JSON y servidor MCP.' },
        ],
      },
      moreWork: [
        {
          label: 'Dotfiles',
          text: 'Mi configuración de terminal y editor para macOS y Linux.',
          links: devSetupLinks,
        },
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
    about: {
      eyebrow: 'about me',
      photoAlt: 'Valentín Torassa Colombero',
      text: [
        "I'm Valentín. I work on cloud security and backend systems, and I lead cybersecurity and compliance at Teramot.",
        'I give talks on security for AI agents and share what I learn on the blog.',
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
            'I lead cybersecurity and compliance at an AI startup. I coordinated Teramot’s SOC 2 audit, from the Type 1 (Dec. 2025) to the final Type 2 report (Sep. 2026). I am the principal architect of Aleph, the Go backend through which AI agents access company data.',
          tags: ['Go', 'AWS SDK v2', 'MCP', 'OAuth 2.1', 'OIDC', 'NATS', 'PostgreSQL', 'OpenTelemetry'],
          logo: teramotLogo,
          logoMode: 'symbol',
          writing: { label: 'On the Teramot engineering blog', links: teramotPosts },
        },
        {
          role: 'Cybersecurity & Compliance Analyst',
          company: 'Teramot',
          period: 'Jun. 2025 - Nov. 2025',
          description:
            'Built the security function, automated controls and audit evidence, and hardened the AWS infrastructure that holds the sensitive data AI agents use.',
          tags: ['SOC 2', 'ISO/IEC 27001', 'AWS'],
          logo: teramotLogo,
          logoMode: 'symbol',
        },
        {
          role: 'Cybersecurity Analyst',
          company: 'Consulting IT',
          period: 'Aug. 2024 - Jul. 2025',
          description:
            'Security for outsourcing clients: network design and hardening, automation, and SOC operations with Sophos Central, Avast Business, and Nagios.',
          tags: ['SOC', 'Firewalls', 'Networking'],
          logo: consultingItLogo,
          logoMode: 'wordmark',
          hideCompanyLabel: true,
        },
        {
          role: 'Teaching Assistant · Computer Architecture II',
          company: 'Universidad Abierta Interamericana',
          period: 'Sep. 2024 - Jun. 2025',
          description:
            'Helped teach processor architecture, memory hierarchy, and I/O.',
          tags: [],
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
          icon: SiComptia,
          tone: 'security',
        },
        {
          name: 'AWS Certified Cloud Practitioner',
          detail: 'CLF-C02 · valid through Jul. 2028',
          icon: FaAws,
          tone: 'aws',
        },
        {
          name: 'Linux Foundation Certified IT Associate',
          detail: 'LFCA · valid through Apr. 2028',
          icon: SiLinuxfoundation,
          tone: 'linux',
        },
        {
          name: 'Huawei HCIA Datacom',
          detail: 'Huawei Certified ICT Associate · Datacom',
          icon: SiHuawei,
          tone: 'huawei',
        },
      ],
    },
    stack: {
      eyebrow: 'stack',
      title: 'What I work with',
      groups: [
        {
          title: 'Cloud security',
          tags: cloudTags,
          tone: 'cloud',
        },
        {
          title: 'Compliance',
          tags: complianceTags,
          tone: 'compliance',
        },
        {
          title: 'Backend',
          tags: backendTags,
          tone: 'backend',
        },
        {
          title: 'Systems and networks',
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
      talksIntro: 'In 2026 I spoke at Ekoparty (five talks), DebConf26, CACIC, JCC, Hacking Day, and ROS:SEC, and gave guest classes at UAI. Each talk has its own page with the slides.',
      upcomingTalksLabel: 'Upcoming talks',
      previousTalksLabel: 'Previous talks and recognition',
      nextTalkLabel: 'Upcoming talk',
      allTalksLabel: 'See all talks',
      hubLabel: 'Browse the talks and their slides',
      speakerKitLabel: 'Invite me to your event',
      openTalkLabel: 'View official schedule',
      openProjectLabel: 'Open Open Security Labs',
      openRepoLabel: 'Repository',
      additionalLabel: 'More work',
      contributionLabel: 'Podman contribution',
      contributionProof: 'Retry support for manifest push, merged upstream.',
      githubProfileLabel: 'View all repositories',
      repos: enRepos,
      privateWorkLabel: 'private work',
      privateCodeLabel: 'Private access',
      privateProjects: enPrivateProjects,
      legios: {
        label: 'Legios',
        intro: 'Legios is the open source studio Sol Soletti and I started. We publish the tools we needed first ourselves; comandle is a Legios project too.',
        links: legiosLinks,
        projects: [
          { ...legiosApps.quartermaster, alt: 'The quartermaster page with the quota panel for each account', text: 'How much quota you have left across all your agent accounts: every Claude Code profile, Codex, and opencode, offline and without credentials.' },
          { ...legiosApps.archivist, alt: 'The archivist page with the library view', text: 'Manga, comics, films, and series from your own disk, with a reader, a player, an API, and an MCP server. It remembers where you stopped.' },
          { ...legiosApps.tidbit, alt: 'The tidbit home page with the term search', text: 'Technology terms explained in plain words, in Spanish and English, with a JSON API and an MCP server.' },
        ],
      },
      moreWork: [
        {
          label: 'Dotfiles',
          text: 'My terminal and editor setup for macOS and Linux.',
          links: devSetupLinks,
        },
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
    },
    footer: siteChromeByLanguage.en.footer,
  },
};
