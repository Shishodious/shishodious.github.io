import { useEffect, useRef } from "react";
import gsap from "gsap";
import hero from "../assets/hero.jpg";

/**
 * 2.5D depth backdrop for the hero.
 *
 * The photo is stacked three times and each copy is masked to a different
 * plane of the scene — hazy far field, the subject, the near foreground grass.
 * Pointer and scroll shift each plane by a different amount, so the still
 * frame reads as a space you can look into rather than a flat image.
 */
const LAYERS = [
  // Base plate: unmasked, so the frame is always fully covered.
  { key: "far", depth: 0.3 },
  { key: "mid", depth: 1 },
  { key: "near", depth: 2.4 },
];

// Pointer travel, in px, applied to a plane at depth 1.
// Raising these means raising the plane scales in index.css to match — each
// plane has to keep enough overhang to absorb its own worst-case travel.
const POINTER_X = 46;
const POINTER_Y = 28;
// Scroll travel, as a fraction of the scrolled distance, for a plane at depth 1.
const SCROLL_Y = 0.16;

const HeroBackdrop = ({ imageRef }) => {
  const planeRefs = useRef([]);

  useEffect(() => {
    const planes = planeRefs.current.filter(Boolean);
    if (!planes.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Pointer and scroll are tracked separately, then composed per plane so
    // neither one clobbers the other's contribution.
    const pointer = { x: 0, y: 0 };
    let scrolled = 0;

    const setters = planes.map((plane) => ({
      x: gsap.quickTo(plane, "x", { duration: 1.1, ease: "power3.out" }),
      y: gsap.quickTo(plane, "y", { duration: 1.1, ease: "power3.out" }),
    }));

    const apply = () => {
      LAYERS.forEach((layer, i) => {
        // Nearer planes swing further, and against the pointer — the same cue
        // your eyes use for parallax in the real world.
        setters[i].x(-pointer.x * POINTER_X * layer.depth);
        setters[i].y(
          -pointer.y * POINTER_Y * layer.depth +
            scrolled * SCROLL_Y * layer.depth
        );
      });
    };

    const onPointerMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      apply();
    };

    const onScroll = () => {
      // Only the hero's own travel matters; past it the section is offscreen.
      scrolled = Math.min(window.scrollY, window.innerHeight);
      apply();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(planes);
    };
  }, []);

  return (
    <div className="hero-backdrop absolute inset-0 z-0">
      <div ref={imageRef} className="absolute inset-0">
        {LAYERS.map((layer, i) => (
          <div
            key={layer.key}
            ref={(el) => (planeRefs.current[i] = el)}
            className={`hero-plane hero-plane--${layer.key}`}
            aria-hidden={layer.key !== "mid"}
          >
            <img
              src={hero}
              alt={
                layer.key === "mid"
                  ? "Priyanshu Shishodia standing in a sunlit field of tall grass"
                  : ""
              }
              // eslint-disable-next-line react/no-unknown-property -- React 18 expects lowercase `fetchpriority`; camelCase triggers a runtime warning
              fetchpriority="high"
              draggable="false"
            />
          </div>
        ))}
      </div>

      {/* Warm grade + legibility gradients */}
      <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/75 via-bg/15 to-bg" />
      <div className="absolute inset-0 bg-gradient-to-l from-bg/70 via-bg/25 to-transparent" />
      {/* Vignette — seats the frame into the page edges */}
      <div className="hero-vignette absolute inset-0" />
    </div>
  );
};

export default HeroBackdrop;
