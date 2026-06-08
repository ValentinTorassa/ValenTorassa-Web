import { motion } from 'framer-motion';
import {
  BookOpen,
  BriefcaseBusiness,
  Calendar,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  ShieldCheck,
  Terminal,
  Youtube,
} from 'lucide-react';
import portrait from './assets/portrait-dark.png';
import vtMark from './assets/vt-mark.png';

const navItems = [
  { label: 'Perfil', href: '#profile' },
  { label: 'Experiencia', href: '#experience' },
  { label: 'Stack', href: '#stack' },
  { label: 'Investigacion', href: '#research' },
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
    href: 'https://www.youtube.com/@vtcodingbyte',
    icon: Youtube,
  },
  {
    name: 'Email',
    href: 'mailto:valentintorassacolombero@gmail.com',
    icon: Mail,
  },
];

const terminalLines = [
  { prompt: '$', command: 'whoami', output: 'Valentin Torassa Colombero' },
  {
    prompt: '$',
    command: 'cat ./current-role.txt',
    output: 'AWS security, ISO 27001, SOC 2',
  },
  {
    prompt: '$',
    command: 'stack --core',
    output: 'Linux, cloud, backend, research',
  },
  {
    prompt: '$',
    command: 'contact --location',
    output: 'Rosario, Argentina · remoto-friendly',
  },
];

const stats = [
  { value: '3+', label: 'roles activos' },
  { value: '5', label: 'investigaciones' },
  { value: '4', label: 'certificaciones' },
  { value: 'UAI', label: 'sistemas' },
];

const facts = [
  {
    key: 'now',
    title: 'Cybersecurity & Compliance Analyst',
    text: 'Teramot · seguridad cloud, datos sensibles, ISO/IEC 27001 y SOC 2.',
  },
  {
    key: 'dev',
    title: 'Software builder',
    text: 'Backend, .NET, React, TypeScript, PostgreSQL y automatizacion aplicada.',
  },
  {
    key: 'edu',
    title: 'Ingenieria en Sistemas',
    text: 'UAI · Rosario · carrera en curso con base tecnica y academica.',
  },
];

const experiences = [
  {
    role: 'Cybersecurity & Compliance Analyst',
    company: 'Teramot',
    period: 'jun. 2025 - actualidad',
    description:
      'Estructuracion del area de ciberseguridad, proteccion de datos sensibles, cumplimiento ISO/SOC y fortalecimiento de seguridad en AWS.',
    tags: ['ISO/IEC 27001', 'SOC 2', 'AWS Security', 'Compliance', 'Data Protection'],
  },
  {
    role: 'Analista de Ciberseguridad',
    company: 'Consulting IT',
    period: 'sept. 2024 - jul. 2025',
    description:
      'Operacion de seguridad, hardening, redes hibridas, Sophos Central, Avast Business y monitoreo con Nagios.',
    tags: ['SOC', 'Hardening', 'Sophos', 'Networking', 'Nagios'],
  },
  {
    role: 'Cofundador y Developer .NET',
    company: 'FVM Systems',
    period: 'jul. 2024 - actualidad',
    description:
      'Desarrollo de soluciones empresariales, arquitectura de software y producto de trazabilidad para procesos productivos.',
    tags: ['.NET', 'C#', 'Architecture', 'PostgreSQL', 'Software Factory'],
  },
];

const education = [
  {
    title: 'Ingenieria en Sistemas',
    place: 'Universidad Abierta Interamericana',
    period: '2022 - 2026',
    status: 'En curso',
  },
  {
    title: 'Analista en Sistemas',
    place: 'Universidad Abierta Interamericana',
    period: '2022 - dic. 2024',
    status: 'Completado',
  },
  {
    title: 'Tecnico Electromecanico',
    place: 'EETP No. 292',
    period: '2018 - 2022',
    status: 'Completado',
  },
];

const certifications = [
  'HCIA Datacom - Huawei Talents',
  'Formacion avanzada en AWS',
  'CISSP - en preparacion',
  'FCE Cambridge English - en preparacion',
];

const stackGroups = [
  {
    title: 'Ciberseguridad',
    text: 'Hardening, SIEM, alertas, compliance y gestion de controles.',
    tags: ['ISO 27001', 'SOC 2', 'SIEM', 'Hardening', 'Data Protection'],
  },
  {
    title: 'Cloud',
    text: 'AWS para seguridad, redes, identidad, servicios gestionados e infraestructura.',
    tags: ['IAM', 'VPC', 'EC2', 'Config', 'Cloud Security', 'Docker'],
  },
  {
    title: 'Redes & Linux',
    text: 'Administracion, troubleshooting, VPNs y operacion de sistemas reales.',
    tags: ['Linux', 'Bash', 'Huawei', 'MikroTik', 'WireGuard', 'Networking'],
  },
  {
    title: 'Desarrollo',
    text: 'APIs, UI, bases de datos y automatizacion para productos internos.',
    tags: ['C#', 'ASP.NET Core', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
  },
];

const research = [
  'Dockerizacion de Servidores SCADA: Ciberseguridad Industrial - WICC 2025',
  'Reverse Shell para Pruebas de Penetracion - CACIC 2024',
  'Botnets: Estado del Arte y Taxonomia - JAIIO 53',
  'Monolitos vs Microservicios en Arquitectura de Software - JAIIO 53',
  'Seguridad en Redes WiFi: Deteccion y Expulsion de Intrusos - WICC 2024',
];

const courses = [
  'Ayudante de Catedra en Sistemas Operativos - UAI',
  'Colaboracion previa en Arquitectura de Computadoras II',
  'Contenido tecnico en ciberseguridad, Linux, cloud y carrera IT',
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
          {socialLinks.slice(0, 3).map((link) => (
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
          <motion.div
            className="hero-inner"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="status-pill">
              <span className="status-dot" />
              Disponible para proyectos
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
              Cybersecurity & Compliance · Cloud · Backend
            </p>

            <TerminalCard title="vt@security:~/career" lines={terminalLines} />

            <div className="hero-actions">
              <a className="btn btn-primary" href="mailto:valentintorassacolombero@gmail.com">
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

            <div className="hero-stats" aria-label="Resumen de CV">
              {stats.map((stat) => (
                <span key={stat.label}>
                  <strong>{stat.value}</strong>
                  {stat.label}
                </span>
              ))}
            </div>

          </motion.div>
        </section>

        <div className="strip" aria-hidden="true">
          <div className="strip-track">
            {['LINUX', 'AWS', 'COMPLIANCE', 'BACKEND', 'NETWORKING', 'RESEARCH', 'AUTOMATION'].map((item) => (
              <span key={item}>{item}</span>
            ))}
            {['LINUX', 'AWS', 'COMPLIANCE', 'BACKEND', 'NETWORKING', 'RESEARCH', 'AUTOMATION'].map((item) => (
              <span key={`${item}-copy`}>{item}</span>
            ))}
          </div>
        </div>

        <section className="section" id="profile">
          <div className="section-head">
            <span className="eyebrow">// perfil</span>
            <h2>Construyo, opero y aseguro sistemas reales.</h2>
            <p>
              Perfil hibrido entre ciberseguridad, compliance, cloud, redes y desarrollo. La base es
              entender la infraestructura por debajo antes de automatizarla, defenderla o explicarla.
            </p>
          </div>

          <div className="profile-grid">
            <motion.div className="statement" {...reveal}>
              <p>
                Trabajo sobre controles, datos sensibles, hardening y arquitectura cloud, pero tambien
                construyo software. Esa mezcla permite conectar riesgo, producto e infraestructura sin
                perder el detalle tecnico.
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
              <ul className="clean-list">
                {certifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <section className="section section-raised" id="stack">
          <div className="section-head">
            <span className="eyebrow">// stack</span>
            <h2>Herramientas que uso en serio</h2>
            <p>Sin barras de progreso: tecnologias y practicas aplicadas en trabajo, proyectos y research.</p>
          </div>

          <div className="skill-grid">
            {stackGroups.map((group) => (
              <motion.article className="skill-card" key={group.title} {...reveal}>
                <h3>{group.title}</h3>
                <p>{group.text}</p>
                <TagList tags={group.tags} />
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section split-section" id="research">
          <div className="section-head compact">
            <span className="eyebrow">// research & docencia</span>
            <h2>Investigar, documentar y enseñar</h2>
          </div>

          <div className="split-grid">
            <motion.div className="panel" {...reveal}>
              <div className="panel-title">
                <BookOpen aria-hidden="true" />
                <h3>Investigaciones</h3>
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
                <h3>Docencia y contenido</h3>
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
          <h2>Listo para conversar sobre seguridad, cloud o backend.</h2>
          <p>
            Rosario, Argentina · disponible para proyectos remotos, colaboraciones tecnicas y roles
            donde la seguridad tenga impacto real.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="mailto:valentintorassacolombero@gmail.com">
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

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}

export default App;
