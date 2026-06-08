import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
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
import type { LucideIcon } from 'lucide-react';
import portrait from './assets/portrait-dark.png';
import awsLogo from './assets/certs/aws.svg';
import comptiaLogo from './assets/certs/comptia.svg';
import huaweiLogo from './assets/certs/huawei.svg';
import linuxFoundationLogo from './assets/certs/linuxfoundation.svg';
import instagramLogo from './assets/socials/instagram.svg';
import tiktokLogo from './assets/socials/tiktok.svg';
import xLogo from './assets/socials/x.svg';
import dockerLogo from './assets/stack/docker.svg';
import goLogo from './assets/stack/go.svg';
import jwtLogo from './assets/stack/jwt.svg';
import linuxLogo from './assets/stack/linux.svg';
import mikrotikLogo from './assets/stack/mikrotik.svg';
import natsLogo from './assets/stack/nats.svg';
import openApiLogo from './assets/stack/openapi.svg';
import openIdLogo from './assets/stack/openid.svg';
import postgresqlLogo from './assets/stack/postgresql.svg';
import terraformLogo from './assets/stack/terraform.svg';
import wireguardLogo from './assets/stack/wireguard.svg';
import vtMark from './assets/vt-mark.png';

const navItems = [
  { label: 'Perfil', href: '#profile' },
  { label: 'Experiencia', href: '#experience' },
  { label: 'Stack', href: '#stack' },
  { label: 'Reconocimiento', href: '#research' },
  { label: 'Contacto', href: '#contact' },
];

type SocialLink = {
  name: string;
  href: string;
} & ({ icon: LucideIcon; logo?: never } | { logo: string; icon?: never });

const socialLinks: SocialLink[] = [
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
    name: 'TikTok',
    href: 'https://tiktok.com/@vtsecurity',
    logo: tiktokLogo,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/vtsecurity',
    logo: instagramLogo,
  },
  {
    name: 'X',
    href: 'https://x.com/ValenSecurity',
    logo: xLogo,
  },
  {
    name: 'Email',
    href: 'mailto:valentin.torassa.colombero@gmail.com',
    icon: Mail,
  },
];

const headerSocialLinks = socialLinks.filter((link) =>
  ['YouTube', 'TikTok', 'Instagram', 'X'].includes(link.name),
);

const terminalLines = [
  { prompt: '$', command: 'whoami', output: 'Cybersecurity Engineer + Backend Engineer' },
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
    tags: [
      { label: 'ECS/Fargate', logo: awsLogo },
      { label: 'IAM', logo: awsLogo },
      { label: 'SSO Admin', logo: awsLogo },
      { label: 'Secrets Manager', logo: awsLogo },
      { label: 'CloudTrail', logo: awsLogo },
      { label: 'GuardDuty', logo: awsLogo },
      { label: 'VPC', logo: awsLogo },
      { label: 'Terraform', logo: terraformLogo },
    ],
    tone: 'cloud',
  },
  {
    title: 'Compliance engineering',
    text: 'Controles implementados en sistemas, evidencia, poblaciones de auditoria y remediacion tecnica.',
    tags: [
      'SOC 2 Type II',
      'ISO/IEC 27001',
      'ISMS/SGSI',
      'Audit Evidence',
      { label: 'OIDC', logo: openIdLogo },
      { label: 'Secrets Handling', logo: awsLogo },
    ],
    tone: 'compliance',
  },
  {
    title: 'Backend architecture',
    text: 'Servicios Go para APIs, eventos, autenticacion, observabilidad y contratos compartidos con frontend.',
    tags: [
      { label: 'Go', logo: goLogo },
      { label: 'chi', logo: goLogo },
      { label: 'AWS SDK v2', logo: awsLogo },
      { label: 'NATS', logo: natsLogo },
      { label: 'pgx', logo: postgresqlLogo },
      'Atlas',
      { label: 'JWT/JWKS', logo: jwtLogo },
      { label: 'OpenAPI', logo: openApiLogo },
    ],
    tone: 'backend',
  },
  {
    title: 'Systems & networks',
    text: 'Administracion Linux, redes, VPNs, firewalls, monitoreo y troubleshooting operativo.',
    tags: [
      { label: 'Linux', logo: linuxLogo },
      'TCP/IP',
      { label: 'WireGuard', logo: wireguardLogo },
      { label: 'MikroTik', logo: mikrotikLogo },
      'Sophos',
      'Nagios',
      { label: 'Docker', logo: dockerLogo },
    ],
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
          {headerSocialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              title={link.name}
            >
              <SocialIcon link={link} />
            </a>
          ))}
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <HeroScene />
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

            <div className="hero-socials" aria-label="Redes y contacto">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">
                  <SocialIcon link={link} />
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
            <h2>Arquitectura de software, backend, cloud security y compliance tecnico.</h2>
            <p>
              Combino experiencia en arquitectura de software, desarrollo backend, seguridad cloud,
              Linux, redes y compliance para construir y operar sistemas con criterios de seguridad
              desde el diseno. Trabajo especialmente sobre identidad, permisos, datos sensibles,
              auditoria, observabilidad, infraestructura y confiabilidad operativa.
            </p>
          </div>

          <div className="profile-grid">
            <motion.div className="statement" {...reveal}>
              <p>
                En Teramot desarrollo backend en Go para Aleph, trabajo sobre arquitectura y seguridad
                en AWS, y llevo requisitos SOC 2 e ISO/IEC 27001 a implementaciones tecnicas
                verificables.
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

function HeroScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;

    if (!container) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.35));
    container.appendChild(renderer.domElement);

    const topology = new THREE.Group();
    topology.position.set(0, -0.42, -0.35);
    scene.add(topology);

    const disposables: Array<{ dispose: () => void }> = [];
    const teal = new THREE.LineBasicMaterial({
      color: 0x54e6d6,
      transparent: true,
      opacity: 0.36,
    });
    const cyan = new THREE.LineBasicMaterial({
      color: 0x54e6d6,
      transparent: true,
      opacity: 0.5,
    });
    const linkMaterial = new THREE.LineBasicMaterial({
      color: 0x54e6d6,
      transparent: true,
      opacity: 0.22,
    });
    const violet = new THREE.LineBasicMaterial({
      color: 0x8b7cff,
      transparent: true,
      opacity: 0.46,
    });
    const amber = new THREE.LineBasicMaterial({
      color: 0xf0b45b,
      transparent: true,
      opacity: 0.4,
    });
    const vertexMaterial = new THREE.PointsMaterial({
      color: 0x54e6d6,
      transparent: true,
      opacity: 0.62,
      size: 0.032,
      sizeAttenuation: true,
    });
    const surfaceMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b7cff,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const packetMaterial = new THREE.MeshBasicMaterial({
      color: 0x54e6d6,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const packetAltMaterial = new THREE.MeshBasicMaterial({
      color: 0xf0b45b,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    });
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x54e6d6,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    });
    disposables.push(
      teal,
      cyan,
      linkMaterial,
      violet,
      amber,
      vertexMaterial,
      surfaceMaterial,
      packetMaterial,
      packetAltMaterial,
      nodeMaterial,
    );

    const grid = new THREE.GridHelper(18, 52, 0x54e6d6, 0x243352);
    grid.position.y = -2.65;
    grid.position.z = -1.2;
    grid.rotation.x = 0.12;
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMaterials.forEach((material) => {
      material.transparent = true;
      material.opacity = 0.34;
      disposables.push(material);
    });
    topology.add(grid);

    const vertexPositions = new Float32Array(126);
    for (let index = 0; index < vertexPositions.length; index += 3) {
      const seed = index + 1;
      const side = seed % 2 === 0 ? -1 : 1;
      vertexPositions[index] = side * (2.25 + ((Math.sin(seed * 14.1) + 1) * 1.55));
      vertexPositions[index + 1] = -1.75 + ((Math.sin(seed * 9.7) + 1) * 2.15);
      vertexPositions[index + 2] = -2.4 - ((Math.sin(seed * 5.3) + 1) * 1.45);
    }
    const vertexGeometry = new THREE.BufferGeometry();
    vertexGeometry.setAttribute('position', new THREE.BufferAttribute(vertexPositions, 3));
    const vertexField = new THREE.Points(vertexGeometry, vertexMaterial);
    topology.add(vertexField);
    disposables.push(vertexGeometry);

    const terrainGeometry = new THREE.PlaneGeometry(9.8, 3.2, 14, 5);
    const terrainPosition = terrainGeometry.attributes.position;
    for (let index = 0; index < terrainPosition.count; index += 1) {
      const x = terrainPosition.getX(index);
      const y = terrainPosition.getY(index);
      terrainPosition.setZ(index, Math.sin(x * 1.6 + y * 2.2) * 0.12);
    }
    terrainPosition.needsUpdate = true;
    const terrainEdges = new THREE.EdgesGeometry(terrainGeometry);
    const terrain = new THREE.LineSegments(terrainEdges, linkMaterial);
    terrain.position.set(0, -2.3, -2.85);
    terrain.rotation.x = -Math.PI / 2.7;
    topology.add(terrain);
    disposables.push(terrainGeometry, terrainEdges);

    const coreGeometry = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.28, 1));
    const core = new THREE.LineSegments(coreGeometry, violet);
    core.position.set(4.05, -0.15, -2.25);
    topology.add(core);
    disposables.push(coreGeometry);

    const coreSurfaceGeometry = new THREE.IcosahedronGeometry(1.26, 1);
    const coreSurface = new THREE.Mesh(coreSurfaceGeometry, surfaceMaterial);
    coreSurface.position.copy(core.position);
    topology.add(coreSurface);
    disposables.push(coreSurfaceGeometry);

    const ringGeometry = new THREE.EdgesGeometry(new THREE.TorusGeometry(1.65, 0.012, 8, 96));
    const ring = new THREE.LineSegments(ringGeometry, cyan);
    ring.position.set(-4.15, -0.35, -2.35);
    ring.rotation.set(1.2, 0.3, 0.35);
    topology.add(ring);
    disposables.push(ringGeometry);

    const orbitGeometry = new THREE.EdgesGeometry(new THREE.TorusGeometry(1.92, 0.012, 6, 72));
    const orbit = new THREE.LineSegments(orbitGeometry, amber);
    orbit.position.copy(ring.position);
    orbit.rotation.set(0.75, -0.12, -0.58);
    topology.add(orbit);
    disposables.push(orbitGeometry);

    const scanGeometry = new THREE.PlaneGeometry(8.8, 0.018);
    const scanMaterial = new THREE.MeshBasicMaterial({
      color: 0x54e6d6,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });
    const scanLine = new THREE.Mesh(scanGeometry, scanMaterial);
    scanLine.position.set(0, -1.85, -2.8);
    topology.add(scanLine);
    disposables.push(scanGeometry, scanMaterial);

    const cubeSpecs = [
      { position: [-4.35, -0.65, -1.8], scale: [1.15, 0.8, 0.75], material: teal },
      { position: [-2.65, 0.95, -2.6], scale: [0.75, 0.75, 0.75], material: amber },
      { position: [4.2, -1.08, -2.45], scale: [1.2, 0.72, 0.95], material: teal },
      { position: [2.35, 1.18, -3.15], scale: [0.82, 0.82, 0.82], material: amber },
    ] as const;

    const cubes: THREE.LineSegments[] = [];
    cubeSpecs.forEach((spec) => {
      const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(spec.scale[0], spec.scale[1], spec.scale[2]));
      const cube = new THREE.LineSegments(geometry, spec.material);
      cube.position.set(spec.position[0], spec.position[1], spec.position[2]);
      topology.add(cube);
      cubes.push(cube);
      disposables.push(geometry);
    });

    const linkSegments = [
      { from: [-4.35, -0.65, -1.8], to: [-2.65, 0.95, -2.6] },
      { from: [-2.65, 0.95, -2.6], to: [0.0, -0.42, -2.25] },
      { from: [0.0, -0.42, -2.25], to: [2.35, 1.18, -3.15] },
      { from: [0.0, -0.42, -2.25], to: [4.2, -1.08, -2.45] },
      { from: [-4.35, -0.65, -1.8], to: [4.2, -1.08, -2.45] },
      { from: [-4.15, -0.35, -2.35], to: [4.05, -0.15, -2.25] },
    ] as const;
    const linkPositions = new Float32Array(
      linkSegments.flatMap((segment) => [...segment.from, ...segment.to]),
    );
    const linkGeometry = new THREE.BufferGeometry();
    linkGeometry.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3));
    const links = new THREE.LineSegments(linkGeometry, linkMaterial);
    topology.add(links);
    disposables.push(linkGeometry);

    const packetGeometry = new THREE.OctahedronGeometry(0.055, 0);
    const packets = linkSegments.map((segment, index) => {
      const packet = new THREE.Mesh(packetGeometry, index % 2 === 0 ? packetMaterial : packetAltMaterial);
      topology.add(packet);

      return {
        mesh: packet,
        from: new THREE.Vector3(segment.from[0], segment.from[1], segment.from[2]),
        to: new THREE.Vector3(segment.to[0], segment.to[1], segment.to[2]),
        offset: index / linkSegments.length,
      };
    });
    disposables.push(packetGeometry);

    const nodeGeometry = new THREE.OctahedronGeometry(0.075, 0);
    const nodePositions = [
      [-4.35, -0.65, -1.8],
      [-2.65, 0.95, -2.6],
      [0.0, -0.42, -2.25],
      [2.35, 1.18, -3.15],
      [4.2, -1.08, -2.45],
      [-4.15, -0.35, -2.35],
      [4.05, -0.15, -2.25],
    ] as const;
    const nodes = nodePositions.map((position) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(position[0], position[1], position[2]);
      topology.add(node);
      return node;
    });
    disposables.push(nodeGeometry);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.set(0, width < 700 ? 0.15 : 0.3, width < 700 ? 8.6 : 7.2);
      camera.updateProjectionMatrix();
      topology.scale.setScalar(width < 700 ? 0.76 : 1);
    };

    const pointerTarget = { x: 0, y: 0 };
    const handlePointerMove = (event: PointerEvent) => {
      pointerTarget.y = ((event.clientX / window.innerWidth) - 0.5) * 0.12;
      pointerTarget.x = ((event.clientY / window.innerHeight) - 0.5) * -0.055;
    };

    let frame = 0;
    const clock = new THREE.Clock();
    const render = () => {
      const elapsed = clock.getElapsedTime();
      topology.rotation.y += (Math.sin(elapsed * 0.16) * 0.08 + pointerTarget.y - topology.rotation.y) * 0.045;
      topology.rotation.x += (Math.sin(elapsed * 0.11) * 0.018 + pointerTarget.x - topology.rotation.x) * 0.045;
      core.rotation.x = elapsed * 0.18;
      core.rotation.y = elapsed * 0.25;
      coreSurface.rotation.copy(core.rotation);
      ring.rotation.z = elapsed * 0.09;
      ring.rotation.y = 0.3 + Math.sin(elapsed * 0.22) * 0.18;
      orbit.rotation.x = 0.75 + Math.sin(elapsed * 0.18) * 0.12;
      orbit.rotation.z = -0.58 - elapsed * 0.08;
      vertexField.rotation.y = Math.sin(elapsed * 0.08) * 0.04;
      terrain.position.y = -2.3 + Math.sin(elapsed * 0.42) * 0.025;
      scanLine.position.y = -2.25 + ((elapsed * 0.38) % 4.2);
      scanMaterial.opacity = 0.16 + Math.sin(elapsed * 2.2) * 0.07;
      packets.forEach((packet, index) => {
        const progress = (elapsed * (0.08 + index * 0.008) + packet.offset) % 1;
        packet.mesh.position.lerpVectors(packet.from, packet.to, progress);
        packet.mesh.rotation.set(elapsed * 0.8, elapsed * 1.1 + index, elapsed * 0.55);
        packet.mesh.scale.setScalar(0.72 + Math.sin((progress + elapsed) * Math.PI * 2) * 0.18);
      });
      nodes.forEach((node, index) => {
        node.scale.setScalar(0.75 + Math.sin(elapsed * 1.7 + index * 0.9) * 0.18);
      });
      cubes.forEach((cube, index) => {
        cube.rotation.x = Math.sin(elapsed * 0.18 + index) * 0.08;
        cube.rotation.y = elapsed * (0.05 + index * 0.012);
      });
      renderer.render(scene, camera);

      if (!prefersReducedMotion) {
        frame = window.requestAnimationFrame(render);
      }
    };

    resize();
    render();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.cancelAnimationFrame(frame);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="hero-scene" ref={mountRef} aria-hidden="true" />;
}

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

function SocialIcon({ link }: { link: SocialLink }) {
  if (link.logo) {
    return <img src={link.logo} alt="" aria-hidden="true" />;
  }

  if (link.icon) {
    const Icon = link.icon;
    return <Icon aria-hidden="true" />;
  }

  return null;
}

type StackTag = string | { label: string; logo?: string };

function TagList({ tags, variant }: { tags: StackTag[]; variant?: 'colorful' }) {
  return (
    <div className={`tag-list${variant ? ` ${variant}` : ''}`}>
      {tags.map((tag) => {
        const item = typeof tag === 'string' ? { label: tag } : tag;

        return (
          <span key={item.label}>
            {item.logo ? <img className="tag-logo" src={item.logo} alt="" aria-hidden="true" /> : null}
            {item.label}
          </span>
        );
      })}
    </div>
  );
}

export default App;
