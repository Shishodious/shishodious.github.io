import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiGithub } from "react-icons/fi";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
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

const Portfolio = () => {
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
        {/* Section label */}
        <div className="flex items-center gap-4 mb-14 md:mb-20">
          <span className="font-mono text-xs text-accent tracking-[0.2em]">(05)</span>
          <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">
            Selected Work
          </span>
          <div className="flex-1 h-px bg-line" />
        </div>

        <h2
          className="font-grotesk font-light tracking-tight mb-16 md:mb-24"
          style={{ fontSize: "clamp(1.75rem, 4.2vw, 3.5rem)" }}
        >
          Things I&apos;ve{" "}
          <em className="font-fraunces italic text-accent">built</em>.
        </h2>

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

export default Portfolio;
