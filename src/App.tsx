import { motion } from 'framer-motion';
import {
  BookOpen,
  BriefcaseBusiness,
  Calendar,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Link as LinkIcon,
  Mail,
  ShieldCheck,
  Terminal,
  Youtube,
} from 'lucide-react';
import portrait from './assets/portrait-dark.png';
import awsLogo from './assets/certs/aws.svg';
import comptiaLogo from './assets/certs/comptia.svg';
import huaweiLogo from './assets/certs/huawei.svg';
import linuxFoundationLogo from './assets/certs/linuxfoundation.svg';
import vtMark from './assets/vt-mark.png';

const navItems = [
  { label: 'Perfil', href: '#profile' },
  { label: 'Experiencia', href: '#experience' },
  { label: 'Stack', href: '#stack' },
  { label: 'Reconocimiento', href: '#research' },
  { label: 'Contacto', href: '#contact' },
];

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/ValentinTorassa',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/valetorassa/',
    icon: Linkedin,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@vtcibersecurity',
    icon: Youtube,
  },
  {
    name: 'Email',
    href: 'mailto:valentin.torassa.colombero@gmail.com',
    icon: Mail,
  },
  {
    name: 'Website',
    href: 'https://valentorassa.com',
    icon: Globe,
  },
  {
    name: 'Bento',
    href: 'https://bento.me/valentintorassa',
    icon: LinkIcon,
  },
];

const terminalLines = [
  { prompt: '$', command: 'whoami', output: 'Cybersecurity Engineer + Backend Engineer' },
  {
    prompt: '$',
    command: 'cat ./teramot.txt',
    output: 'Aleph backend, AWS security, SOC 2 / ISO',
  },
  {
    prompt: '$',
    command: 'grep -i focus ./stack.log',
    output: 'Go, AWS, OAuth 2.1, OIDC, MCP, Linux',
  },
  {
    prompt: '$',
    command: 'certs --active',
    output: 'CompTIA Security+, AWS CCP, LFCA',
  },
];

const facts = [
  {
    key: 'sec',
    title: 'Cloud security & compliance',
    text: 'Lidero estrategia tecnica de ciberseguridad y compliance en Teramot, integrando controles SOC 2 e ISO/IEC 27001 en infraestructura y producto.',
  },
  {
    key: 'arch',
    title: 'Arquitectura backend en Go',
    text: 'Arquitecto principal de Aleph, plataforma backend que expone datos empresariales seguros para agentes de IA: archivos, bases de datos y APIs.',
  },
  {
    key: 'ops',
    title: 'Security operations con contexto real',
    text: 'AWS ECS/Fargate, IAM, SSO, CloudTrail, GuardDuty, OIDC en GitHub Actions, secretos, remediacion e instrumentacion con OpenTelemetry.',
  },
];

const experiences = [
  {
    role: 'Cybersecurity Engineer & Software Engineer',
    company: 'Teramot',
    period: 'nov. 2025 - actualidad',
    description:
      'Liderazgo tecnico de ciberseguridad y compliance en una startup de IA. Arquitectura principal de Aleph, backend Go para acceso seguro y escalable a datos empresariales consumidos por agentes de IA.',
    tags: ['Go 1.25', 'AWS SDK v2', 'MCP', 'OAuth 2.1', 'OIDC', 'NATS', 'PostgreSQL', 'OpenTelemetry'],
  },
  {
    role: 'Cybersecurity & Compliance Analyst',
    company: 'Teramot',
    period: 'jun. 2025 - nov. 2025',
    description:
      'Estructuracion del area de seguridad, automatizacion de controles, evidencia de auditoria y hardening de infraestructura AWS para datos sensibles usados por agentes de IA.',
    tags: ['SOC 2', 'ISO/IEC 27001', 'AWS Security', 'Audit Evidence', 'Data Protection'],
  },
  {
    role: 'Analista de Ciberseguridad',
    company: 'Consulting IT',
    period: 'ago. 2024 - jul. 2025',
    description:
      'Estrategia de seguridad para clientes outsourcing, arquitectura de red segura, hardening, automatizacion y operacion SOC con Sophos Central, Avast Business y Nagios.',
    tags: ['SOC', 'Sophos', 'Avast', 'Nagios', 'Firewalls', 'Networking'],
  },
  {
    role: 'Ayudante de Catedra, Arquitectura de Computadoras II',
    company: 'Universidad Abierta Interamericana',
    period: 'sept. 2024 - jun. 2025',
    description:
      'Acompanamiento academico en arquitectura de procesadores, jerarquia de memoria, I/O y conceptos de sistemas de bajo nivel.',
    tags: ['Low-level systems', 'CPU Architecture', 'Memory', 'I/O', 'Teaching'],
  },
];

const education = [
  {
    title: 'Ingenieria en Sistemas Informaticos',
    place: 'Universidad Abierta Interamericana',
    period: 'abr. 2022 - dic. 2026',
    status: 'Ultimo ano',
  },
  {
    title: 'Analista de Sistemas Informaticos',
    place: 'Universidad Abierta Interamericana',
    period: 'abr. 2022 - dic. 2024',
    status: 'GPA 9.25 / 10',
  },
];

const certifications = [
  {
    name: 'CompTIA Security+',
    detail: 'SY0-701 · vigente hasta feb. 2029',
    focus: 'Security operations, risk, architecture and incident response fundamentals.',
    logo: comptiaLogo,
    tone: 'security',
  },
  {
    name: 'AWS Certified Cloud Practitioner',
    detail: 'CLF-C02 · vigente hasta jul. 2028',
    focus: 'AWS cloud concepts, security, billing, services and shared responsibility.',
    logo: awsLogo,
    tone: 'aws',
  },
  {
    name: 'Linux Foundation Certified IT Associate',
    detail: 'LFCA · vigente hasta abr. 2028',
    focus: 'Linux, cloud, DevOps, security basics and modern IT systems.',
    logo: linuxFoundationLogo,
    tone: 'linux',
  },
  {
    name: 'Huawei HCIA Datacom',
    detail: 'Huawei Certified ICT Associate · Datacom',
    focus: 'Routing, switching, IP networks and enterprise connectivity foundations.',
    logo: huaweiLogo,
    tone: 'huawei',
  },
];

const stackGroups = [
  {
    title: 'Cloud security',
    text: 'Seguridad e infraestructura AWS para workloads de producto, datos sensibles y despliegues auditables.',
    tags: ['ECS/Fargate', 'IAM', 'SSO Admin', 'Secrets Manager', 'CloudTrail', 'GuardDuty', 'VPC', 'Terraform'],
    tone: 'cloud',
  },
  {
    title: 'Compliance engineering',
    text: 'Controles implementados en sistemas, evidencia, poblaciones de auditoria y remediacion tecnica.',
    tags: ['SOC 2 Type II', 'ISO/IEC 27001', 'ISMS/SGSI', 'Audit Evidence', 'OIDC', 'Secrets Handling'],
    tone: 'compliance',
  },
  {
    title: 'Backend architecture',
    text: 'Servicios Go para APIs, eventos, autenticacion, observabilidad y contratos compartidos con frontend.',
    tags: ['Go', 'chi', 'AWS SDK v2', 'NATS', 'pgx', 'Atlas', 'JWT/JWKS', 'OpenAPI'],
    tone: 'backend',
  },
  {
    title: 'Systems & networks',
    text: 'Administracion Linux, redes, VPNs, firewalls, monitoreo y troubleshooting operativo.',
    tags: ['Linux', 'TCP/IP', 'WireGuard', 'MikroTik', 'Sophos', 'Nagios', 'Docker'],
    tone: 'systems',
  },
];

const research = [
  'Expositor Distinguido en Seguridad Informatica - CACIC 2024, por reverse shells para pruebas de penetracion.',
  'Mejor Exposicion - SACS / 53 JAIIO 2024, por investigacion sobre botnets y taxonomia de amenazas.',
  'Speaker en Vincular Inteligente 2026 - Seguridad con IA: monitoreo inteligente y respuesta temprana.',
  'Speaker en CyberSecTuc Meetup #3 - La realidad de un Ingeniero en Ciberseguridad.',
];

const courses = [
  'VT Security - canal tecnico en espanol sobre ciberseguridad, Linux y software engineering, 25K+ suscriptores.',
  'Proyecto Prometeo - biblioteca digital open source con React, Node.js, TypeScript, TailwindCSS y PostgreSQL.',
  'VT-IDE-Project - configuracion publica AI-first para Zed, MCP servers, Claude Code y workflows de desarrollo.',
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55 },
};

function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Ir al inicio">
          <img src={vtMark} alt="" />
          <span>valentorassa</span>
        </a>

        <nav className="nav-links" aria-label="Secciones principales">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="social-actions">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              title={link.name}
            >
              <link.icon aria-hidden="true" />
            </a>
          ))}
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-inner">
            <div className="status-pill">
              <span className="status-dot" />
              Teramot · cloud security, backend and AI agents
            </div>

            <div className="portrait-wrap">
              <img className="portrait" src={portrait} alt="Valentin Torassa Colombero" />
              <img className="portrait-mark" src={vtMark} alt="" />
            </div>

            <p className="terminal-kicker">
              vt@security:~$ <span>whoami</span>
              <span className="caret" aria-hidden="true" />
            </p>

            <h1>Valentin Torassa Colombero</h1>

            <p className="hero-role">
              Cybersecurity Engineer · Backend Engineer · Cloud Security
            </p>

            <TerminalCard title="vt@security:~/career" lines={terminalLines} />

            <div className="hero-actions">
              <a className="btn btn-primary" href="mailto:valentin.torassa.colombero@gmail.com">
                <Mail aria-hidden="true" />
                Contactar
              </a>
              <a
                className="btn btn-secondary"
                href="https://www.linkedin.com/in/valetorassa/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin aria-hidden="true" />
                LinkedIn
              </a>
            </div>

            <div className="hero-socials" aria-label="Redes y contacto">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">
                  <link.icon aria-hidden="true" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>

          </div>
        </section>

        <div className="strip" aria-hidden="true">
          <div className="strip-track">
            {['GO BACKEND', 'SOC 2', 'ISO 27001', 'MCP/OAUTH', 'AWS SECURITY', 'LINUX', 'VT SECURITY'].map((item) => (
              <span key={item}>{item}</span>
            ))}
            {['GO BACKEND', 'SOC 2', 'ISO 27001', 'MCP/OAUTH', 'AWS SECURITY', 'LINUX', 'VT SECURITY'].map((item) => (
              <span key={`${item}-copy`}>{item}</span>
            ))}
          </div>
        </div>

        <section className="section" id="profile">
          <div className="section-head">
            <span className="eyebrow">// perfil</span>
            <h2>Entiendo sistemas desde abajo y los llevo a produccion.</h2>
            <p>
              Mi perfil cruza ciberseguridad, backend, cloud, Linux, redes y compliance. Me interesa
              saber como funciona la plataforma completa: identidad, datos, permisos, auditoria,
              observabilidad y operacion.
            </p>
          </div>

          <div className="profile-grid">
            <motion.div className="statement" {...reveal}>
              <p>
                En Teramot trabajo sobre esa interseccion: construyo backend en Go para Aleph, aseguro
                infraestructura AWS, bajo controles SOC 2 / ISO 27001 a implementaciones reales y pienso la
                seguridad como parte del producto, no como un checklist separado.
              </p>
            </motion.div>

            <div className="fact-list">
              {facts.map((fact) => (
                <motion.article key={fact.key} className="fact-card" {...reveal}>
                  <span>{fact.key}</span>
                  <div>
                    <h3>{fact.title}</h3>
                    <p>{fact.text}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-raised" id="experience">
          <div className="section-head">
            <span className="eyebrow">// experiencia</span>
            <h2>Trayectoria profesional</h2>
          </div>

          <div className="timeline">
            {experiences.map((item) => (
              <motion.article className="timeline-item" key={`${item.company}-${item.role}`} {...reveal}>
                <div className="time">
                  <Calendar aria-hidden="true" />
                  <span>{item.period}</span>
                </div>
                <div className="timeline-content">
                  <p className="company">{item.company}</p>
                  <h3>{item.role}</h3>
                  <p>{item.description}</p>
                  <TagList tags={item.tags} />
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section split-section" id="education">
          <div className="section-head compact">
            <span className="eyebrow">// formacion</span>
            <h2>Academia y certificaciones</h2>
          </div>

          <div className="split-grid">
            <motion.div className="panel" {...reveal}>
              <div className="panel-title">
                <GraduationCap aria-hidden="true" />
                <h3>Formacion academica</h3>
              </div>
              <div className="stack-list">
                {education.map((item) => (
                  <div className="stack-row" key={item.title}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.place}</span>
                    </div>
                    <em>
                      {item.period} · {item.status}
                    </em>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="panel" {...reveal}>
              <div className="panel-title">
                <ShieldCheck aria-hidden="true" />
                <h3>Certificaciones</h3>
              </div>
              <div className="cert-grid">
                {certifications.map((cert) => (
                  <article className={`cert-card cert-${cert.tone}`} key={cert.name}>
                    <span className="cert-logo">
                      <img src={cert.logo} alt="" />
                    </span>
                    <div>
                      <h4>{cert.name}</h4>
                      <strong>{cert.detail}</strong>
                      <p>{cert.focus}</p>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section section-raised" id="stack">
          <div className="section-head">
            <span className="eyebrow">// stack</span>
            <h2>Stack operativo</h2>
            <p>Tecnologias y practicas presentes en producto, seguridad cloud, auditorias y sistemas reales.</p>
          </div>

          <div className="skill-grid">
            {stackGroups.map((group) => (
              <motion.article className={`skill-card tone-${group.tone}`} key={group.title} {...reveal}>
                <h3>{group.title}</h3>
                <p>{group.text}</p>
                <TagList tags={group.tags} variant="colorful" />
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section split-section" id="research">
          <div className="section-head compact">
            <span className="eyebrow">// research & docencia</span>
            <h2>Reconocimiento, charlas y proyectos publicos</h2>
          </div>

          <div className="split-grid">
            <motion.div className="panel" {...reveal}>
              <div className="panel-title">
                <BookOpen aria-hidden="true" />
                <h3>Reconocimiento y speaking</h3>
              </div>
              <ul className="clean-list">
                {research.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div className="panel" {...reveal}>
              <div className="panel-title">
                <BriefcaseBusiness aria-hidden="true" />
                <h3>Proyectos y contenido</h3>
              </div>
              <ul className="clean-list">
                {courses.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <Terminal aria-hidden="true" />
          <h2>Contacto profesional.</h2>
          <p>
            Rosario, Argentina · conversaciones tecnicas sobre cloud security, backend, compliance,
            agentes de IA, Linux y arquitectura de sistemas.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="mailto:valentin.torassa.colombero@gmail.com">
              <Mail aria-hidden="true" />
              Email
            </a>
            <a
              className="btn btn-secondary"
              href="https://github.com/ValentinTorassa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github aria-hidden="true" />
              GitHub
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

type TerminalLine = {
  prompt: string;
  command: string;
  output: string;
};

function TerminalCard({ title, lines }: { title: string; lines: TerminalLine[] }) {
  return (
    <div className="terminal-card">
      <div className="terminal-bar">
        <span className="dot-red" />
        <span className="dot-yellow" />
        <span className="dot-green" />
        <span>{title}</span>
      </div>
      <div className="terminal-body">
        {lines.map((line) => (
          <div className="terminal-row" key={line.command}>
            <div>
              <span className="prompt">{line.prompt}</span> <span className="command">{line.command}</span>
            </div>
            <p>{line.output}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TagList({ tags, variant }: { tags: string[]; variant?: 'colorful' }) {
  return (
    <div className={`tag-list${variant ? ` ${variant}` : ''}`}>
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}

export default App;
