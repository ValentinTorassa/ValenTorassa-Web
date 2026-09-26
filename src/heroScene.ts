/**
 * The 3D backdrop behind the home hero, on the two sides of the centered
 * text: Tux drawn with dots on the left (from public/icon.png, a colour per
 * part), and on the right a figure of dots that re-forms into a shield, a
 * lock, a terminal and a cloud, like the talk icons on /charlas. The middle
 * of the screen stays dark so the text reads.
 *
 * Loaded on demand with three.js; it pauses while the hero is off screen or
 * the tab is hidden, and draws a single still frame under reduced motion.
 */
import { dotTexture, sampleIcon } from './hubScene';

type Three = typeof import('./threeRuntime');
type SceneQuality = 'full' | 'reduced';

type Pointer = { x: number; y: number };
type Backdrop = {
  update: (elapsed: number, pointer: Pointer) => void;
  resize: (isCompact: boolean) => void;
  dispose: () => void;
};
type BuildContext = {
  THREE: Three;
  scene: InstanceType<Three['Scene']>;
  camera: InstanceType<Three['PerspectiveCamera']>;
  iconMarkup: string[];
};

/* ── the figures ────────────────────────────────────────────────────────── */

const ICON_DOTS = 1500;
const MORPH_SECONDS = 1.3;
const HOLD_SECONDS = 4.5;
const TUX_GRID = 70;

/** Tux's parts, told apart by the colour of public/icon.png, each drawn in one colour of the site. */
const TUX_COLORS = [0x62dfd2, 0xe6edf6, 0xf0b45b, 0x8b95a8]; // body, belly, cheek and chest, beak and feet

/** Sample a picture on a TUX_GRID lattice: a dot per opaque cell, tagged with the part it falls on. */
async function sampleTux(url: string): Promise<Array<[number, number, number]>> {
  const image = new Image();
  image.src = url;
  await image.decode();
  const size = TUX_GRID * 4;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  context.drawImage(image, 0, 0, size, size);
  const { data } = context.getImageData(0, 0, size, size);
  const cell = size / TUX_GRID;
  const dots: Array<[number, number, number]> = [];
  for (let row = 0; row < TUX_GRID; row += 1) {
    for (let col = 0; col < TUX_GRID; col += 1) {
      const x = Math.floor((col + 0.5) * cell);
      const y = Math.floor((row + 0.5) * cell);
      const at = (y * size + x) * 4;
      if (data[at + 3] < 140) continue;
      const [r, g, b] = [data[at], data[at + 1], data[at + 2]];
      const light = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const part = r > 190 && b < 150 && r - b > 60 ? 2 : light > 215 ? 1 : light > 130 ? 3 : 0;
      dots.push([col / (TUX_GRID - 1) * 2 - 1, 1 - row / (TUX_GRID - 1) * 2, part]);
    }
  }
  return dots;
}

async function buildFigures({ THREE, scene, camera, iconMarkup }: BuildContext): Promise<Backdrop> {
  const [tuxDots, ...shapes] = await Promise.all([
    sampleTux('/icon.png'),
    ...iconMarkup.map((markup) => sampleIcon(markup).catch(() => [] as Array<[number, number]>)),
  ]);
  const icons = shapes.filter((points) => points.length > 0);
  if (tuxDots.length === 0 || icons.length < 2) throw new Error('nothing to draw');

  const sprite = dotTexture(THREE);

  // Tux, on the left: still, breathing a little and turning with the pointer.
  const tuxPositions = new Float32Array(tuxDots.length * 3);
  const tuxColors = new Float32Array(tuxDots.length * 3);
  const color = new THREE.Color();
  tuxDots.forEach(([x, y, part], i) => {
    tuxPositions.set([-x * 1.55, y * 1.55, 0], i * 3); // mirrored: Tux faces the text
    color.setHex(TUX_COLORS[part]);
    tuxColors.set([color.r, color.g, color.b], i * 3);
  });
  const tuxGeometry = new THREE.BufferGeometry();
  tuxGeometry.setAttribute('position', new THREE.BufferAttribute(tuxPositions, 3));
  tuxGeometry.setAttribute('color', new THREE.BufferAttribute(tuxColors, 3));
  const tuxMaterial = new THREE.PointsMaterial({
    size: 0.062, map: sprite, vertexColors: true, transparent: true, alphaTest: 0.3, depthWrite: false, opacity: 0.8,
  });
  const tux = new THREE.Group();
  tux.add(new THREE.Points(tuxGeometry, tuxMaterial));
  scene.add(tux);

  // The icons, on the right: a shield, a lock, a terminal and a cloud, one after the other.
  const positions = new Float32Array(ICON_DOTS * 3);
  const from = new Float32Array(ICON_DOTS * 3);
  const to = new Float32Array(ICON_DOTS * 3);
  const place = (target: Float32Array, points: Array<[number, number]>) => {
    for (let i = 0; i < ICON_DOTS; i += 1) {
      const [x, y] = points[i < points.length ? i : (i * 7919) % points.length];
      target[i * 3] = x * 1.3;
      target[i * 3 + 1] = y * 1.3;
      target[i * 3 + 2] = 0;
    }
  };
  let shape = 0;
  place(positions, icons[shape]);
  const iconGeometry = new THREE.BufferGeometry();
  iconGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const iconMaterial = new THREE.PointsMaterial({
    color: 0x9c8cff, size: 0.066, map: sprite, transparent: true, alphaTest: 0.3, depthWrite: false, opacity: 0.8,
  });
  const icon = new THREE.Group();
  icon.add(new THREE.Points(iconGeometry, iconMaterial));
  scene.add(icon);

  let morphStart = -1;
  let lastSwap = 0;
  let isCompact = false;
  let tuxScale = 0.8;

  return {
    update: (elapsed, pointer) => {
      if (elapsed - lastSwap > HOLD_SECONDS) {
        lastSwap = elapsed;
        morphStart = elapsed;
        from.set(positions);
        shape = (shape + 1) % icons.length;
        place(to, icons[shape]);
      }
      if (morphStart >= 0) {
        const t = Math.min(1, (elapsed - morphStart) / MORPH_SECONDS);
        const k = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        for (let i = 0; i < positions.length; i += 1) positions[i] = from[i] + (to[i] - from[i]) * k;
        iconGeometry.attributes.position.needsUpdate = true;
        if (t >= 1) morphStart = -1;
      }
      const baseY = isCompact ? 2.1 : -0.1;
      tux.rotation.y = 0.16 + Math.sin(elapsed * 0.35) * 0.08 + pointer.x * 0.22;
      tux.position.y = baseY + Math.sin(elapsed * 0.8) * 0.05;
      tux.scale.y = tuxScale * (1 + Math.sin(elapsed * 0.8) * 0.012);
      icon.rotation.y = -0.3 - Math.sin(elapsed * 0.3) * 0.12 + pointer.x * 0.2;
      icon.position.y = 0.3 + Math.cos(elapsed * 0.6) * 0.08;
    },
    resize: (compact) => {
      // The figures sit just inside the edges, whatever the screen's shape: half the visible width, less their own.
      // On a phone the text takes the width: Tux goes small above it and the icons step out.
      isCompact = compact;
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
      const halfWidth = Math.tan((camera.fov * Math.PI) / 360) * 8 * camera.aspect;
      const side = Math.min(3.9, halfWidth - 1.35);
      tuxScale = compact ? 0.45 : 0.8;
      tux.scale.setScalar(tuxScale);
      tux.position.x = compact ? 0 : -side;
      icon.scale.setScalar(0.88);
      icon.position.x = side;
      icon.visible = !compact;
    },
    dispose: () => {
      tuxGeometry.dispose();
      iconGeometry.dispose();
      tuxMaterial.dispose();
      iconMaterial.dispose();
      sprite.dispose();
    },
  };
}

/* ── the shared harness ─────────────────────────────────────────────────── */

export async function setupHeroScene(
  THREE: Three,
  container: HTMLDivElement,
  quality: SceneQuality,
  iconMarkup: string[],
): Promise<() => void> {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: quality === 'full',
    powerPreference: quality === 'full' ? 'high-performance' : 'low-power',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const context: BuildContext = { THREE, scene, camera, iconMarkup };
  let parts: Backdrop;
  try {
    parts = await buildFigures(context);
  } catch (error) {
    renderer.dispose();
    throw error;
  }
  container.appendChild(renderer.domElement);

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    const isCompact = width < 700;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'full' ? 1.65 : 1));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    parts.resize(isCompact);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };

  const pointer: Pointer = { x: 0, y: 0 };
  const target: Pointer = { x: 0, y: 0 };
  const handlePointerMove = (event: PointerEvent) => {
    target.x = event.clientX / window.innerWidth - 0.5;
    target.y = event.clientY / window.innerHeight - 0.5;
  };

  let frame = 0;
  let running = false;
  let isIntersecting = true;
  let previousFrameTime = 0;
  const clock = new THREE.Clock(false);
  const render = (frameTime = 0) => {
    if (!running) return;
    if (quality === 'reduced' && frameTime - previousFrameTime < 32) {
      frame = window.requestAnimationFrame(render);
      return;
    }
    previousFrameTime = frameTime;
    pointer.x += (target.x - pointer.x) * 0.05;
    pointer.y += (target.y - pointer.y) * 0.05;
    parts.update(clock.getElapsedTime(), pointer);
    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(render);
  };

  const start = () => {
    if (running || prefersReducedMotion || document.hidden || !isIntersecting) return;
    running = true;
    clock.start();
    frame = window.requestAnimationFrame(render);
  };
  const stop = () => {
    if (!running) return;
    running = false;
    clock.stop();
    window.cancelAnimationFrame(frame);
  };
  const handleVisibility = () => {
    if (document.hidden) stop();
    else start();
  };

  resize();
  parts.update(0, pointer);
  container.classList.add('is-ready');
  if (prefersReducedMotion) renderer.render(scene, camera);
  else start();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const sceneObserver = new IntersectionObserver(
    ([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) start();
      else stop();
    },
    { rootMargin: '160px 0px' },
  );
  sceneObserver.observe(container);
  document.addEventListener('visibilitychange', handleVisibility);
  if (hasFinePointer && !prefersReducedMotion) window.addEventListener('pointermove', handlePointerMove, { passive: true });

  return () => {
    stop();
    resizeObserver.disconnect();
    sceneObserver.disconnect();
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('pointermove', handlePointerMove);
    container.classList.remove('is-ready');
    parts.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
