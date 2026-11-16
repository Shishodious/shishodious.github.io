import { useEffect, useRef } from "react";
import gsap from "gsap";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import Lean from "../components/effects/Lean";

const pad = (n) => String(n).padStart(2, "0");

const Card = ({ study, index, total }) => (
  <article className="grid md:grid-cols-[1.15fr_1fr] gap-8 md:gap-12 p-5 md:p-8 rounded-[28px] border border-line bg-elev shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
    <div className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-bg">
      <img
        src={study.src}
        alt={`${study.title} interface`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>

    <div className="flex flex-col">
      <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.25em] uppercase text-muted">
        <span>{study.context}</span>
        <span className="tabular-nums">
          <span className="text-ink">{pad(index + 1)}</span> / {pad(total)}
        </span>
      </div>

      <h3 className="mt-6 font-fraunces font-light tracking-[-0.03em] leading-[0.95] text-[clamp(2.5rem,5vw,4.5rem)]">
        {study.title}
        <span className="text-accent">.</span>
      </h3>
      <p className="mt-5 text-ink/75 leading-relaxed max-w-md">{study.summary}</p>

      <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
        {study.facts.map(({ value, label }) => (
          <div key={label}>
            <dt className="sr-only">{label}</dt>
            <dd className="font-fraunces text-3xl md:text-4xl text-accent leading-none">{value}</dd>
            <dd className="mt-2 text-xs text-muted leading-snug">{label}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto pt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
        <ul className="flex flex-wrap gap-2 mr-auto">
          {study.tags.map((tag) => (
            <li
              key={tag}
              className="px-2.5 py-1 rounded-full border border-line font-mono text-[10px] tracking-[0.15em] uppercase text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
        {study.demoLink ? (
          <Lean>
            <a
              href={study.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-bg text-sm font-medium hover:bg-ink transition-colors duration-300"
            >
              Visit live
              <HiOutlineArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </Lean>
        ) : (
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
            Client work · private
          </span>
        )}
      </div>
    </div>
  </article>
);

/**
 * Flagship projects as cards that pin and stack: each new card slides over
 * the last, which sinks back and dims. Plain stacked cards on small screens
 * and for reduced motion.
 */
const CaseStudies = ({ studies, index = "05" }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray("[data-card]", sectionRef.current);
      cards.slice(0, -1).forEach((card, i) => {
        gsap.to(card.firstElementChild, {
          scale: 0.92,
          filter: "brightness(0.55)",
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top 15%",
            scrub: true,
          },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative px-6 md:px-12 py-28 md:py-40">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 mb-14 md:mb-20">
          <span className="font-mono text-xs text-accent tracking-[0.2em]">({index})</span>
          <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">
            Case studies
          </span>
          <div className="flex-1 h-px bg-line" />
        </div>
        <h2
          className="font-grotesk font-light tracking-tight mb-16 md:mb-24 max-w-3xl"
          style={{ fontSize: "clamp(1.75rem, 4.2vw, 3.5rem)" }}
        >
          Products shipped <em className="font-fraunces italic text-accent">end to end</em>.
        </h2>

        <div className="flex flex-col gap-6 md:gap-[18vh]">
          {studies.map((study, i) => (
            <div
              key={study.id}
              data-card
              className="md:sticky"
              style={{ top: `calc(96px + ${i * 24}px)` }}
            >
              <div className="origin-top will-change-transform">
                <Card study={study} index={i} total={studies.length} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
