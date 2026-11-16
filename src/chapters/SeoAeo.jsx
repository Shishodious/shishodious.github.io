import { useEffect, useRef } from "react";
import gsap from "gsap";

const pad = (n) => String(n).padStart(2, "0");

/** How a site gets found: SEO, AEO and analytics, each with its techniques. */
const SeoAeo = ({ title, intro, groups, index = "02" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia(ref.current);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-seo]", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className="px-6 md:px-12 py-28 md:py-40 bg-elev">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-accent tracking-[0.2em]">({index})</span>
          <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">SEO &amp; AEO</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        <div className="mt-8 mb-14 md:mb-20 grid md:grid-cols-[1.3fr_1fr] gap-8 md:gap-20 items-end">
          <h2 className="font-grotesk font-light tracking-tight leading-[1.05] text-[clamp(2.25rem,5vw,4.5rem)]">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="text-lg leading-relaxed text-ink/75 max-w-md">{intro}</p>
        </div>

        <ol className="grid md:grid-cols-2 gap-x-16 border-t border-ink/70">
          {groups.map((group, i) => (
            <li key={group.title} data-seo className="flex gap-6 border-b border-ink/15 py-8 md:py-10">
              <span className="pt-2 font-mono text-[11px] text-accent tabular-nums">{pad(i + 1)}</span>
              <div>
                <h3 className="font-grotesk font-light uppercase tracking-tight text-2xl md:text-3xl">{group.title}</h3>
                <p className="mt-3 text-ink/75 leading-relaxed max-w-md">{group.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="px-3 py-1.5 rounded-full border border-ink/20 font-mono text-[10px] tracking-[0.15em] uppercase"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default SeoAeo;
