import { useRef, useEffect, useMemo } from "react";

/* ─────────────────────────────────────────────────────────
   Variable Proximity
   Animates font-variation-settings (e.g. "wght") based on
   cursor distance from each character. Writes styles
   directly to the DOM inside a rAF loop — no per-mousemove
   React re-renders.
──────────────────────────────────────────────────────────── */

function parseFVS(settings) {
  const map = {};
  for (const [, axis, val] of settings.matchAll(/"([^"]+)"\s+([\d.e+-]+)/g)) {
    map[axis] = parseFloat(val);
  }
  return map;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function VariableProximity({
  label,
  className = "",
  style = {},
  fromFontVariationSettings = '"wght" 400',
  toFontVariationSettings = '"wght" 700',
  containerRef,
  radius = 140,
  falloff = "linear",
}) {
  // Letters are grouped into words that can't break internally — each letter
  // is its own inline-block, which would otherwise let a narrow screen wrap
  // mid-word ("thin / g.").
  const words = useMemo(() => label.split(" ").map((w) => w.split("")), [label]);
  const letterRefs = useRef([]);

  useEffect(() => {
    const el = containerRef?.current ?? document.body;
    const from = parseFVS(fromFontVariationSettings);
    const to = parseFVS(toFontVariationSettings);

    const proximity = (dist) => {
      const t = Math.max(0, 1 - dist / radius);
      if (falloff === "exponential") return t * t * t;
      if (falloff === "gaussian") return Math.exp(-((dist / radius) ** 2) * 4);
      return t;
    };

    let raf = null;
    const mouse = { x: -9999, y: -9999 };

    const render = () => {
      raf = null;
      for (const ref of letterRefs.current) {
        if (!ref) continue;
        const { left, top, width, height } = ref.getBoundingClientRect();
        const dist = Math.hypot(
          mouse.x - (left + width / 2),
          mouse.y - (top + height / 2)
        );
        const t = proximity(dist);
        let fvs = "";
        for (const axis in from) {
          if (axis in to) {
            if (fvs) fvs += ", ";
            fvs += `"${axis}" ${lerp(from[axis], to[axis], t).toFixed(2)}`;
          }
        }
        ref.style.fontVariationSettings = fvs;
      }
    };

    const schedule = () => {
      if (raf === null) raf = requestAnimationFrame(render);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      schedule();
    };

    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      schedule();
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [containerRef, fromFontVariationSettings, toFontVariationSettings, radius, falloff]);

  let index = 0;

  return (
    <span className={className} style={style} aria-label={label}>
      {words.map((letters, w) => (
        <span key={w}>
          {w > 0 && " "}
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {letters.map((char) => {
              const i = index++;
              return (
                <span
                  key={i}
                  ref={(el) => {
                    letterRefs.current[i] = el;
                  }}
                  style={{
                    fontVariationSettings: fromFontVariationSettings,
                    display: "inline-block",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        </span>
      ))}
    </span>
  );
}
