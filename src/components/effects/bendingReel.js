/**
 * Bending reel engine.
 *
 * Draws a horizontal strip of images onto a canvas and bends it like a concave
 * lens: panels stretch taller the further they sit from the centre, so the
 * strip's top and bottom edges curve outward toward the viewport edges. The
 * bend deepens while the strip is travelling and relaxes as it settles.
 *
 * Each panel is drawn as narrow vertical strips, each scaled by the stretch at
 * its own x — that per-strip scale is what turns straight edges into smooth
 * curves. That's a few hundred drawImage calls a frame, which Canvas 2D handles
 * comfortably, and the loop only runs while something is actually moving.
 *
 * The strip wraps, so the edges are always filled, and the driver only ever
 * sets a 0–1 progress (first panel centred → last panel centred).
 */

// Strip width in CSS px — narrow enough that the curve reads as smooth.
const STRIP = 2;
// Extra height at the viewport edges, as a fraction of panel height: at rest,
// and added on top while the strip is moving.
const BEND_REST = 0.3;
const BEND_MOTION = 0.2;
// Above 2 keeps the middle flat and pushes the curvature out toward the edges.
const BEND_POWER = 2.2;
// Over-crop each image so it has slack to drift inside its panel.
const ZOOM = 1.12;
const PARALLAX = 0.85;
// Catch-up per 60fps frame for the camera and for the bend.
const FOLLOW = 0.085;
const BEND_FOLLOW = 0.1;
// Section background, for the edge shading.
const BG = "13, 12, 10";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export function createBendingReel(
  canvas,
  { sources, aspect = 4 / 3, gap = 16, radius = 14, onActiveChange }
) {
  const ctx = canvas.getContext("2d");
  const count = sources.length;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let panelW = 0;
  let panelH = 0;
  let slot = 0;
  let loop = 0;
  let shade = null;

  let progress = 0;
  let cam = 0;
  let camTarget = 0;
  let bend = BEND_REST;
  let active = -1;
  let raf = 0;
  let lastTime = 0;
  let inView = true;

  const images = sources.map((src) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      draw();
      schedule();
    };
    img.src = src;
    return img;
  });

  // Camera = the strip position under the canvas centre.
  const camAt = (p) => panelW / 2 + p * (count - 1) * slot;

  function measure() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    // Panels at the very edge, at full bend, exactly fill the canvas height.
    panelH = height / (1 + BEND_REST + BEND_MOTION);
    panelW = panelH * aspect;
    slot = panelW + gap;
    loop = slot * count;
  }

  function resize() {
    measure();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    // Panels dim toward the edges, so the centred one carries the focus.
    shade = ctx.createLinearGradient(0, 0, width, 0);
    shade.addColorStop(0, `rgba(${BG}, 0.72)`);
    shade.addColorStop(0.28, `rgba(${BG}, 0.14)`);
    shade.addColorStop(0.5, `rgba(${BG}, 0)`);
    shade.addColorStop(0.72, `rgba(${BG}, 0.14)`);
    shade.addColorStop(1, `rgba(${BG}, 0.72)`);

    // A resize shouldn't send the strip sliding across to its new position.
    cam = camTarget = camAt(progress);
    draw();
  }

  function drawPanel(img, left, half, mid) {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover-crop to the panel's aspect, then over-crop for parallax slack.
    let sw = iw;
    let sh = ih;
    if (iw / ih > aspect) sw = ih * aspect;
    else sh = iw / aspect;
    sw /= ZOOM;
    sh /= ZOOM;

    // The image lags its frame: it shows its right side entering from the
    // right and its left side leaving on the left, like a window onto it.
    const slack = (iw - sw) / 2;
    const drift = clamp((left + panelW / 2 - half) / half, -1, 1);
    const sx = slack * (1 + drift * PARALLAX);
    const sy = (ih - sh) / 2;

    const first = Math.max(0, Math.floor(-left / STRIP) * STRIP);
    const last = Math.min(panelW, width - left);

    for (let px = first; px < last; px += STRIP) {
      const w = Math.min(STRIP, panelW - px);
      const x = left + px;

      const u = Math.min(Math.abs((x + w / 2 - half) / half), 1);
      const stretch = 1 + bend * Math.pow(u, BEND_POWER);

      // Round the corners by trimming strips near the panel ends to a circle.
      const edge = Math.min(px + w / 2, panelW - px - w / 2);
      const trim =
        edge < radius
          ? radius - Math.sqrt(radius * radius - (radius - edge) ** 2)
          : 0;
      const crop = trim / panelH;
      const h = (panelH - trim * 2) * stretch;

      ctx.drawImage(
        img,
        sx + (px / panelW) * sw,
        sy + crop * sh,
        (w / panelW) * sw,
        (1 - crop * 2) * sh,
        x,
        mid - h / 2,
        // A hair of overlap hides seams between sub-pixel strips.
        w + 0.5,
        h
      );
    }
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    if (!panelW) return;

    const half = width / 2;
    const mid = height / 2;

    for (let i = 0; i < count; i++) {
      const img = images[i];
      if (!img.complete || !img.naturalWidth) continue;
      // Every on-screen copy of this panel around the loop.
      const base = i * slot - cam + half;
      const kMin = Math.ceil((-panelW - base) / loop);
      const kMax = Math.floor((width - base) / loop);
      for (let k = kMin; k <= kMax; k++) drawPanel(img, base + k * loop, half, mid);
    }

    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, width, height);
  }

  function report() {
    const i = (((Math.round((cam - panelW / 2) / slot)) % count) + count) % count;
    if (i !== active) {
      active = i;
      onActiveChange?.(i);
    }
  }

  function frame(now) {
    raf = 0;
    const dt = lastTime ? Math.min((now - lastTime) / (1000 / 60), 4) : 1;
    lastTime = now;

    cam += (camTarget - cam) * (1 - Math.pow(1 - FOLLOW, dt));
    // The further the camera trails its target, the faster it's moving —
    // and the harder the strip bends.
    const lag = Math.abs(camTarget - cam);
    const bendTarget = BEND_REST + Math.min(lag / (slot * 0.75), 1) * BEND_MOTION;
    bend += (bendTarget - bend) * (1 - Math.pow(1 - BEND_FOLLOW, dt));

    const settled = lag < 0.1 && Math.abs(bendTarget - bend) < 0.001;
    if (settled) {
      cam = camTarget;
      bend = bendTarget;
    }

    draw();
    report();

    if (settled) lastTime = 0;
    else schedule();
  }

  function schedule() {
    if (!raf && inView) raf = requestAnimationFrame(frame);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  const viewObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) schedule();
  });
  viewObserver.observe(canvas);

  resize();
  report();

  return {
    /** 0 = first panel centred, 1 = last panel centred. */
    setProgress(p) {
      progress = clamp(p, 0, 1);
      camTarget = camAt(progress);
      schedule();
    },

    /** Strip distance between the first and last panel, in px. */
    travel() {
      measure();
      return (count - 1) * slot;
    },

    /** Index of the panel under canvas-relative x, or -1 for a gap. */
    hitTest(x) {
      const half = width / 2;
      for (let i = 0; i < count; i++) {
        const base = i * slot - cam + half;
        const local = (((x - base) % loop) + loop) % loop;
        if (local <= panelW) return i;
      }
      return -1;
    },

    destroy() {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      images.forEach((img) => {
        img.onload = null;
      });
    },
  };
}
