import { useEffect, useRef } from "react";
import gsap from "gsap";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import SectionLink from "../shell/SectionLink";

const Meta = ({ item }) => (
  <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
    <div>
      <h3 className="font-grotesk font-light uppercase tracking-tight text-2xl md:text-3xl">{item.title}</h3>
      <p className="mt-1 text-sm text-muted">
        {item.client}
        {item.year && ` · ${item.year}`} — {item.role}
      </p>
    </div>
    <ul className="flex flex-wrap gap-2">
      {item.stack.map((s) => (
        <li
          key={s}
          className="px-2.5 py-1 rounded-full border border-ink/20 font-mono text-[10px] tracking-[0.15em] uppercase"
        >
          {s}
        </li>
      ))}
    </ul>
  </div>
);

/** A site in a minimal browser frame; the screenshot settles as it scrolls in. */
const Framed = ({ item }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        imgRef.current,
        { scale: 1.18 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: imgRef.current, start: "top bottom", end: "bottom 60%", scrub: true },
        }
      );
    });
    return () => mm.revert();
  }, []);

  const frame = (
    <div className="rounded-2xl border border-ink/15 bg-elev overflow-hidden shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-1.5 px-4 h-9 border-b border-ink/10">
        {[0, 1, 2].map((d) => (
          <span key={d} className="w-2.5 h-2.5 rounded-full bg-ink/15" />
        ))}
        {item.link && (
          <span className="ml-3 font-mono text-[10px] tracking-[0.1em] text-muted truncate">
            {item.link.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </span>
        )}
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          ref={imgRef}
          src={item.src}
          alt={`${item.title} homepage`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      </div>
    </div>
  );

  return (
    <article>
      {item.link ? (
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="group block">
          {frame}
        </a>
      ) : (
        frame
      )}
      <Meta item={item} />
    </article>
  );
};

/** Client work that can't be shown: a sealed card with a stamp. */
const Sealed = ({ item }) => (
  <article>
    <div className="relative aspect-[16/10] rounded-2xl border border-dashed border-ink/30 bg-elev/60 flex items-center justify-center overflow-hidden">
      <span className="-rotate-[8deg] px-6 py-2 border-2 border-accent text-accent font-mono text-sm tracking-[0.4em] uppercase rounded-md">
        Under NDA
      </span>
      <span className="absolute bottom-4 left-5 font-mono text-[10px] tracking-[0.25em] uppercase text-muted">
        Shipped · details on request
      </span>
    </div>
    <Meta item={item} />
  </article>
);

/**
 * Brand work as framed artefacts, closed by an open slot inviting the next
 * brand in. Entries come from services/brand.js.
 */
const Artefacts = ({ items, index = "02" }) => (
  <section className="px-6 md:px-12 py-28 md:py-40">
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-accent tracking-[0.2em]">({index})</span>
        <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">Work</span>
        <div className="flex-1 h-px bg-line" />
      </div>
      <h2 className="mt-8 mb-16 md:mb-20 font-grotesk font-light tracking-tight leading-[1.05] text-[clamp(2.25rem,5vw,4.5rem)]">
        Sites on the reel.
      </h2>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-16">
        {items.map((item) =>
          item.nda ? <Sealed key={item.id} item={item} /> : <Framed key={item.id} item={item} />
        )}

        <SectionLink
          to="contact"
          className="group flex flex-col justify-between aspect-[16/10] rounded-2xl bg-ink text-bg p-6 md:p-8 transition-colors duration-500 hover:bg-accent"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-70">
            Next on the reel
          </span>
          <span className="flex items-end justify-between gap-6">
            <span className="font-grotesk font-light tracking-tight leading-[1.02] text-[clamp(2rem,4vw,3.5rem)]">
              Your brand, here.
            </span>
            <HiOutlineArrowUpRight
              size={28}
              className="shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </span>
        </SectionLink>
      </div>
    </div>
  </section>
);

export default Artefacts;
