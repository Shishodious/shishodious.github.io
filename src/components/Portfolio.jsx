import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiGithub } from "react-icons/fi";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineArrowUpRight,
} from "react-icons/hi2";
import Lean from "./effects/Lean";
import { createBendingReel } from "./effects/bendingReel";
import momentum from "../assets/momentum.jpg";
import creatorvision from "../assets/creatorvision.jpg";
import videotube from "../assets/videotube.jpg";
import uber from "../assets/uber.jpg";
import chatapp from "../assets/chatapp.jpg";
import oversocs from "../assets/oversocs.jpg";
import autocrawler from "../assets/autocrawler.jpg";

const projects = [
  {
    id: "01",
    src: momentum,
    title: "Momentum",
    description:
      "AI marketing engine built at Hypeliv — turns a plain-language brief into on-brand images, short-form reels, UGC presenter videos, and carousels, then schedules and auto-publishes them straight to Instagram, LinkedIn, YouTube, and TikTok. NestJS backend spanning ~55 modules with BullMQ workers, a multi-provider model layer (Anthropic, Google GenAI, ElevenLabs) behind per-provider spend tracking, and a Next.js 16 admin surface for brand context, planning, and publishing.",
    tags: ["Next.js", "NestJS", "Drizzle", "PostgreSQL", "BullMQ", "Anthropic", "Google GenAI"],
    demoLink: "https://momentum.hypeliv.com",
    codeLink: null,
  },
  {
    id: "02",
    src: creatorvision,
    title: "Creator Vision",
    description:
      "AI brand-detection and creator-analytics platform built at Hypeliv — a multi-signal pipeline (Gemini vision, audio transcription, on-screen OCR) that finds brands inside TikTok and YouTube videos and rolls detections into earned-media-value reports. BullMQ-driven processing across 46 backend modules.",
    tags: ["NestJS", "BullMQ", "PostgreSQL", "pgvector", "Google AI", "AWS"],
    demoLink: null,
    codeLink: null,
  },
  {
    id: "03",
    src: autocrawler,
    title: "AutoCrawler",
    description:
      "Web scraping and automation tool — structured data extraction at scale with rate limiting, retries, and a UI to configure crawls and inspect results.",
    tags: ["Node.js", "Puppeteer", "REST API"],
    demoLink: "https://auto-crawler.vercel.app",
    codeLink: "https://github.com/Shishodious/AutoCrawler",
  },
  {
    id: "04",
    src: chatapp,
    title: "Chat-App",
    description:
      "Realtime one-on-one and group messaging with instant delivery, file sharing, and a UI tested with 100+ concurrent users.",
    tags: ["Socket.io", "React", "Node.js"],
    demoLink: "https://chat-app-client-two-gamma.vercel.app/",
    codeLink: "https://github.com/Shishodious/ChatAPP-Client",
  },
  {
    id: "05",
    src: videotube,
    title: "VideoTube",
    description:
      "Full-stack video-sharing platform (YouTube clone) — users register, upload videos to Cloudinary with auto-thumbnails, then watch, search, like, comment, subscribe, and build playlists. Monorepo with an Express/MongoDB REST API and a React 19 SPA, secured by JWT access/refresh tokens.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Cloudinary", "JWT"],
    demoLink: "https://video-tube-server-blush.vercel.app/",
    codeLink: "https://github.com/Shishodious/VideoTube",
  },
  {
    id: "06",
    src: oversocs,
    title: "Oversocs",
    description:
      "E-commerce for exclusive socks — filtered product listings serving 500+ daily visitors, secure auth with cart and checkout, GSAP and Framer Motion micro-interactions.",
    tags: ["React", "Node.js", "GSAP", "Framer Motion"],
    demoLink: "https://oversocs-d86z.vercel.app/",
    codeLink: "https://github.com/Shishodious/OVERSOCS",
  },
  {
    id: "07",
    src: uber,
    title: "Uber Clone",
    description:
      "Full-stack ride-booking platform — live trip tracking over WebSockets for rider and driver roles, Google Maps routing with fare calculation, JWT-protected routes throughout.",
    tags: ["React", "Maps API", "WebSockets", "JWT"],
    demoLink: "https://uber-zeta-woad.vercel.app/",
    codeLink: "https://github.com/Shishodious/UBER",
  },
];

// The reel needs room to breathe and a user who's fine with motion.
const REEL_QUERY =
  "(min-width: 768px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
};

const pad = (n) => String(n).padStart(2, "0");

// `compact` tightens the label-to-heading gap so the pinned reel fits one screen.
const SectionHeader = ({ className = "", compact, rail, aside }) => (
  <div className={className}>
    <div
      className={`flex items-center gap-4 ${compact ? "mb-6 lg:mb-8" : "mb-14 md:mb-20"}`}
    >
      <span className="font-mono text-xs text-accent tracking-[0.2em]">(05)</span>
      <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">
        Selected Work
      </span>
      <div className="relative flex-1 h-px bg-line overflow-hidden">{rail}</div>
      {aside}
    </div>
    <h2
      className="font-grotesk font-light tracking-tight"
      style={{ fontSize: compact ? "clamp(1.75rem, 3.4vw, 3rem)" : "clamp(1.75rem, 4.2vw, 3.5rem)" }}
    >
      Things I&apos;ve <em className="font-fraunces italic text-accent">built</em>.
    </h2>
  </div>
);

const ProjectLinks = ({ title, demoLink, codeLink }) => (
  <div className="flex flex-wrap items-center gap-3">
    {demoLink && (
      <Lean>
        <a
          href={demoLink}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-full font-grotesk font-medium text-sm tracking-wide hover:bg-ink transition-colors duration-300"
        >
          Visit live
          <HiOutlineArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </Lean>
    )}
    {codeLink ? (
      <a
        href={codeLink}
        target="_blank"
        rel="noreferrer"
        title="Source code"
        aria-label={`${title} source code`}
        className="p-3 border border-line rounded-full text-muted hover:text-accent hover:border-accent/40 transition-all duration-300"
      >
        <FiGithub size={16} />
      </a>
    ) : (
      <span className="px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase text-accent border border-accent/30 rounded-full whitespace-nowrap">
        Client work
      </span>
    )}
  </div>
);

const ReelButton = ({ label, disabled, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className="w-9 h-9 flex items-center justify-center rounded-full border border-line text-muted hover:text-accent hover:border-accent/40 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
  >
    {children}
  </button>
);

/**
 * Pinned "bending reel": while the section is pinned, scrolling runs the
 * project strip sideways and the strip bends at the edges (see bendingReel.js).
 * The caption below follows whichever project is centred; the arrows and a
 * click on any panel scroll the page to that project's spot in the pin.
 */
const ProjectReel = () => {
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const railRef = useRef(null);
  const reelRef = useRef(null);
  const triggerRef = useRef(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reel = createBendingReel(canvasRef.current, {
      sources: projects.map((p) => p.src),
      onActiveChange: (i) => {
        activeRef.current = i;
        setActive(i);
      },
    });
    reelRef.current = reel;

    const trigger = ScrollTrigger.create({
      trigger: pinRef.current,
      start: "top top",
      // One px of scroll moves the strip one px.
      end: () => `+=${reel.travel()}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        reel.setProgress(self.progress);
        if (railRef.current) {
          railRef.current.style.transform = `scaleX(${self.progress})`;
        }
      },
    });
    triggerRef.current = trigger;

    // Sections above this one mount lazily and settle to their real height
    // after this pin was measured — re-measure whenever the page grows.
    let refreshTimer = 0;
    const pageObserver = new ResizeObserver(() => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    pageObserver.observe(document.body);

    return () => {
      clearTimeout(refreshTimer);
      pageObserver.disconnect();
      trigger.kill();
      reel.destroy();
    };
  }, []);

  const goTo = (index) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const i = Math.max(0, Math.min(projects.length - 1, index));
    const top = trigger.start + (i / (projects.length - 1)) * (trigger.end - trigger.start);
    window.scrollTo({ top, behavior: "smooth" });
  };

  const panelAt = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return reelRef.current?.hitTest(e.clientX - rect.left) ?? -1;
  };

  // The centred panel opens its live site; any other panel is brought to centre.
  const onCanvasClick = (e) => {
    const i = panelAt(e);
    if (i < 0) return;
    if (i !== activeRef.current) goTo(i);
    else if (projects[i].demoLink) window.open(projects[i].demoLink, "_blank", "noopener");
  };

  const onCanvasMove = (e) => {
    const i = panelAt(e);
    const clickable = i >= 0 && (i !== activeRef.current || projects[i].demoLink);
    canvasRef.current.style.cursor = clickable ? "pointer" : "default";
  };

  const project = projects[active];

  return (
    <section className="relative w-full bg-bg text-ink overflow-hidden">
      <div ref={pinRef} className="relative h-screen flex flex-col overflow-hidden">
        <span className="section-watermark font-grotesk">05</span>

        <SectionHeader
          compact
          className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-24 lg:pt-28"
          rail={
            <span
              ref={railRef}
              className="absolute inset-0 origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          }
          aside={
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs tracking-[0.2em] text-muted tabular-nums">
                <span className="text-ink">{pad(active + 1)}</span> / {pad(projects.length)}
              </span>
              <div className="flex gap-2">
                <ReelButton
                  label="Previous project"
                  disabled={active === 0}
                  onClick={() => goTo(active - 1)}
                >
                  <HiOutlineArrowLeft size={14} />
                </ReelButton>
                <ReelButton
                  label="Next project"
                  disabled={active === projects.length - 1}
                  onClick={() => goTo(active + 1)}
                >
                  <HiOutlineArrowRight size={14} />
                </ReelButton>
              </div>
            </div>
          }
        />

        {/* The reel runs edge to edge, outside the content column */}
        <div className="relative flex-1 min-h-0 my-5 lg:my-7">
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            onClick={onCanvasClick}
            onPointerMove={onCanvasMove}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Captions for every project share one grid cell, so the block is
            always as tall as the longest one and the reel above never resizes
            as the active project changes. Only the centred one is shown. */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 pb-8 lg:pb-12">
          <p className="sr-only" aria-live="polite">
            {`${project.title}, project ${active + 1} of ${projects.length}`}
          </p>
          <div className="grid">
            {projects.map((p, i) => {
              const isActive = i === active;
              return (
                <div
                  key={p.id}
                  aria-hidden={!isActive}
                  inert={isActive ? undefined : ""}
                  className={`[grid-area:1/1] grid md:grid-cols-12 gap-5 md:gap-10 ${
                    isActive ? "reel-caption" : "invisible"
                  }`}
                >
                  <div className="md:col-span-5">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-accent">/{p.id}</span>
                      <h3 className="font-grotesk font-medium text-3xl lg:text-4xl tracking-tight">
                        {p.title}
                      </h3>
                    </div>
                    <div className="mt-5">
                      <ProjectLinks {...p} />
                    </div>
                  </div>
                  <div className="md:col-span-7">
                    <p className="text-muted text-sm lg:text-[15px] font-light leading-[1.75]">
                      {p.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/70 border border-line rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * The plain two-column grid — used on small or short screens and when reduced
 * motion is requested, where a pinned, scroll-driven reel would get in the way.
 */
const ProjectGrid = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".project-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-bg text-ink px-6 md:px-12 py-28 md:py-40 overflow-hidden"
    >
      <span className="section-watermark font-grotesk">05</span>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <SectionHeader className="mb-16 md:mb-24" />

        {/* Projects */}
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-24">
          {projects.map(
            ({ id, src, title, description, tags, demoLink, codeLink }, i) => (
              <article
                key={id}
                className={`project-card group ${
                  i % 2 === 1 ? "md:mt-24" : ""
                }`}
              >
                {/* Image */}
                <a
                  href={demoLink ?? undefined}
                  target={demoLink ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`relative block overflow-hidden rounded-xl border border-line aspect-[4/3] bg-bg ${
                    demoLink ? "" : "cursor-default"
                  }`}
                >
                  <img
                    src={src}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-bg/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Hover arrow */}
                  {demoLink && (
                    <span className="absolute top-5 right-5 w-11 h-11 rounded-full bg-accent text-bg flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400">
                      <HiOutlineArrowUpRight size={18} />
                    </span>
                  )}
                </a>

                {/* Meta */}
                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-accent">/{id}</span>
                      <a
                        href={demoLink ?? undefined}
                        target={demoLink ? "_blank" : undefined}
                        rel="noreferrer"
                        className="font-grotesk font-medium text-2xl md:text-3xl tracking-tight hover:text-accent transition-colors duration-300"
                      >
                        {title}
                      </a>
                    </div>
                    <p className="mt-3 text-muted text-sm md:text-base font-light leading-[1.8] max-w-xl">
                      {description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/70 border border-line rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {codeLink ? (
                    <a
                      href={codeLink}
                      target="_blank"
                      rel="noreferrer"
                      title="Source code"
                      aria-label={`${title} source code`}
                      className="shrink-0 mt-1 p-3 border border-line rounded-full text-muted hover:text-accent hover:border-accent/40 transition-all duration-300"
                    >
                      <FiGithub size={17} />
                    </a>
                  ) : (
                    <span className="shrink-0 mt-2 px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase text-accent border border-accent/30 rounded-full whitespace-nowrap">
                      Client work
                    </span>
                  )}
                </div>
              </article>
            )
          )}
        </div>

        {/* GitHub CTA */}
        <div className="mt-20 md:mt-28 flex justify-center">
          <a
            href="https://github.com/Shishodious"
            target="_blank"
            rel="noreferrer"
            className="u-link font-mono text-xs tracking-[0.25em] uppercase text-muted hover:text-ink transition-colors duration-300"
          >
            More on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
};


const Portfolio = () => {
  const reel = useMediaQuery(REEL_QUERY);
  return reel ? <ProjectReel /> : <ProjectGrid />;
};

export default Portfolio;
