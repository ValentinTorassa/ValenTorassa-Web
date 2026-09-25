import type { Localized, Talk } from './events';
import type { TalkMedia } from './talkMedia';

/**
 * Published research, for /charlas: papers in proceedings and WICC posters.
 *
 * Each one links its public page: the JAIIO journal or SEDICI, the UNLP
 * repository. A paper presented in a talk of events.ts hangs from that talk
 * (`talk`): the talk keeps its Tux and its card, and shows the paper's first
 * page and a "Read the paper" button. The rest get their own card in the hub,
 * with the first page of the paper as the picture (public/charlas/<id>/still.webp
 * and thumb.webp, email lines painted over).
 *
 * Titles are copied as published. Only works with a public page go here.
 */
export type Paper = {
  /** Stable slug, also the hub URL: /charlas/<id>. */
  id: string;
  kind: 'paper' | 'poster';
  /** ISO `YYYY-MM-DD`: the first day of the event, or of its month with `datePrecision`. */
  date: string;
  datePrecision?: Talk['datePrecision'];
  /** Event, shown on the card, e.g. "WICC 2025". */
  venue: string;
  track?: string;
  city?: string;
  title: Localized;
  /** As published, the author first. */
  authors: string[];
  /** Public page of the paper. */
  url: string;
  /** The talk in events.ts where it was presented. */
  talk?: string;
};

const same = (title: string): Localized => ({ es: title, en: title });

export const papers: Paper[] = [
  {
    id: 'sacs-jaiio-2024-botnets',
    kind: 'paper',
    date: '2024-08-01',
    datePrecision: 'month',
    venue: 'SACS / 53 JAIIO',
    title: same('Botnets: estado del arte y taxonomía de una amenaza sigilosa'),
    authors: ['Valentín Torassa Colombero', 'Santiago Roatta', 'Pedro Lopez'],
    url: 'https://revistas.unlp.edu.ar/JAIIO/article/view/17896',
    talk: 'sacs-jaiio-2024',
  },
  {
    id: 'cacic-2024-reverse-shell',
    kind: 'paper',
    date: '2024-10-07',
    venue: 'CACIC 2024',
    title: same('Análisis y Desarrollo de Herramientas de Reverse Shell para Pruebas de Penetración'),
    authors: ['Valentín Torassa Colombero', 'María Eugenia Casco', 'Santiago Roatta'],
    url: 'https://sedici.unlp.edu.ar/handle/10915/176994',
    talk: 'cacic-2024',
  },
  {
    id: 'wicc-2024-wifi',
    kind: 'poster',
    date: '2024-04-18',
    venue: 'WICC 2024',
    city: 'Puerto Madryn',
    title: same('Seguridad en redes WiFi: estrategias de detección y expulsión de intrusos'),
    authors: ['Valentín Torassa Colombero', 'Juan Pablo Estelles', 'Santiago Roatta', 'María Eugenia Casco'],
    url: 'https://sedici.unlp.edu.ar/handle/10915/180035',
  },
  {
    id: 'jaiio-2024-monolitos-microservicios',
    kind: 'paper',
    date: '2024-08-01',
    datePrecision: 'month',
    venue: '53 JAIIO',
    track: 'EST',
    city: 'Bahía Blanca',
    title: same('Monolitos vs. Microservicios en Arquitectura de Software: Perspectivas para un Desarrollo Eficiente'),
    authors: ['Valentín Torassa Colombero', 'Juan Pablo Estelles', 'Laureano Gallegos', 'Pedro Lopez'],
    url: 'https://revistas.unlp.edu.ar/JAIIO/article/view/17984',
  },
  {
    id: 'wicc-2025-scada',
    kind: 'poster',
    date: '2025-04-10',
    venue: 'WICC 2025',
    city: 'Mendoza',
    title: same('Dockerización de servidores SCADA: ciberseguridad industrial'),
    authors: ['Valentín Torassa Colombero', 'Santiago Roatta', 'María Eugenia Casco'],
    url: 'https://sedici.unlp.edu.ar/handle/10915/183861',
  },
  {
    id: 'sacs-2025-vpn-cgnat',
    kind: 'paper',
    date: '2025-08-01',
    datePrecision: 'month',
    venue: 'SACS / 54 JAIIO',
    city: 'Buenos Aires',
    title: same('Soluciones Open Source para VPNs a través de CGNAT: Alternativas P2P'),
    authors: ['Valentín Torassa Colombero', 'Santiago Roatta', 'María Eugenia Casco'],
    url: 'https://revistas.unlp.edu.ar/JAIIO/article/view/20074',
  },
];

export const paperOfTalk = (talkId: string) => papers.find((paper) => paper.talk === talkId);

/** The first page of a paper with its own card, framed like the talks' Tux. */
export const paperMedia = (paper: Paper): TalkMedia => ({
  icon: 'book',
  still: `/charlas/${paper.id}/still.webp`,
  thumb: `/charlas/${paper.id}/thumb.webp`,
});
