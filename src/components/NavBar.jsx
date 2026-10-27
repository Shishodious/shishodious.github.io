import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { HiMiniBars2, HiXMark } from "react-icons/hi2";
import { Link as RouterLink } from "react-router-dom";
import Lean from "./effects/Lean";
import ServiceSwitcher from "../shell/ServiceSwitcher";
import SectionLink from "../shell/SectionLink";
import { useActiveSection } from "../shell/sectionScroll";
import { services } from "../services/registry";

// The active pill overshoots a touch on arrival; the hover ghost just glides.
const SLIDE =
  "transform 0.55s cubic-bezier(0.34, 1.36, 0.64, 1), width 0.55s cubic-bezier(0.34, 1.36, 0.64, 1)";
const GLIDE =
  "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), width 0.35s cubic-bezier(0.22, 1, 0.36, 1)";
const FADE = "opacity 0.3s ease";

const HIDDEN = { x: 0, w: 0, on: false, snap: true };

const NavBar = ({ service }) => {
  // Section links come from the current world's chapters; the gate has none.
  const links = (service?.chapters ?? [])
    .filter((c) => c.nav)
    .map((c, i) => ({ id: i + 1, link: c.id, label: c.nav }));

  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Desktop links sit on a track; one pill marks the section in view, a fainter
  // one follows the pointer. Both are positioned from the links' own boxes.
  const trackRef = useRef(null);
  const active = useActiveSection(links.map((l) => l.link));
  const [hovered, setHovered] = useState(null);
  const [pill, setPill] = useState(HIDDEN);
  const [ghost, setGhost] = useState(HIDDEN);
  const [layoutTick, setLayoutTick] = useState(0);

  // A new world has different sections; drop the old highlight and close the menu.
  useEffect(() => {
    setHovered(null);
    setNav(false);
  }, [service?.slug]);

  // Web fonts and resizes change link widths, so re-measure after either.
  useEffect(() => {
    const bump = () => setLayoutTick((t) => t + 1);
    document.fonts?.ready.then(bump);
    window.addEventListener("resize", bump);
    return () => window.removeEventListener("resize", bump);
  }, []);

  useLayoutEffect(() => {
    const measure = (key) => {
      const el = key && trackRef.current?.querySelector(`[data-nav="${key}"]`);
      return el ? { x: el.offsetLeft, w: el.offsetWidth } : null;
    };
    // A pill appearing from nothing fades in where it lands (`snap`) instead
    // of sliding over from wherever it was last hidden.
    const place = (key) => (prev) => {
      const box = measure(key);
      return box ? { ...box, on: true, snap: !prev.on } : { ...prev, on: false };
    };
    setPill(place(active));
    setGhost(place(hovered));
  }, [active, hovered, layoutTick]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = nav ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [nav]);

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[72px] px-6 md:px-12 z-50 flex items-center justify-between text-ink transition-all duration-500 ${
        scrolled
          ? "bg-bg/85 backdrop-blur-xl border-b border-line"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <RouterLink to="/" aria-label="All services" className="cursor-pointer group">
        <span className="font-grotesk font-semibold text-lg tracking-tight">
          Priyanshu
          <span className="text-accent transition-colors duration-300 group-hover:text-ink">
            .
          </span>
        </span>
      </RouterLink>

      {/* Desktop menu */}
      <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
        {links.length > 0 && (
          <div
            ref={trackRef}
            onMouseLeave={() => setHovered(null)}
            className="relative flex items-center p-1 rounded-full border border-line bg-bg/30 backdrop-blur-md"
          >
            <span
              aria-hidden="true"
              className="absolute top-1 bottom-1 left-0 rounded-full bg-ink/[0.07] pointer-events-none"
              style={{
                width: ghost.w,
                transform: `translateX(${ghost.x}px)`,
                opacity: ghost.on ? 1 : 0,
                transition: ghost.snap ? FADE : `${GLIDE}, ${FADE}`,
              }}
            />
            <span
              aria-hidden="true"
              className="absolute top-1 bottom-1 left-0 rounded-full bg-accent pointer-events-none"
              style={{
                width: pill.w,
                transform: `translateX(${pill.x}px)`,
                opacity: pill.on ? 1 : 0,
                transition: pill.snap ? FADE : `${SLIDE}, ${FADE}`,
              }}
            />
            {links.map(({ id, link, label }) => {
              const isActive = active === link;
              return (
                <SectionLink
                  key={id}
                  to={link}
                    data-nav={link}
                  onMouseEnter={() => setHovered(link)}
                  onFocus={() => setHovered(link)}
                  onBlur={() => setHovered(null)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative z-10 cursor-pointer px-3.5 xl:px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.2em] uppercase whitespace-nowrap outline-none focus-visible:ring-1 focus-visible:ring-accent/60 transition-colors duration-300 ${
                    isActive ? "text-bg delay-100" : "text-muted hover:text-ink"
                  }`}
                >
                  <span
                    className={`mr-1.5 transition-colors duration-300 ${
                      isActive ? "text-bg/60 delay-100" : "text-accent/80"
                    }`}
                  >
                    0{id}
                  </span>
                  {label}
                </SectionLink>
              );
            })}
          </div>
        )}
        {service && <ServiceSwitcher service={service} />}
        {/* Resume also lives in the socials rail, so it gives way on tight widths */}
        {service?.slug === "apps" && (
          <Lean className="hidden xl:block">
            <a
              href="/Resume.pdf"
              download="Priyanshu-Shishodia-Resume.pdf"
              className="px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] uppercase border border-ink/20 rounded-full hover:border-accent hover:text-accent transition-colors duration-300"
            >
              Resume
            </a>
          </Lean>
        )}
      </nav>

      {/* Mobile menu toggle */}
      <button
        onClick={() => setNav(!nav)}
        aria-label={nav ? "Close menu" : "Open menu"}
        className="cursor-pointer z-[60] text-ink lg:hidden p-2 -mr-2"
      >
        {nav ? <HiXMark size={26} /> : <HiMiniBars2 size={26} />}
      </button>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 h-[100dvh] bg-bg flex flex-col justify-center px-8 transform transition-all duration-500 ease-in-out z-50 lg:hidden ${
          nav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <ul className="space-y-2">
          {links.map(({ id, link, label }) => (
            <li key={id} className="overflow-hidden border-b border-line">
              <SectionLink
                to={link}
                onClick={() => setNav(false)}
                className="group flex items-baseline gap-4 py-4 cursor-pointer"
              >
                <span className="font-mono text-xs text-accent">0{id}</span>
                <span className="font-fraunces italic font-light text-4xl text-ink group-hover:text-accent group-hover:translate-x-2 transition-all duration-300 inline-block">
                  {label}
                </span>
              </SectionLink>
            </li>
          ))}
        </ul>

        <p className="mt-10 font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
          Services
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {services.map((s) => (
            <li key={s.slug}>
              <RouterLink
                to={`/${s.slug}`}
                onClick={() => setNav(false)}
                aria-current={s.slug === service?.slug ? "page" : undefined}
                className={`inline-flex px-4 py-2 rounded-full border font-mono text-[11px] tracking-[0.15em] uppercase transition-colors duration-300 ${
                  s.slug === service?.slug
                    ? "border-accent text-accent"
                    : "border-line text-ink hover:border-ink/30"
                }`}
              >
                {s.name}
              </RouterLink>
            </li>
          ))}
        </ul>

        {service?.slug === "apps" && (
          <a
            href="/Resume.pdf"
            download="Priyanshu-Shishodia-Resume.pdf"
            className="mt-10 inline-flex w-fit px-6 py-3 font-mono text-xs tracking-[0.2em] uppercase border border-ink/20 rounded-full text-ink"
          >
            Download resume
          </a>
        )}
      </div>
    </header>
  );
};

export default NavBar;
