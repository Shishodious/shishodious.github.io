import { useEffect, useRef } from "react";
import gsap from "gsap";

// Hand-drawn marks in a 200×100 box, stretched over whatever they wrap.
const PATHS = {
  // A loose loop that overshoots its start, like a marker circling a word
  circle:
    "M 34 20 C 78 2, 172 6, 191 40 C 206 76, 138 97, 88 94 C 32 91, 3 68, 10 44 C 17 20, 64 8, 122 11 C 152 13, 174 21, 184 30",
  underline: "M 2 72 C 42 60, 92 64, 132 57 S 186 50, 198 58",
};

// Where each mark sits relative to the wrapped text.
const BOXES = {
  circle: { left: "-10%", top: "-22%", width: "120%", height: "144%" },
  underline: { left: 0, bottom: "-0.35em", width: "100%", height: "0.5em" },
};

/**
 * Wraps inline content with a marker stroke that draws itself on the first
 * time it scrolls into view. The stroke uses the accent colour.
 */
const Scribble = ({ children, mark = "circle", delay = 0.2, className = "" }) => {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(path, { strokeDashoffset: 0 });
      return;
    }
    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      duration: mark === "circle" ? 1.3 : 0.8,
      ease: "power2.inOut",
      delay,
      scrollTrigger: { trigger: path, start: "top 85%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [mark, delay]);

  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
        className="absolute pointer-events-none text-accent overflow-visible"
        style={BOXES[mark]}
      >
        <path
          ref={pathRef}
          d={PATHS[mark]}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
};

export default Scribble;
