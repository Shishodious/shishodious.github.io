import { useEffect, useRef } from "react";
import gsap from "gsap";
import { HiOutlineArrowDown } from "react-icons/hi2";
import { services } from "../services/registry";

/**
 * Opening chapter for a service world: index, oversized name and pitch.
 * Placeholder hero until the world's own story chapters land.
 */
const WorldIntro = ({ service }) => {
  const ref = useRef(null);
  const index = String(services.indexOf(service) + 1).padStart(2, "0");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
      });
    }, ref);
    return () => ctx.revert();
  }, [service.slug]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex flex-col justify-end px-6 md:px-12 pb-16 md:pb-20 pt-32"
    >
      <div className="overflow-hidden">
        <p
          data-rise
          className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted"
        >
          <span className="text-accent">{index}</span> / {service.name}
        </p>
      </div>

      <h1 className="mt-6 font-fraunces font-light leading-[0.86] tracking-[-0.04em] text-[clamp(4.5rem,17vw,16rem)]">
        <span className="block overflow-hidden">
          <span data-rise className="block">
            {service.word}
            <span className="text-accent">.</span>
          </span>
        </span>
      </h1>

      <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-t border-line pt-6">
        <div className="overflow-hidden max-w-xl">
          <p data-rise className="text-lg md:text-xl text-ink/80 leading-snug">
            {service.tagline}
          </p>
        </div>
        <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase text-muted">
          <HiOutlineArrowDown className="scroll-bounce text-accent" size={14} />
          The story is being written
        </p>
      </div>
    </section>
  );
};

export default WorldIntro;
