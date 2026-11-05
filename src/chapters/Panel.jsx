import { useEffect, useRef } from "react";
import gsap from "gsap";

/** The panel's number, pinned to its top-right corner. */
export const PanelNumber = ({ index }) => (
  <span className="absolute top-24 right-6 md:right-12 font-mono text-xs tracking-[0.2em] text-muted">{index}</span>
);

/**
 * A full-screen slide in the Video world's deck. `tone` picks a colour set from
 * worlds.css (none = the world's own black). Anything marked data-reveal rises
 * in as the panel arrives.
 */
const Panel = ({ index, tone, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia(ref.current);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-reveal]", {
        opacity: 0,
        y: 36,
        duration: 1,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: ref.current, start: "top 72%", toggleActions: "play none none none" },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={ref}
      data-tone={tone}
      className="relative md:min-h-[100svh] flex flex-col justify-center bg-bg text-ink px-6 md:px-12 lg:pl-24 py-28"
    >
      <PanelNumber index={index} />
      {children}
    </section>
  );
};

export default Panel;
