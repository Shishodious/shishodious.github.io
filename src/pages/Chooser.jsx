import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { lastService, services } from "../services/registry";
import { createHaze } from "../components/effects/shaders/haze";
import WorldLink from "../shell/WorldLink";
import { worldColors } from "../shell/worldColors";

/** A word whose letters roll up, one after another, into the accent copy. */
const RollWord = ({ word, on }) => (
  <span data-on={on} aria-label={word} className="inline-block whitespace-nowrap">
    {[...word].map((ch, i) => (
      <span key={i} className="roll-char" style={{ "--i": i }} aria-hidden="true">
        <span className="roll-a">{ch}</span>
        <span className="roll-b">{ch}</span>
      </span>
    ))}
  </span>
);

/**
 * The gate on "/": four doors, one per service. Hovering a door previews its
 * world — the haze, the type and the whole page recolour — and clicking it
 * dissolves into that world.
 */
const Chooser = () => {
  const [active, setActive] = useState(null);
  const [last] = useState(lastService);
  const rootRef = useRef(null);
  const hazeRef = useRef(null);
  const hazeFx = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    document.title = "Priyanshu Shishodia — Studio";
  }, []);

  // The haze is decoration: skipped for reduced motion and without WebGL.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    hazeFx.current = createHaze(hazeRef.current);
    hazeFx.current?.setWorld(worldColors("gate"));
    return () => {
      hazeFx.current?.destroy();
      hazeFx.current = null;
    };
  }, []);

  // Preview the hovered world across the whole page. Not reset on unmount:
  // Layout sets the destination's world when the route changes.
  useLayoutEffect(() => {
    const world = active ?? "gate";
    document.documentElement.dataset.world = world;
    hazeFx.current?.setWorld(worldColors(world));
  }, [active]);

  // Lines rise into place on arrival.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", {
        yPercent: 110,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.09,
        delay: 0.15,
      });
      gsap.from("[data-fade]", { opacity: 0, duration: 1, delay: 0.7, stagger: 0.1 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // "Enter" badge trails the pointer while a door is hovered (mouse only).
  useEffect(() => {
    const badge = badgeRef.current;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const x = gsap.quickTo(badge, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(badge, "y", { duration: 0.45, ease: "power3.out" });
    const move = (e) => {
      x(e.clientX);
      y(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // Arrow keys walk the doors.
  const onKeyDown = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const doors = [...rootRef.current.querySelectorAll("[data-door]")];
    const i = doors.indexOf(document.activeElement);
    const next = e.key === "ArrowDown" ? i + 1 : i - 1;
    doors[(next + doors.length) % doors.length]?.focus();
    e.preventDefault();
  };

  const current = services.find((s) => s.slug === active);
  const index = current ? services.indexOf(current) + 1 : null;

  return (
    <main
      ref={rootRef}
      className="relative h-[100svh] min-h-[560px] overflow-hidden select-none"
    >
      <canvas ref={hazeRef} aria-hidden="true" className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 h-full flex flex-col px-6 md:px-12 pt-24 md:pt-28 pb-6 md:pb-10">
        <div
          data-fade
          className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.3em] uppercase text-muted transition-colors duration-500"
        >
          <h1>What are we making?</h1>
          <p className="hidden sm:block">Choose one — switch anytime</p>
        </div>

        <ul
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKeyDown}
          className="my-auto"
        >
          {services.map((service, i) => {
            const on = active === service.slug;
            const dim = active && !on;
            return (
              <li key={service.slug}>
                <WorldLink
                  to={`/${service.slug}`}
                  data-door
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(service.slug)}
                  onFocus={() => setActive(service.slug)}
                  onBlur={(e) => {
                    if (!e.currentTarget.closest("ul").contains(e.relatedTarget)) setActive(null);
                  }}
                  className={`group flex items-center gap-4 md:gap-8 outline-none transition-opacity duration-500 ${
                    dim ? "opacity-25" : "opacity-100"
                  }`}
                >
                  <span className="font-mono text-xs text-accent w-6 shrink-0 transition-colors duration-500">
                    0{i + 1}
                  </span>
                  <span className="block overflow-hidden py-[0.04em]">
                    <span
                      data-rise
                      className="block font-fraunces font-light tracking-[-0.035em] leading-[1.02] text-ink text-[clamp(3.25rem,min(12vw,15svh),10rem)] transition-colors duration-500"
                    >
                      <RollWord word={service.word} on={on} />
                    </span>
                  </span>
                  {last === service.slug && (
                    <span className="self-start mt-2 md:mt-5 font-mono text-[10px] tracking-[0.25em] uppercase text-accent whitespace-nowrap transition-colors duration-500">
                      Last visited
                    </span>
                  )}
                  <HiOutlineArrowUpRight
                    aria-hidden="true"
                    size={22}
                    className={`ml-auto shrink-0 transition-all duration-500 md:hidden ${
                      on ? "text-accent" : "text-muted"
                    }`}
                  />
                </WorldLink>
              </li>
            );
          })}
        </ul>

        <div
          data-fade
          className="grid sm:grid-cols-[auto_1fr] md:grid-cols-[12rem_1fr_auto] items-end gap-x-6 gap-y-2 border-t border-line pt-4 md:pt-5 font-mono text-[11px] tracking-[0.25em] uppercase text-muted transition-colors duration-500"
        >
          <p className="hidden sm:block text-ink tabular-nums">
            {index ? `0${index}` : "00"} <span className="text-muted">/ 0{services.length}</span>
          </p>
          <p
            key={active ?? "none"}
            className="rotate-in normal-case tracking-normal font-grotesk text-sm md:text-base text-ink/80 max-w-md"
          >
            {current ? current.tagline : "Video, content, brands and products — one person, start to finish."}
          </p>
          <p className="hidden md:block text-right">
            {current ? current.name : "Hover a door"}
          </p>
        </div>
      </div>

      {/* Trails the pointer, sitting below-right of it so it never hides the word */}
      <div
        ref={badgeRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-20 hidden md:block"
      >
        <div
          className={`translate-x-6 translate-y-6 origin-top-left w-[4.5rem] h-[4.5rem] rounded-full bg-accent text-bg flex items-center justify-center gap-1 font-mono text-[10px] tracking-[0.25em] uppercase transition-all duration-500 ease-[cubic-bezier(0.34,1.36,0.64,1)] ${
            current ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          Enter <HiOutlineArrowUpRight size={12} />
        </div>
      </div>
    </main>
  );
};

export default Chooser;
