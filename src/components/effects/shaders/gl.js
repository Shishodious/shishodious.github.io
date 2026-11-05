// Minimal WebGL plumbing shared by the full-screen shaders in this folder.
// Each shader draws one quad covering the canvas; no library needed.

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "shader compile failed");
  }
  return shader;
};

/**
 * Sets up a full-screen fragment shader on `canvas`. Returns null when WebGL
 * is unavailable or the shader fails, so callers can fall back to CSS.
 */
export const createQuad = (canvas, fragment, options) => {
  try {
    return setup(canvas, fragment, options);
  } catch (err) {
    console.warn("[shaders] falling back without WebGL:", err);
    return null;
  }
};

const setup = (canvas, fragment, { scale = 1, alpha = false } = {}) => {
  const gl = canvas.getContext("webgl", { alpha, antialias: false, premultipliedAlpha: true });
  if (!gl || gl.isContextLost()) return null;

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const locations = {};
  const uniform = (name) =>
    (locations[name] ??= gl.getUniformLocation(program, name));

  // Soft effects don't need full resolution; `scale` trades pixels for speed.
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2) * scale;
    const w = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const h = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uniform("uRes"), w, h);
  };

  return {
    gl,
    set1: (name, x) => gl.uniform1f(uniform(name), x),
    set2: (name, x, y) => gl.uniform2f(uniform(name), x, y),
    set3: (name, [r, g, b]) => gl.uniform3f(uniform(name), r, g, b),
    draw: () => {
      resize();
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    // Free GPU objects but keep the context: a remount (StrictMode, HMR)
    // gets the same context back from the same canvas.
    destroy: () => {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
};

/** Value noise + fbm, shared GLSL. */
export const NOISE = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
`;
