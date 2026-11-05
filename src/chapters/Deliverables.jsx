import { useEffect, useRef } from "react";
import gsap from "gsap";

const pad = (n) => String(n).padStart(2, "0");

/** What a project includes, set like a film's end credits. */
const Deliverables = ({ items, index = "03", title = "Everything in the box." }) => {
  const ref = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-row]", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className="px-6 md:px-12 py-28 md:py-40 bg-gradient-to-b from-elev from-60% to-bg">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-[1fr_1.3fr] gap-12 md:gap-20">
        <div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-accent tracking-[0.2em]">({index})</span>
            <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">
              Included
            </span>
          </div>
          <h2 className="mt-8 font-grotesk font-light tracking-tight leading-[1.05] text-[clamp(2.25rem,5vw,4.5rem)] md:sticky md:top-32">
            {title}
          </h2>
        </div>

        <ol className="border-t border-ink/70">
          {items.map((item, i) => (
            <li
              key={item}
              data-row
              className="flex items-baseline gap-6 border-b border-ink/15 py-4 md:py-5"
            >
              <span className="font-mono text-[11px] text-accent tabular-nums">{pad(i + 1)}</span>
              <span className="font-fraunces text-xl md:text-2xl tracking-[-0.01em]">{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Deliverables;
