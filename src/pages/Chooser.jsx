import { Fragment, lazy, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import LazySection from "../components/LazySection";
import { visibleServices } from "../services/registry";
import WorldLink from "../shell/WorldLink";
import { setPageMeta } from "../services/meta";
import { home } from "../services/catalog";
import avatar from "../assets/avatar.webp";

gsap.registerPlugin(ScrollTrigger);

const Contact = lazy(() => import("../components/Contact"));

const pad = (n) => String(n).padStart(2, "0");
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const HEADLINE = home.headline;
const STATEMENT = home.statement;

/** Screen 1: the puppet waving on the left, a short right-aligned hello. */
const Hero = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.09, delay: 0.1 });
      gsap.from("[data-fade]", { opacity: 0, y: 12, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.55 });
      gsap.from("[data-portrait]", { opacity: 0, scale: 1.04, duration: 1.8, ease: "power3.out", clearProps: "transform" });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      {/* A transparent cut-out, standing on the bottom edge like the puppet is
          popping up from below the frame */}
      <img
        data-portrait
        src={avatar}
        alt="Priyanshu as a felt puppet, waving hello"
        width={1228}
        height={1049}
        draggable={false}
        className="absolute inset-x-0 bottom-0 mx-auto h-auto w-[min(112vw,32rem)] max-w-none md:w-[min(88vw,42rem)] lg:left-[4vw] lg:right-auto lg:mx-0 lg:h-[min(82svh,54vw)] lg:w-auto"
      />

      {/* Below lg the puppet sits under the text, so the text leaves room for it
          (the image's height at its width): short phones get a taller hero, not an overlap */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col items-end px-6 pb-[calc(min(112vw,32rem)*0.855+1.5rem)] pt-28 md:pb-[calc(min(88vw,42rem)*0.855+1.5rem)] text-right md:px-12 lg:pb-14 lg:pt-[16svh]">
        <h1 className="font-quicksand font-bold leading-[1.02] tracking-[-0.02em] text-[clamp(2.4rem,5.2vw,5.5rem)]">
          {HEADLINE.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span data-rise className="block">
                {line}
              </span>
            </span>
          ))}
        </h1>

        {/* Under the headline on phones, so the puppet below keeps the room; bottom-right on desktop */}
        <div className="mt-8 lg:mt-auto">
          <p data-fade className="font-quicksand text-2xl font-semibold tracking-[-0.01em] md:text-4xl">
            Priyanshu Shishodia
          </p>
          <p data-fade className="mt-1.5 flex flex-col items-end gap-1 font-quicksand text-sm text-muted sm:flex-row sm:justify-end sm:gap-6 md:text-lg">
            <span>Editor · Designer · Developer</span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Open to work
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

/** Screen 2: one statement, pinned, whose words darken as you scroll through it. */
const Statement = () => {
  const ref = useRef(null);
  const words = STATEMENT.split(" ");

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      const scrollTrigger = { trigger: ref.current, start: "top top", end: "bottom bottom", scrub: 0.4 };
      // The words finish a little before the pin lets go, so the full sentence holds for a beat.
      gsap
        .timeline({ scrollTrigger })
        .fromTo("[data-word]", { opacity: 0.16 }, { opacity: 1, ease: "none", stagger: 1, duration: 1 })
        .to({}, { duration: words.length * 0.15 });
      gsap.fromTo("[data-bar]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger });
    }, ref);
    return () => ctx.revert();
  }, [words.length]);

  return (
    <section ref={ref} aria-label="About" className="relative h-[100svh] motion-safe:h-[280svh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center px-6 md:px-12">
        <p className="max-w-[58rem] text-center font-quicksand font-medium uppercase leading-[1.18] tracking-[-0.005em] text-[clamp(1.6rem,3.1vw,3.4rem)]">
          <span className="sr-only">{STATEMENT}</span>
          <span aria-hidden="true">
            {/* The space sits between the words: one inside an inline-block would collapse */}
            {words.map((word, i) => (
              <Fragment key={i}>
                <span data-word className="inline-block">
                  {word}
                </span>
                {i < words.length - 1 && " "}
              </Fragment>
            ))}
          </span>
        </p>
        <span aria-hidden="true" className="absolute bottom-10 left-1/2 h-px w-40 -translate-x-1/2 bg-ink/15 motion-reduce:hidden">
          <span data-bar className="block h-full w-full origin-left bg-ink" />
        </span>
      </div>
    </section>
  );
};

/** Screen 3: the services, as a plain numbered list into each world. */
const Services = () => (
  <section aria-labelledby="services-title" className="mx-auto max-w-[1440px] px-6 py-[14svh] md:px-12">
    <h2 id="services-title" className="font-quicksand text-lg font-medium text-muted md:text-xl">
      What can I do for you?
    </h2>
    <ol className="mt-8 border-b border-ink/10 md:mt-12">
      {visibleServices.map((service, i) => (
        <li key={service.slug}>
          <WorldLink
            to={`/${service.slug}`}
            draggable={false}
            aria-label={`${service.name}: want to ${service.door}`}
            className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-t border-ink/10 py-6 outline-none focus-visible:bg-ink/[0.03] md:gap-x-10 md:py-9"
          >
            <span className="self-start pt-[0.7em] font-mono text-[11px] tabular-nums tracking-[0.2em] text-muted">
              {pad(i + 1)}
            </span>
            <span className="min-w-0">
              <span className="block font-quicksand font-semibold leading-none tracking-[-0.02em] text-[clamp(2rem,5vw,4.5rem)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 group-focus-visible:translate-x-3">
                {service.name}
              </span>
              <span className="mt-3 block font-quicksand text-sm text-muted md:text-base">Want to {service.door}</span>
            </span>
            <span
              aria-hidden="true"
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink/60 transition-all duration-500 ease-[cubic-bezier(0.34,1.36,0.64,1)] group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-bg md:h-14 md:w-14"
            >
              <HiOutlineArrowUpRight size={18} />
            </span>
          </WorldLink>
        </li>
      ))}
    </ol>
  </section>
);

/** The home page on "/": hello, what I do, where to go next, then contact. */
const Chooser = () => {
  useEffect(() => {
    setPageMeta({ title: null, description: home.description, path: "/" });
  }, []);

  return (
    <>
      <main>
        <Hero />
        <Statement />
        <Services />
      </main>

      {/* Numbered on from the services */}
      <LazySection anchorId="contact">
        <Contact index={pad(visibleServices.length + 1)} service={{ slug: "gate" }} />
      </LazySection>
    </>
  );
};

export default Chooser;
