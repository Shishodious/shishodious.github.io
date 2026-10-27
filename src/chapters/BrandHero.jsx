import { useEffect, useRef } from "react";
import gsap from "gsap";
import Scribble from "../components/effects/Scribble";

/** Film-poster credits: serif title over ruled label/value rows. */
const Credits = ({ title, rows }) => (
  <div className="w-full max-w-[26rem]">
    <p className="font-fraunces uppercase tracking-[-0.01em] leading-none text-[clamp(2.25rem,4vw,3.25rem)]">
      {title}
    </p>
    <dl className="mt-4">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex justify-between gap-6 border-t border-ink/70 py-2.5">
          <dt className="pt-1 font-mono text-[10px] tracking-[0.3em] uppercase">{label}</dt>
          <dd className="text-right text-[15px] leading-snug">
            {value.map((v) => (
              <span key={v} className="block">
                {v}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

/**
 * Opening of the Brand world, laid out like a film's press page: credits
 * block, an oversized line with one phrase circled by hand, pull quotes.
 */
const BrandHero = ({ credits, headline, pulls }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from("[data-credit]", { opacity: 0, y: 16, duration: 0.9 })
        .from("[data-line]", { yPercent: 110, duration: 1.2, stagger: 0.08 }, "-=0.6")
        .from("[data-pull]", { opacity: 0, y: 20, duration: 0.9, stagger: 0.12 }, "-=0.7");
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex flex-col px-6 md:px-12 lg:pl-24 pt-24 md:pt-28 pb-14 md:pb-16"
    >
      <div data-credit>
        <Credits {...credits} />
      </div>

      <h1 className="mt-20 md:mt-auto pt-6 font-fraunces font-light tracking-[-0.035em] leading-[0.98] text-[clamp(2.75rem,7.6vw,8.5rem)] max-w-[17ch]">
        <span className="block overflow-hidden pb-[0.06em]">
          <span data-line className="block">
            {headline.before}
          </span>
        </span>
        {/* No clip on this line: the circle draws outside the text */}
        <span className="block pb-[0.06em]">
          <span data-line className="inline-block">
            <Scribble delay={1.1}>
              <em className="italic">{headline.circled}</em>
            </Scribble>
          </span>
        </span>
        <span className="block overflow-hidden pb-[0.06em]">
          <span data-line className="block">
            {headline.after}
          </span>
        </span>
      </h1>

      <div className="mt-14 grid sm:grid-cols-2 gap-10 sm:gap-16 md:w-fit md:ml-auto text-center">
        {pulls.map(({ source, quote }) => (
          <figure key={source} data-pull className="max-w-[18rem] mx-auto">
            <figcaption className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
              {source}
            </figcaption>
            <blockquote className="mt-3 font-fraunces uppercase leading-[1.05] tracking-[-0.01em] text-2xl md:text-[1.75rem]">
              &ldquo;{quote}&rdquo;
            </blockquote>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default BrandHero;
