import { createQuad, NOISE } from "./gl";

// Out-of-focus light drifting over the world's background, like a lens
// pointed at a lamp: three slow blobs, one that trails the pointer, and a
// warm leak along the right edge. Tinted by the world's accent.
const FRAGMENT = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uBase;
uniform vec3 uTint;
uniform float uGlow;
${NOISE}

float blob(vec2 p, vec2 c, float r) {
  vec2 d = p - c;
  return exp(-dot(d, d) / (r * r));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.06;

  // Warp the field a little so the blobs breathe instead of sliding.
  p += 0.08 * vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 7.0)) - 0.04;

  float h = 0.0;
  h += 0.85 * blob(p, vec2(aspect * (0.72 + 0.12 * sin(t * 1.3)), 0.62 + 0.14 * cos(t * 1.1)), 0.42);
  h += 0.55 * blob(p, vec2(aspect * (0.18 + 0.1 * cos(t * 0.9)), 0.18 + 0.12 * sin(t * 1.6)), 0.36);
  h += 0.35 * blob(p, vec2(aspect * (0.45 + 0.2 * sin(t * 0.7)), 0.95), 0.3);
  h += 0.45 * blob(p, vec2(uMouse.x * aspect, uMouse.y), 0.26);

  // Light leak: a soft band bleeding in from the right edge.
  float leak = smoothstep(0.55, 1.05, uv.x + 0.12 * sin(uv.y * 3.0 + t * 2.0));

  vec3 col = mix(uBase, uTint, clamp(h * uGlow, 0.0, 1.0));
  col += uTint * leak * 0.16 * uGlow;

  // Dither so the gradients don't band on 8-bit screens.
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 128.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

const lerp = (a, b, k) => a + (b - a) * k;

/**
 * Starts the haze on `canvas`. `setWorld(colors)` eases to a new palette.
 * Returns null without WebGL (the page keeps its flat background).
 */
export const createHaze = (canvas) => {
  const quad = createQuad(canvas, FRAGMENT, { scale: 0.35 });
  if (!quad) return null;

  const current = { base: null, tint: null, glow: 0.5 };
  const target = { base: [0, 0, 0], tint: [0, 0, 0], glow: 0.5 };
  const mouse = { x: 0.7, y: 0.6, tx: 0.7, ty: 0.6 };
  let frame = null;
  const start = performance.now();

  const onPointer = (e) => {
    mouse.tx = e.clientX / window.innerWidth;
    mouse.ty = 1 - e.clientY / window.innerHeight;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const render = (now) => {
    const k = 0.07;
    current.base = current.base.map((v, i) => lerp(v, target.base[i], k));
    current.tint = current.tint.map((v, i) => lerp(v, target.tint[i], k));
    current.glow = lerp(current.glow, target.glow, k);
    mouse.x = lerp(mouse.x, mouse.tx, 0.04);
    mouse.y = lerp(mouse.y, mouse.ty, 0.04);

    quad.set1("uTime", (now - start) / 1000);
    quad.set2("uMouse", mouse.x, mouse.y);
    quad.set3("uBase", current.base);
    quad.set3("uTint", current.tint);
    quad.set1("uGlow", current.glow);
    quad.draw();
    frame = requestAnimationFrame(render);
  };

  const onVisibility = () => {
    if (document.hidden && frame) {
      cancelAnimationFrame(frame);
      frame = null;
    } else if (!document.hidden && !frame && current.base) {
      frame = requestAnimationFrame(render);
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    setWorld({ bg, accent, glow }) {
      target.base = bg;
      target.tint = accent;
      target.glow = glow;
      if (!current.base) {
        current.base = [...bg];
        current.tint = [...accent];
        current.glow = target.glow;
        frame = requestAnimationFrame(render);
      }
    },
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      quad.destroy();
    },
  };
};
