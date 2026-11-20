import { useEffect, useRef, useState } from "react";

// Shared pieces for the widget boards shown inside the home ring's pebble
// (AppsOS, BrandOS): a fixed 620 × 1000 board scaled to fit, floating cards,
// dot-matrix read-outs and ruler ticks.
export const BOARD_W = 620;
export const BOARD_H = 1000;

// 5 × 7 dot font for the dot-matrix read-outs.
const GLYPHS = {
  0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  2: ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
  3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  5: ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  6: ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  9: ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  ":": ["0", "0", "1", "0", "1", "0", "0"],
  ".": ["0", "0", "0", "0", "0", "0", "1"],
};

/** A number drawn in dots, `dot` px per cell. */
export const Dots = ({ value, dot = 6, className = "" }) => {
  const chars = String(value).split("");
  const gap = dot * 0.9;
  let x = 0;
  const cells = [];
  chars.forEach((ch, ci) => {
    const g = GLYPHS[ch];
    if (!g) return;
    g.forEach((row, ry) =>
      [...row].forEach((on, rx) => {
        if (on === "1") {
          cells.push(
            <circle key={`${ci}-${rx}-${ry}`} cx={x + rx * dot + dot / 2} cy={ry * dot + dot / 2} r={dot * 0.36} />,
          );
        }
      }),
    );
    x += g[0].length * dot + gap;
  });
  const width = Math.max(0, x - gap);
  return (
    <svg
      width={width}
      height={7 * dot}
      viewBox={`0 0 ${width} ${7 * dot}`}
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      {cells}
    </svg>
  );
};

/** A row of ruler ticks with a marker at `at` (0–1). */
export const Ruler = ({ at = 0.5, color = "#ffd84a", tick = "bg-white/35", className = "" }) => (
  <div className={`relative flex items-end justify-between h-6 ${className}`}>
    {Array.from({ length: 33 }, (_, i) => (
      <span key={i} className={`w-px ${tick}`} style={{ height: i % 4 === 0 ? 18 : 9 }} />
    ))}
    <span className="absolute bottom-0 w-[2px] h-6 rounded" style={{ left: `${at * 100}%`, background: color }} />
  </div>
);

/** One floating widget card. `light` switches to ink text for pale cards. */
export const Card = ({ x, y, w, h, bg, title, sub, light = false, delay = 0, className = "", children }) => (
  <div
    className={`os-float absolute rounded-[22px] overflow-hidden p-4 shadow-[0_24px_50px_-18px_rgba(0,0,0,0.55)] ${
      light ? "text-[#121212]" : "text-white"
    } ${className}`}
    style={{ left: x, top: y, width: w, height: h, background: bg, animationDelay: `${delay}s` }}
  >
    {title && (
      <p className="font-helvetica font-bold text-[17px] leading-tight">
        {title}
        {sub && <span className={`block font-medium ${light ? "text-black/45" : "text-white/55"}`}>{sub}</span>}
      </p>
    )}
    {children}
  </div>
);

/**
 * The board itself: scales its fixed layout to the pebble, pauses its cards
 * while its door is round the back, and hands the backdrop glow a swatch of
 * `glow` colours to sample.
 */
export const Board = ({ on, register, glow, bg, children }) => {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const box = boxRef.current;
    const fit = () => setScale(box.clientWidth / BOARD_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  const glowKey = glow.join();
  useEffect(() => {
    const swatch = document.createElement("canvas");
    swatch.width = 6;
    swatch.height = 6;
    const ctx = swatch.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 6, 6);
    const stops = glowKey.split(",");
    stops.forEach((c, i) => g.addColorStop(stops.length > 1 ? i / (stops.length - 1) : 0, c));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 6, 6);
    register(() => swatch);
  }, [register, glowKey]);

  return (
    <div ref={boxRef} data-on={on} className="os-board absolute inset-0 overflow-hidden" style={{ background: bg }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: BOARD_W, height: BOARD_H, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
};
