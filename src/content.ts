import type { IconType } from 'react-icons';
import { FaAws, FaEnvelope, FaLinkedinIn } from 'react-icons/fa6';
import {
  SiAstro,
  SiClaude,
  SiComptia,
  SiDocker,
  SiGithub,
  SiGithubactions,
  SiGnubash,
  SiGo,
  SiHuawei,
  SiInstagram,
  SiJsonwebtokens,
  SiLinux,
  SiLinuxfoundation,
  SiMikrotik,
  SiNatsdotio,
  SiOpenapiinitiative,
  SiOpenid,
  SiPostgresql,
  SiRedis,
  SiTiktok,
  SiTerraform,
  SiWireguard,
  SiX,
  SiYoutube,
  SiZedindustries,
} from 'react-icons/si';
import consultingItLogo from './assets/companies/consulting-it.png';
import teramotLogo from './assets/companies/teramot.png';
import uaiLogo from './assets/companies/uai.png';

export type Language = 'es' | 'en';

export type SocialLink = {
  name: string;
  href: string;
  icon: IconType;
};

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
  stars: number;
  forks: number;
  updatedAt: string;
  tags: StackTag[];
  tone: string;
  featured?: boolean;
};

type PageContent = {
  documentTitle: string;
  header: {
    homeLabel: string;
    navLabel: string;
    languageLabel: string;
    spanishLabel: string;
    englishLabel: string;
  };
  navItems: Array<{ label: string; href: string }>;
  status: string;
  heroRole: string;
  heroSocialLabel: string;
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
    speakingTitle: string;
    repositoriesTitle: string;
    featuredLabel: string;
    openTalkLabel: string;
    openRepoLabel: string;
    starsLabel: string;
    forksLabel: string;
    updatedLabel: string;
    githubProfileLabel: string;
    recognitions: Array<{
      event: string;
      title: string;
      detail: string;
      kind: 'research' | 'speaker';
      badge?: string;
      href?: string;
    }>;
    repos: FeaturedRepo[];
  };
  contact: {
    title: string;
    text: string;
  };
};

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/ValentinTorassa',
    icon: SiGithub,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/valetorassa/',
    icon: FaLinkedinIn,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@vtcibersecurity',
    icon: SiYoutube,
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@vtsecurity',
    icon: SiTiktok,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/vtsecurity',
    icon: SiInstagram,
  },
  {
    name: 'X',
    href: 'https://x.com/ValenSecurity',
    icon: SiX,
  },
  {
    name: 'Email',
    href: 'mailto:valentin.torassa.colombero@gmail.com',
    icon: FaEnvelope,
  },
];

export const headerSocialLinks = socialLinks.filter((link) =>
  ['YouTube', 'TikTok', 'Instagram', 'X'].includes(link.name),
);

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
    languageColor: '#ff5d01',
    stars: 8,
    forks: 1,
    updatedAt: '2026-07-16T03:35:20Z',
    tags: [
      { label: 'Astro', icon: SiAstro },
      { label: 'Linux', icon: SiLinux },
      'Networking',
      'Cloud',
      'Cybersecurity',
    ],
    tone: 'learning',
    featured: true,
  },
  terminal: {
    name: 'VT-Terminal-Project',
    href: 'https://github.com/ValentinTorassa/VT-Terminal-Project',
    language: 'Shell',
    languageColor: '#89e051',
    stars: 32,
    forks: 2,
    updatedAt: '2026-07-12T08:35:44Z',
    tags: [
      { label: 'Shell', icon: SiGnubash },
      'Zsh',
      'Ghostty',
      'Dotfiles',
      { label: 'GitHub', icon: SiGithub },
    ],
    tone: 'systems',
  },
  ide: {
    name: 'VT-IDE-Project',
    href: 'https://github.com/ValentinTorassa/VT-IDE-Project',
    language: 'Shell',
    languageColor: '#89e051',
    stars: 11,
    forks: 0,
    updatedAt: '2026-07-09T20:45:05Z',
    tags: [
      { label: 'Zed', icon: SiZedindustries },
      { label: 'Claude', icon: SiClaude },
      'MCP',
      { label: 'GitHub Actions', icon: SiGithubactions },
    ],
    tone: 'ai',
  },
  secretShare: {
    name: 'VT-SecretShare',
    href: 'https://github.com/ValentinTorassa/VT-SecretShare',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    stars: 6,
    forks: 2,
    updatedAt: '2026-07-03T18:08:41Z',
    tags: [
      { label: 'Go', icon: SiGo },
      { label: 'Redis', icon: SiRedis },
      'Zero knowledge',
      'One-time secrets',
    ],
    tone: 'security',
  },
  autoConfine: {
    name: 'AutoConfine',
    href: 'https://github.com/ValentinTorassa/AutoConfine',
    language: 'Go',
    languageColor: '#00add8',
    stars: 0,
    forks: 0,
    updatedAt: '2026-06-21T03:07:00Z',
    tags: [
      { label: 'Go', icon: SiGo },
      { label: 'Linux', icon: SiLinux },
      'eBPF',
      'seccomp',
      { label: 'Docker', icon: SiDocker },
    ],
    tone: 'security',
  },
};

const esRepos: FeaturedRepo[] = [
  {
    ...repoFacts.openSecurityLabs,
    description:
      'Plataforma educativa abierta en español con laboratorios prácticos de Linux, redes, backend, cloud y ciberseguridad.',
  },
  {
    ...repoFacts.terminal,
    description:
      'Entorno de terminal reproducible para macOS y Linux con Zsh, Ghostty, dotfiles y herramientas de IA para shell.',
  },
  {
    ...repoFacts.ide,
    description:
      'Configuración de desarrollo AI-first con Zed, integración con Claude y flujos de Git asistidos.',
  },
  {
    ...repoFacts.secretShare,
    description:
      'Intercambio zero-knowledge de secretos de un solo uso con Go y Redis; cada enlace se destruye después de la primera lectura.',
  },
  {
    ...repoFacts.autoConfine,
    description:
      'Generación automática de perfiles seccomp mínimos para contenedores OCI mediante observación del kernel con eBPF.',
  },
];

const enRepos: FeaturedRepo[] = [
  {
    ...repoFacts.openSecurityLabs,
    description:
      'Open Spanish-language learning platform with hands-on labs for Linux, networking, backend, cloud, and cybersecurity.',
  },
  {
    ...repoFacts.terminal,
    description:
      'Reproducible terminal environment for macOS and Linux with Zsh, Ghostty, dotfiles, and AI-powered shell tooling.',
  },
  {
    ...repoFacts.ide,
    description:
      'AI-first development setup with Zed, Claude integration, and assisted Git workflows.',
  },
  {
    ...repoFacts.secretShare,
    description:
      'Zero-knowledge one-time secret sharing with Go and Redis; every link self-destructs after its first read.',
  },
  {
    ...repoFacts.autoConfine,
    description:
      'Automatic generation of minimal seccomp profiles for OCI containers through eBPF-based kernel observation.',
  },
];

export const contentByLanguage: Record<Language, PageContent> = {
  es: {
    documentTitle: 'Valentín Torassa Colombero · Ciberseguridad y Backend',
    header: {
      homeLabel: 'Ir al inicio',
      navLabel: 'Secciones principales',
      languageLabel: 'Cambiar idioma',
      spanishLabel: 'Español de Argentina',
      englishLabel: 'Inglés de Estados Unidos',
    },
    navItems: [
      { label: 'Perfil', href: '#profile' },
      { label: 'Experiencia', href: '#experience' },
      { label: 'Stack', href: '#stack' },
      { label: 'Charlas y proyectos', href: '#research' },
      { label: 'Contacto', href: '#contact' },
    ],
    status: 'Teramot · seguridad cloud, backend y agentes de IA',
    heroRole: 'Ingeniero en Ciberseguridad · Ingeniero Backend · Seguridad Cloud',
    heroSocialLabel: 'Redes y contacto',
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
        output: 'CompTIA Security+, AWS CCP, Linux FCA, HCIA Datacom',
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
          role: 'Cybersecurity Engineer & Software Engineer',
          company: 'Teramot',
          period: 'nov. 2025 — actualidad',
          description:
            'Liderazgo técnico de ciberseguridad y compliance en una startup de IA. Arquitectura principal de Aleph, un backend en Go para el acceso seguro y escalable a datos empresariales consumidos por agentes de IA.',
          tags: ['Go 1.25', 'AWS SDK v2', 'MCP', 'OAuth 2.1', 'OIDC', 'NATS', 'PostgreSQL', 'OpenTelemetry'],
          logo: teramotLogo,
          logoMode: 'symbol',
        },
        {
          role: 'Cybersecurity & Compliance Analyst',
          company: 'Teramot',
          period: 'jun. 2025 — nov. 2025',
          description:
            'Estructuración del área de seguridad, automatización de controles, evidencia de auditoría y hardening de infraestructura AWS para datos sensibles usados por agentes de IA.',
          tags: ['SOC 2', 'ISO/IEC 27001', 'AWS Security', 'Audit Evidence', 'Data Protection'],
          logo: teramotLogo,
          logoMode: 'symbol',
        },
        {
          role: 'Analista de Ciberseguridad',
          company: 'Consulting IT',
          period: 'ago. 2024 — jul. 2025',
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
          period: 'sept. 2024 — jun. 2025',
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
      items: [
        {
          title: 'Ingeniería en Sistemas Informáticos',
          place: 'Universidad Abierta Interamericana',
          period: 'abr. 2022 — dic. 2026',
          status: 'Último año',
        },
        {
          title: 'Analista de Sistemas Informáticos',
          place: 'Universidad Abierta Interamericana',
          period: 'abr. 2022 — dic. 2024',
          status: 'Promedio 9,25 / 10',
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
      eyebrow: '// speaking & open source',
      title: 'Charlas, reconocimiento y proyectos abiertos',
      speakingTitle: 'Speaking y reconocimiento',
      repositoriesTitle: 'Repositorios destacados',
      featuredLabel: 'Proyecto destacado',
      openTalkLabel: 'Ver agenda oficial',
      openRepoLabel: 'Abrir repositorio',
      starsLabel: 'estrellas',
      forksLabel: 'forks',
      updatedLabel: 'Actualizado',
      githubProfileLabel: 'Ver perfil completo en GitHub',
      recognitions: [
        {
          event: 'DebConf26 · Santa Fe',
          title: 'Abstraction Leaks: Why Understanding Linux Internals Still Matters',
          detail: 'Viernes 24 de julio de 2026 · 10:00. Una charla sobre por qué comprender kernel, procesos, memoria y redes sigue siendo esencial detrás de las abstracciones modernas.',
          kind: 'speaker',
          badge: 'Próxima charla',
          href: 'https://debconf26.debconf.org/schedule/',
        },
        {
          event: 'Vincular Inteligente 2026',
          title: 'Seguridad con IA',
          detail: 'Monitoreo inteligente, respuesta temprana y automatización aplicada a defensa.',
          kind: 'speaker',
        },
        {
          event: 'CyberSecTuc Meetup #3',
          title: 'La realidad de un Ingeniero en Ciberseguridad',
          detail: 'Charla sobre carrera, criterio técnico y trabajo práctico en seguridad.',
          kind: 'speaker',
        },
        {
          event: 'CACIC 2024',
          title: 'Expositor Distinguido en Seguridad Informática',
          detail: 'Reverse shells aplicadas a pruebas de penetración y análisis ofensivo.',
          kind: 'research',
        },
        {
          event: 'SACS / 53 JAIIO 2024',
          title: 'Mejor Exposición',
          detail: 'Investigación sobre botnets, comportamiento distribuido y taxonomía de amenazas.',
          kind: 'research',
        },
      ],
      repos: esRepos,
    },
    contact: {
      title: 'Contacto profesional.',
      text: 'Rosario, Argentina · conversaciones técnicas sobre seguridad cloud, backend, compliance, agentes de IA, Linux y arquitectura de sistemas.',
    },
  },
  en: {
    documentTitle: 'Valentin Torassa Colombero · Cybersecurity & Backend',
    header: {
      homeLabel: 'Go to the top',
      navLabel: 'Main sections',
      languageLabel: 'Change language',
      spanishLabel: 'Argentinian Spanish',
      englishLabel: 'United States English',
    },
    navItems: [
      { label: 'Profile', href: '#profile' },
      { label: 'Experience', href: '#experience' },
      { label: 'Stack', href: '#stack' },
      { label: 'Talks & projects', href: '#research' },
      { label: 'Contact', href: '#contact' },
    ],
    status: 'Teramot · cloud security, backend, and AI agents',
    heroRole: 'Cybersecurity Engineer · Backend Engineer · Cloud Security',
    heroSocialLabel: 'Social profiles and contact',
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
        output: 'CompTIA Security+, AWS CCP, Linux FCA, HCIA Datacom',
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
          role: 'Cybersecurity Engineer & Software Engineer',
          company: 'Teramot',
          period: 'Nov. 2025 — present',
          description:
            'Technical cybersecurity and compliance leadership at an AI startup. Principal architecture of Aleph, a Go backend that gives AI agents secure, scalable access to enterprise data.',
          tags: ['Go 1.25', 'AWS SDK v2', 'MCP', 'OAuth 2.1', 'OIDC', 'NATS', 'PostgreSQL', 'OpenTelemetry'],
          logo: teramotLogo,
          logoMode: 'symbol',
        },
        {
          role: 'Cybersecurity & Compliance Analyst',
          company: 'Teramot',
          period: 'Jun. 2025 — Nov. 2025',
          description:
            'Built the security function, automated controls and audit evidence, and hardened AWS infrastructure for sensitive data used by AI agents.',
          tags: ['SOC 2', 'ISO/IEC 27001', 'AWS Security', 'Audit Evidence', 'Data Protection'],
          logo: teramotLogo,
          logoMode: 'symbol',
        },
        {
          role: 'Cybersecurity Analyst',
          company: 'Consulting IT',
          period: 'Aug. 2024 — Jul. 2025',
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
          period: 'Sep. 2024 — Jun. 2025',
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
      items: [
        {
          title: 'Information Systems Engineering',
          place: 'Universidad Abierta Interamericana',
          period: 'Apr. 2022 — Dec. 2026',
          status: 'Final year',
        },
        {
          title: 'Information Systems Analyst',
          place: 'Universidad Abierta Interamericana',
          period: 'Apr. 2022 — Dec. 2024',
          status: 'GPA 9.25 / 10',
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
      eyebrow: '// speaking & open source',
      title: 'Talks, recognition, and open projects',
      speakingTitle: 'Speaking and recognition',
      repositoriesTitle: 'Featured repositories',
      featuredLabel: 'Featured project',
      openTalkLabel: 'View official schedule',
      openRepoLabel: 'Open repository',
      starsLabel: 'stars',
      forksLabel: 'forks',
      updatedLabel: 'Updated',
      githubProfileLabel: 'View complete GitHub profile',
      recognitions: [
        {
          event: 'DebConf26 · Santa Fe',
          title: 'Abstraction Leaks: Why Understanding Linux Internals Still Matters',
          detail: 'Friday, July 24, 2026 · 10:00. A talk on why understanding kernels, processes, memory, and networking still matters behind modern abstractions.',
          kind: 'speaker',
          badge: 'Upcoming talk',
          href: 'https://debconf26.debconf.org/schedule/',
        },
        {
          event: 'Vincular Inteligente 2026',
          title: 'Security with AI',
          detail: 'Intelligent monitoring, early response, and automation applied to defensive security.',
          kind: 'speaker',
        },
        {
          event: 'CyberSecTuc Meetup #3',
          title: 'The reality of working as a Cybersecurity Engineer',
          detail: 'A practical talk about career development, technical judgment, and security work.',
          kind: 'speaker',
        },
        {
          event: 'CACIC 2024',
          title: 'Distinguished Speaker in Information Security',
          detail: 'Reverse shells applied to penetration testing and offensive analysis.',
          kind: 'research',
        },
        {
          event: 'SACS / 53 JAIIO 2024',
          title: 'Best Presentation',
          detail: 'Research on botnets, distributed behavior, and threat taxonomy.',
          kind: 'research',
        },
      ],
      repos: enRepos,
    },
    contact: {
      title: 'Professional contact.',
      text: 'Rosario, Argentina · technical conversations about cloud security, backend systems, compliance, AI agents, Linux, and systems architecture.',
    },
  },
};
