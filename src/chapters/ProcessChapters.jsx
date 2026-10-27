import { useEffect, useRef } from "react";
import gsap from "gsap";

const pad = (n) => String(n).padStart(2, "0");

/**
 * The process as chapters on a horizontal strip: the section pins and
 * scrolling down slides the strip sideways. Stacks vertically on small
 * screens and for reduced motion.
 */
const ProcessChapters = ({ steps, index = "01", title }) => {
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div
        ref={pinRef}
        className="flex flex-col justify-center py-28 md:motion-safe:py-0 md:motion-safe:h-[100svh]"
      >
        <div className="px-6 md:px-12">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-accent tracking-[0.2em]">({index})</span>
            <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">Process</span>
            <div className="relative flex-1 h-px bg-line overflow-hidden">
              <span
                ref={barRef}
                className="absolute inset-0 bg-accent origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
          <h2 className="mt-8 font-fraunces font-light tracking-[-0.03em] leading-none text-[clamp(2.25rem,5vw,4.5rem)]">
            {title}
          </h2>
        </div>

        <ol
          ref={trackRef}
          className="mt-14 md:mt-16 flex flex-col md:motion-safe:flex-row md:motion-safe:w-max gap-12 md:motion-safe:gap-0 px-6 md:px-12"
        >
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="md:motion-safe:w-[min(34rem,62vw)] md:motion-safe:pr-16 md:motion-safe:mr-16 md:motion-safe:border-r md:motion-safe:last:border-r-0 md:motion-safe:last:mr-0 md:motion-safe:last:pr-0 border-line"
            >
              <span className="block font-fraunces font-light leading-none text-[clamp(4.5rem,9vw,8rem)] text-accent">
                {pad(i + 1)}
              </span>
              <h3 className="mt-4 font-fraunces uppercase tracking-[-0.01em] text-3xl md:text-4xl">
                {step.title}
              </h3>
              <p className="mt-4 text-ink/75 leading-relaxed max-w-md">{step.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {step.yields.map((y) => (
                  <li
                    key={y}
                    className="px-3 py-1.5 rounded-full border border-ink/20 font-mono text-[10px] tracking-[0.15em] uppercase"
                  >
                    {y}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProcessChapters;
