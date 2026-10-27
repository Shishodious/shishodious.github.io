import { createQuad, NOISE } from "./gl";

// A veil that burns across the screen along a noise edge, rising from the
// bottom, with a thin accent-coloured ember line at the burn front.
// progress 0 = clear, 1 = fully covered.
const FRAGMENT = `
precision mediump float;
uniform vec2 uRes;
uniform float uProgress;
uniform float uSeed;
uniform vec3 uColor;
uniform vec3 uEdge;
${NOISE}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y) * 2.6;

  // Lower values burn first: noise, biased so the veil climbs from the bottom.
  float v = fbm(p + uSeed) * 0.55 + uv.y * 0.45;
  float front = uProgress * 1.24 - 0.12;

  float cover = smoothstep(v - 0.012, v + 0.012, front);
  float ember = smoothstep(v - 0.07, v, front) * (1.0 - cover);

  vec3 col = mix(uEdge, uColor, cover);
  float a = max(cover, ember * 0.9);
  gl_FragColor = vec4(col * a, a);
}
`;

/**
 * Prepares the dissolve on `canvas`. Returns null without WebGL.
 * `draw(progress, colors)` renders one frame; `reseed()` varies the pattern.
 */
export const createDissolve = (canvas) => {
  const quad = createQuad(canvas, FRAGMENT, { scale: 0.6, alpha: true });
  if (!quad) return null;

  quad.set1("uSeed", Math.random() * 100);

  return {
    draw(progress, { bg, accent }) {
      quad.set1("uProgress", progress);
      quad.set3("uColor", bg);
      quad.set3("uEdge", accent);
      quad.draw();
    },
    reseed: () => quad.set1("uSeed", Math.random() * 100),
    destroy: quad.destroy,
  };
};
