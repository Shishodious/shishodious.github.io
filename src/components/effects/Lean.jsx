import { useEffect, useRef } from "react";

/**
 * Leaning pill — the wrapped element drifts toward a nearby cursor and tilts as
 * if the end closest to it were being tugged, then springs back once the cursor
 * moves away.
 *
 * Distance is measured on an untransformed outer wrapper, so the element's own
 * movement never feeds back into what it's reacting to. Motion runs on a small
 * spring rather than a tween, so a fast flick past the element overshoots and
 * settles instead of stopping dead.
 */

// How far beyond the element's edge, in px, the cursor starts to pull.
const RADIUS = 80;
// Share of the cursor's offset from centre the element follows, and its cap.
const SHIFT = 0.22;
const MAX_SHIFT = 10;
// Spring tuning, per frame.
const STIFFNESS = 0.14;
const DAMPING = 0.72;

const clamp = (v, max) => Math.max(-max, Math.min(max, v));

const Lean = ({ children, className = "", radius = RADIUS, tilt = 6 }) => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Only for a real cursor, and never when motion is unwelcome.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0, r: 0 };
    const pos = { x: 0, y: 0, r: 0 };
    const vel = { x: 0, y: 0, r: 0 };
    let raf = 0;

    const tick = () => {
      let moving = false;
      for (const k of ["x", "y", "r"]) {
        vel[k] = (vel[k] + (target[k] - pos[k]) * STIFFNESS) * DAMPING;
        pos[k] += vel[k];
        if (Math.abs(vel[k]) > 0.01 || Math.abs(target[k] - pos[k]) > 0.01) {
          moving = true;
        }
      }
      inner.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.r}deg)`;
      raf = moving ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const release = () => {
      target.x = target.y = target.r = 0;
      kick();
    };

    const onPointerMove = (e) => {
      const rect = outer.getBoundingClientRect();
      const hw = rect.width / 2;
      const hh = rect.height / 2;
      const dx = e.clientX - (rect.left + hw);
      const dy = e.clientY - (rect.top + hh);

      // Distance from the element's edge (0 anywhere inside it).
      const gap = Math.hypot(
        Math.max(Math.abs(dx) - hw, 0),
        Math.max(Math.abs(dy) - hh, 0)
      );
      if (gap >= radius) {
        if (target.x || target.y || target.r) release();
        return;
      }

      const pull = 1 - gap / radius;
      target.x = clamp(dx * SHIFT, MAX_SHIFT) * pull;
      target.y = clamp(dy * SHIFT, MAX_SHIFT * 0.6) * pull;
      // Tugging the right end downward tips it clockwise, the left end
      // downward tips it counter-clockwise — so the sign comes from dx × dy.
      target.r = clamp(dx / hw, 1) * clamp(dy / (hh + 24), 1) * tilt * pull;
      kick();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", release);
    window.addEventListener("blur", release);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", release);
      window.removeEventListener("blur", release);
      cancelAnimationFrame(raf);
      inner.style.transform = "";
    };
  }, [radius, tilt]);

  return (
    <span ref={outerRef} className={`inline-flex ${className}`}>
      <span
        ref={innerRef}
        className="inline-flex will-change-transform"
        style={{ transformOrigin: "50% 100%" }}
      >
        {children}
      </span>
    </span>
  );
};

export default Lean;
