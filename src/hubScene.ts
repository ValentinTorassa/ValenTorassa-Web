/**
 * The 3D backdrop of /charlas: a floor grid that fades into the dark and a
 * figure drawn with dots, like an LED display, that re-forms into each talk's
 * icon. The icon is rasterized from its SVG and sampled on a regular grid, so
 * the dots keep the even spacing of a dot-matrix sign.
 *
 * Loaded on demand (three.js is heavy); if WebGL is not there, the page keeps
 * its flat background and nothing else changes.
 */
type Three = typeof import('./threeRuntime');

const GRID = 60;          // sampling grid for an icon (dots per side, at most)
const MAX_DOTS = 2400;    // dots in the figure; unused ones stack on used ones
const DISC_DOTS = 520;    // the mint disc under the figure
const MORPH_SECONDS = 1.1;

export type HubScene = {
  setIcon: (svgMarkup: string) => void;
  dispose: () => void;
};

/** Sample the icon on a GRID×GRID lattice: a dot wherever the stroke covers the cell. */
async function sampleIcon(svgMarkup: string): Promise<Array<[number, number]>> {
  const svg = svgMarkup
    .replace(/stroke-width="[^"]*"/, 'stroke-width="2.9"')
    .replace(/stroke="currentColor"/, 'stroke="#fff"');
  // Lucide already writes the namespace; a second one makes the SVG invalid.
  const markup = svg.includes('xmlns=') ? svg : svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  const size = GRID * 4;
  const image = new Image();
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  context.drawImage(image, 0, 0, size, size);
  const { data } = context.getImageData(0, 0, size, size);
  const cell = size / GRID;
  const points: Array<[number, number]> = [];

  for (let row = 0; row < GRID; row += 1) {
    for (let col = 0; col < GRID; col += 1) {
      const x = Math.floor((col + 0.5) * cell);
      const y = Math.floor((row + 0.5) * cell);
      if (data[(y * size + x) * 4 + 3] > 110) points.push([col / (GRID - 1) * 2 - 1, 1 - row / (GRID - 1) * 2]);
    }
  }

  return points;
}

function dotTexture(THREE: Three) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#fff';
  context.beginPath();
  context.arc(32, 32, 26, 0, Math.PI * 2);
  context.fill();
  return new THREE.CanvasTexture(canvas);
}

export async function createHubScene(canvas: HTMLCanvasElement, reducedMotion: boolean): Promise<HubScene | null> {
  const THREE = await import('./threeRuntime');
  let renderer: InstanceType<Three['WebGLRenderer']>;

  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x090b10, 0.075);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  camera.position.set(0, 1.1, 8);
  camera.lookAt(0, 0.35, 0);

  // Floor: a wide grid of thin lines that the fog swallows in the distance.
  const lines: number[] = [];
  const floorY = -2.1;
  for (let x = -40; x <= 40; x += 1.6) lines.push(x, floorY, 8, x, floorY, -60);
  for (let z = 8; z >= -60; z -= 1.6) lines.push(-40, floorY, z, 40, floorY, z);
  const floorGeometry = new THREE.BufferGeometry();
  floorGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lines), 3));
  const floor = new THREE.LineSegments(floorGeometry, new THREE.LineBasicMaterial({ color: 0x1d2432, transparent: true, opacity: 0.85 }));
  scene.add(floor);

  const sprite = dotTexture(THREE);
  const figure = new THREE.Group();
  figure.position.set(-1.35, 2.35, -1.6);
  scene.add(figure);

  // The icon figure: violet dots that travel from one shape to the next.
  const positions = new Float32Array(MAX_DOTS * 3);
  const from = new Float32Array(MAX_DOTS * 3);
  const to = new Float32Array(MAX_DOTS * 3);
  const delay = new Float32Array(MAX_DOTS);
  for (let i = 0; i < MAX_DOTS; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 3;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius * 0.5;
    positions[i * 3 + 2] = -2 - Math.random() * 3;
    delay[i] = Math.random() * 0.35;
  }
  from.set(positions);
  to.set(positions);
  const iconGeometry = new THREE.BufferGeometry();
  iconGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const iconMaterial = new THREE.PointsMaterial({
    color: 0x7c82f2, size: 0.05, map: sprite, transparent: true, alphaTest: 0.35, depthWrite: false, fog: false, opacity: 0.55,
  });
  figure.add(new THREE.Points(iconGeometry, iconMaterial));

  // A mint disc of dots beneath it, the second shape of the composition.
  const disc = new Float32Array(DISC_DOTS * 3);
  const discRows = Math.ceil(Math.sqrt(DISC_DOTS / 0.785));
  let d = 0;
  for (let row = 0; row < discRows && d < DISC_DOTS; row += 1) {
    for (let col = 0; col < discRows && d < DISC_DOTS; col += 1) {
      const x = col / (discRows - 1) * 2 - 1;
      const y = row / (discRows - 1) * 2 - 1;
      if (x * x + y * y > 1) continue;
      disc[d * 3] = x * 0.5 + 1.65;
      disc[d * 3 + 1] = y * 0.5 + 0.55;
      disc[d * 3 + 2] = 0;
      d += 1;
    }
  }
  const discGeometry = new THREE.BufferGeometry();
  discGeometry.setAttribute('position', new THREE.BufferAttribute(disc.subarray(0, d * 3), 3));
  const discMaterial = new THREE.PointsMaterial({
    color: 0x7fe0c3, size: 0.042, map: sprite, transparent: true, alphaTest: 0.35, depthWrite: false, fog: false, opacity: 0.6,
  });
  figure.add(new THREE.Points(discGeometry, discMaterial));

  let morphStart = -1;
  let pending = 0;
  const start = performance.now();
  const elapsed = () => (performance.now() - start) / 1000;

  async function setIcon(svgMarkup: string) {
    const ticket = (pending += 1);
    let points: Array<[number, number]>;
    try {
      points = await sampleIcon(svgMarkup);
    } catch {
      return;
    }
    if (ticket !== pending || points.length === 0) return;

    from.set(positions);
    const scale = 1.05;
    for (let i = 0; i < MAX_DOTS; i += 1) {
      // Every dot gets a place: past the icon's own count they double up on it.
      const [x, y] = points[i < points.length ? i : Math.floor(Math.random() * points.length)];
      to[i * 3] = x * scale;
      to[i * 3 + 1] = y * scale;
      to[i * 3 + 2] = 0;
    }
    morphStart = reducedMotion ? -1 : elapsed();
    if (reducedMotion) positions.set(to);
    iconGeometry.attributes.position.needsUpdate = true;
  }

  const pointer = { x: 0, y: 0 };
  const onPointer = (event: PointerEvent) => {
    pointer.x = event.clientX / window.innerWidth - 0.5;
    pointer.y = event.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener('pointermove', onPointer);

  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    // On a narrow screen the figure moves to the middle, above the text.
    figure.position.x = camera.aspect < 1 ? -0.4 : -1.35;
    figure.scale.setScalar(camera.aspect < 1 ? 0.75 : 1);
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let frame = 0;
  const tick = () => {
    const time = elapsed();

    if (morphStart >= 0) {
      let done = true;
      for (let i = 0; i < MAX_DOTS; i += 1) {
        const t = Math.min(1, Math.max(0, (time - morphStart - delay[i]) / MORPH_SECONDS));
        if (t < 1) done = false;
        const k = ease(t);
        for (let a = 0; a < 3; a += 1) positions[i * 3 + a] = from[i * 3 + a] + (to[i * 3 + a] - from[i * 3 + a]) * k;
      }
      iconGeometry.attributes.position.needsUpdate = true;
      if (done) morphStart = -1;
    }

    if (!reducedMotion) {
      figure.rotation.y = Math.sin(time * 0.25) * 0.12 + pointer.x * 0.25;
      figure.rotation.x = pointer.y * 0.12;
      figure.position.y = 2.35 + Math.sin(time * 0.6) * 0.06;
      floor.position.z = (time * 0.35) % 1.6;
    }

    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };
  tick();

  return {
    setIcon: (svgMarkup: string) => {
      void setIcon(svgMarkup);
    },
    dispose: () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointer);
      floorGeometry.dispose();
      iconGeometry.dispose();
      discGeometry.dispose();
      sprite.dispose();
      renderer.dispose();
    },
  };
}
