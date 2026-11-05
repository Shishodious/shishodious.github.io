import { useEffect, useRef } from "react";
import gsap from "gsap";
import { HiOutlineArrowDown } from "react-icons/hi2";
import { PanelNumber } from "./Panel";
import VideoTile from "./VideoTile";

// Tile width drives the gap below, so the name and word always overlap its edges.
const TILE = "clamp(15rem, min(38vw, 58svh), 34rem)";

/** Opening panel: a tilted video behind the name and one enormous word. */
const VideoHero = ({ hero }) => {
  const ref = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia(ref.current);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from("[data-tile]", { opacity: 0, scale: 0.9, rotate: -14, duration: 1.4 })
        .from("[data-line]", { yPercent: 110, duration: 1.1, stagger: 0.1 }, "-=1.15")
        .from("[data-role]", { opacity: 0, duration: 0.8 }, "-=0.5");

      gsap.to("[data-drift]", {
        yPercent: -12,
        rotate: 5,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={ref}
      style={{ "--tile": TILE }}
      className="relative min-h-[100svh] overflow-hidden flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center"
    >
      <PanelNumber index="01" />

      <div className="relative flex flex-col items-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[var(--tile)]">
          <div data-drift>
            <VideoTile data-tile item={hero.reel} ratio="4 / 3" sound={false} className="-rotate-6" />
          </div>
        </div>

        <h1 className="relative flex flex-col items-center gap-[calc(var(--tile)*0.54)] pointer-events-none">
          <span className="block overflow-hidden px-[0.1em] pb-[0.2em]">
            <span data-line className="block font-grotesk font-light tracking-tight leading-none text-[clamp(2rem,6vw,5.5rem)]">
              {hero.name}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-line className="block font-grotesk font-light uppercase tracking-[-0.05em] leading-[0.95] text-[min(14vw,24svh)]">
              {hero.word}
            </span>
          </span>
        </h1>

        <p data-role className="relative mt-5 font-mono text-[11px] tracking-[0.3em] uppercase text-muted">
          {hero.role}
        </p>
      </div>

      <HiOutlineArrowDown className="scroll-bounce absolute bottom-8 text-accent" size={16} aria-hidden="true" />
    </section>
  );
};

export default VideoHero;
