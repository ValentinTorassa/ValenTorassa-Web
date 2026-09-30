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
import openSecurityLabsPreview from './assets/projects/open-security-labs-live.png';
import lensScreenshot from './assets/projects/lens-demo.png';
import plumaScreenshot from './assets/projects/pluma-homepage.png';
import ragnarosPhoto from './assets/projects/ragnaros-device.jpg';
import secretShareScreenshot from './assets/projects/secretshare-homepage.png';
import securityFixesScreenshot from './assets/projects/security-fixes-repo.png';

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
  siteHref?: string;
  caseStudy: {
    problem: string;
    architecture: string;
    security: string;
  };
};

type PageContent = {
  documentTitle: string;
  seo: {
    description: string;
    locale: 'es_AR' | 'en_US';
  };
  header: HeaderLabels;
  navItems: NavItem[];
  heroEyebrow: string;
  heroStatement: string;
  heroSocialLabel: string;
  heroProjectsLabel: string;
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
    ...repoFacts.securityFixes,
    previewAlt: 'Captura del registro fixes.yaml de VT Security Fixes en GitHub',
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
    previewAlt: 'Captura del blog VT Security publicado con Pluma',
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
    description: 'Daemon Linux y perfiles configurables para un control deck USB cuyo software oficial funciona en Windows.',
    caseStudy: {
      problem: 'El dispositivo no ofrecía una integración Linux nativa para sus teclas, perillas y pantalla táctil.',
      architecture: 'Un servicio de usuario decodifica eventos USB, dibuja pantallas y enlaza acciones a perfiles YAML; el transporte usa libusb.',
      security: 'Es un daemon de espacio de usuario, no un controlador del kernel. Las acciones de shell configuradas en perfiles requieren revisión del operador.',
    },
  },
  {
    ...repoFacts.lens,
    previewAlt: 'Captura de VT Lens con datos de demostración sintéticos',
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
    ...repoFacts.securityFixes,
    previewAlt: 'Screenshot of the VT Security Fixes fixes.yaml registry on GitHub',
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
    previewAlt: 'Screenshot of the VT Security blog published with Pluma',
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
    description: 'Linux daemon and configurable profiles for a USB control deck whose official software runs on Windows.',
    caseStudy: {
      problem: 'The device lacked a native Linux integration for its keys, knobs, and touch display.',
      architecture: 'A user service decodes USB events, renders displays, and maps actions through YAML profiles; transport uses libusb.',
      security: 'This is a userspace daemon, not a kernel driver. Shell actions configured in profiles require operator review.',
    },
  },
  {
    ...repoFacts.lens,
    previewAlt: 'Real VT Lens screenshot using synthetic demo data',
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

export const contentByLanguage: Record<Language, PageContent> = {
  es: {
    documentTitle: 'Valentín Torassa Colombero · Ciberseguridad y Backend',
    seo: {
      description: 'Ingeniero en ciberseguridad y backend especializado en seguridad cloud, arquitectura Go, Linux, compliance técnico y sistemas para agentes de IA.',
      locale: 'es_AR',
    },
    header: siteChromeByLanguage.es.header,
    navItems: siteNav('home', 'es'),
    heroEyebrow: 'SEGURIDAD / BACKEND / SISTEMAS',
    heroStatement: 'Diseño sistemas, creo herramientas para Linux y comparto lo que aprendo.',
    heroSocialLabel: 'Redes y contacto',
    heroProjectsLabel: 'Ver proyectos',
    heroContactLabel: 'Contacto',
    terminalLines: [
      { prompt: '$', command: 'whoami', output: 'Cybersecurity Engineer + Backend Engineer' },
      {
        prompt: '$',
        command: 'grep -i focus ./stack.log',
        output: 'Go, Cloud Security, Linux, Networking, OAuth/OIDC, MCP, AWS IAM',
      },
      {
        prompt: '$',
        command: 'certs --active',
        output: 'CompTIA Security+, AWS CCP, LFCA, HCIA Datacom',
      },
    ],
    profile: {
      eyebrow: '// perfil',
      title: 'Arquitectura de software, backend, seguridad cloud y compliance técnico.',
      intro:
        'Combino arquitectura de software, desarrollo backend, seguridad cloud, Linux, redes y compliance para construir y operar sistemas seguros desde el diseño. Trabajo especialmente sobre identidad, permisos, datos sensibles, auditoría, observabilidad, infraestructura y confiabilidad operativa.',
      statement:
        'En Teramot desarrollo el backend en Go de Aleph, trabajo sobre arquitectura y seguridad en AWS, y convierto requisitos SOC 2 e ISO/IEC 27001 en implementaciones técnicas verificables.',
      facts: [
        {
          key: 'sec',
          title: 'Seguridad cloud y compliance',
          text: 'Lidero la estrategia técnica de ciberseguridad y compliance en Teramot, integrando controles SOC 2 e ISO/IEC 27001 en infraestructura y producto.',
        },
        {
          key: 'arch',
          title: 'Arquitectura backend en Go',
          text: 'Soy arquitecto principal de Aleph, una plataforma backend que expone datos empresariales de forma segura a agentes de IA: archivos, bases de datos y APIs.',
        },
        {
          key: 'ops',
          title: 'Operaciones de seguridad y hardening cloud',
          text: 'AWS ECS/Fargate, IAM, SSO, CloudTrail, GuardDuty, OIDC en GitHub Actions, secretos, remediación e instrumentación con OpenTelemetry.',
        },
      ],
    },
    experience: {
      eyebrow: '// experiencia',
      title: 'Trayectoria profesional',
      items: [
        {
          role: 'Cybersecurity Engineer & Software Architect',
          company: 'Teramot',
          period: 'nov. 2025 - actualidad',
          description:
            'Liderazgo técnico de ciberseguridad y compliance en una startup de IA. Coordiné la auditoría SOC 2 de Teramot, del Tipo 1 (dic. 2025) al informe final del Tipo 2 (sep. 2026). Arquitectura principal de Aleph, un backend en Go para el acceso seguro y escalable a datos empresariales consumidos por agentes de IA.',
          tags: ['Go 1.25', 'AWS SDK v2', 'MCP', 'OAuth 2.1', 'OIDC', 'NATS', 'PostgreSQL', 'OpenTelemetry'],
          logo: teramotLogo,
          logoMode: 'symbol',
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
      eyebrow: '// formación',
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
      eyebrow: '// stack',
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
      eyebrow: '// open source',
      title: 'Proyectos seleccionados',
      talksEyebrow: '// charlas',
      talksTitle: 'Charlas y reconocimiento',
      talksIntro: 'Charlas, clases y papers. Cada una tiene su página en valentorassa.com/charlas, con las slides desde el día que la doy.',
      speakingTitle: 'Speaking y reconocimiento',
      repositoriesTitle: 'Repositorios destacados',
      featuredLabel: 'Proyecto destacado',
      upcomingTalksLabel: 'Próximas charlas',
      previousTalksLabel: 'Charlas y reconocimientos anteriores',
      nextTalkLabel: 'Próxima charla',
      allTalksLabel: 'Ver todas las charlas',
      hubLabel: 'Explorar las charlas y sus slides',
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
    },
    contact: {
      eyebrow: '// contacto',
      title: 'Contacto profesional.',
      text: 'Rosario, Argentina · conversaciones técnicas sobre seguridad cloud, backend, compliance, agentes de IA, Linux y arquitectura de sistemas.',
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
      description: 'Cybersecurity and backend engineer focused on cloud security, Go architecture, Linux, technical compliance, and systems for AI agents.',
      locale: 'en_US',
    },
    header: siteChromeByLanguage.en.header,
    navItems: siteNav('home', 'en'),
    heroEyebrow: 'SECURITY / BACKEND / SYSTEMS',
    heroStatement: 'I design systems, build tools for Linux, and share what I learn.',
    heroSocialLabel: 'Social profiles and contact',
    heroProjectsLabel: 'Explore projects',
    heroContactLabel: 'Contact',
    terminalLines: [
      { prompt: '$', command: 'whoami', output: 'Cybersecurity Engineer + Backend Engineer' },
      {
        prompt: '$',
        command: 'grep -i focus ./stack.log',
        output: 'Go, Cloud Security, Linux, Networking, OAuth/OIDC, MCP, AWS IAM',
      },
      {
        prompt: '$',
        command: 'certs --active',
        output: 'CompTIA Security+, AWS CCP, LFCA, HCIA Datacom',
      },
    ],
    profile: {
      eyebrow: '// profile',
      title: 'Software architecture, backend, cloud security, and technical compliance.',
      intro:
        'I combine software architecture, backend development, cloud security, Linux, networking, and compliance to build and operate secure-by-design systems. My work focuses on identity, permissions, sensitive data, auditability, observability, infrastructure, and operational reliability.',
      statement:
        'At Teramot, I develop Aleph’s Go backend, work across AWS architecture and security, and translate SOC 2 and ISO/IEC 27001 requirements into verifiable technical implementations.',
      facts: [
        {
          key: 'sec',
          title: 'Cloud security and compliance',
          text: 'I lead Teramot’s technical cybersecurity and compliance strategy, embedding SOC 2 and ISO/IEC 27001 controls into infrastructure and product.',
        },
        {
          key: 'arch',
          title: 'Backend architecture in Go',
          text: 'I am the principal architect of Aleph, a backend platform that securely exposes enterprise data to AI agents across files, databases, and APIs.',
        },
        {
          key: 'ops',
          title: 'Security operations and cloud hardening',
          text: 'AWS ECS/Fargate, IAM, SSO, CloudTrail, GuardDuty, GitHub Actions OIDC, secrets, remediation, and OpenTelemetry instrumentation.',
        },
      ],
    },
    experience: {
      eyebrow: '// experience',
      title: 'Professional experience',
      items: [
        {
          role: 'Cybersecurity Engineer & Software Architect',
          company: 'Teramot',
          period: 'Nov. 2025 - present',
          description:
            'Technical cybersecurity and compliance leadership at an AI startup. I coordinated Teramot’s SOC 2 audit, from the Type 1 (Dec. 2025) to the final Type 2 report (Sep. 2026). Principal architecture of Aleph, a Go backend that gives AI agents secure, scalable access to enterprise data.',
          tags: ['Go 1.25', 'AWS SDK v2', 'MCP', 'OAuth 2.1', 'OIDC', 'NATS', 'PostgreSQL', 'OpenTelemetry'],
          logo: teramotLogo,
          logoMode: 'symbol',
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
      eyebrow: '// education',
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
      eyebrow: '// stack',
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
      eyebrow: '// open source',
      title: 'Selected work',
      talksEyebrow: '// talks',
      talksTitle: 'Talks and recognition',
      talksIntro: 'Talks, classes, and papers. Each one has its own page at valentorassa.com/charlas, with the slides from the day I give it.',
      speakingTitle: 'Speaking and recognition',
      repositoriesTitle: 'Featured repositories',
      featuredLabel: 'Featured project',
      upcomingTalksLabel: 'Upcoming talks',
      previousTalksLabel: 'Previous talks and recognition',
      nextTalkLabel: 'Upcoming talk',
      allTalksLabel: 'See all talks',
      hubLabel: 'Browse the talks and their slides',
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
    },
    contact: {
      eyebrow: '// contact',
      title: 'Professional contact.',
      text: 'Rosario, Argentina · technical conversations about cloud security, backend systems, compliance, AI agents, Linux, and systems architecture.',
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
