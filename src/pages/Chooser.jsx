import { lazy, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { HiOutlineArrowUpRight, HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import LazySection from "../components/LazySection";
import { lastService, visibleServices } from "../services/registry";
import { hero as videoHero } from "../services/video";
import AppsOS from "../components/AppsOS";
import BrandOS from "../components/BrandOS";
import WorldLink from "../shell/WorldLink";
import { setPageMeta } from "../services/meta";

const Contact = lazy(() => import("../components/Contact"));

// What each service shows on the preview card. Anything without an entry here
// gets the type specimen, so a newly enabled service still has something to show.
const SHOWCASE = {
  video: { video: videoHero.reel.src, poster: videoHero.reel.poster },
  apps: { board: AppsOS },
  brand: { board: BrandOS },
};

const COUNT = visibleServices.length;
const ADVANCE_MS = 6500; // idle time on each service before the preview moves on
const mod = (i) => ((i % COUNT) + COUNT) % COUNT;
// Shortest signed distance between two services, in [-COUNT/2, COUNT/2).
const wrap = (d) => mod(d + COUNT / 2) - COUNT / 2;
const pad = (n) => String(n).padStart(2, "0");

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** The reel: plays only while its service is selected and the hero is on screen. */
const VideoShow = ({ show, on, visible, videoRef }) => {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (on && visible && !reducedMotion()) {
      video.play().catch(() => {});
    } else {
      video.pause();
      if (!on) {
        video.muted = true;
        video.setAttribute("muted", "");
      }
    }
  }, [on, visible, videoRef]);

  return (
    <video
      ref={videoRef}
      src={show.video}
      poster={show.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
};

/** VideoShow, plus handing its element to the ambient glow. */
const VideoShowRegistered = ({ register, ...props }) => {
  const { videoRef } = props;
  useEffect(() => {
    register(() => videoRef.current);
  }, [register, videoRef]);
  return <VideoShow {...props} />;
};

/** Case-study screenshots, panned slowly across one at a time. */
const ImagesShow = ({ show, on, register }) => {
  const [shown, setShown] = useState(0);
  const imgs = useRef([]);

  useEffect(() => {
    register(() => imgs.current[shown]);
  }, [register, shown]);

  useEffect(() => {
    if (!on || reducedMotion()) return;
    const id = setInterval(() => setShown((s) => (s + 1) % show.images.length), 7000);
    return () => clearInterval(id);
  }, [on, show.images.length]);

  return show.images.map((src, i) => (
    <img
      key={src}
      ref={(el) => (imgs.current[i] = el)}
      src={src}
      alt=""
      draggable={false}
      loading={i === 0 ? "eager" : "lazy"}
      className={`pan absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
        i === shown ? "opacity-100" : "opacity-0"
      }`}
    />
  ));
};

/** No footage yet: a type specimen in the brand world's paper and red. */
const Specimen = ({ register }) => {
  useEffect(() => {
    const swatch = document.createElement("canvas");
    swatch.width = 8;
    swatch.height = 8;
    const ctx = swatch.getContext("2d");
    // The glow behind it: mostly the brand red, a little paper, so the
    // backdrop warms up instead of washing out grey.
    ctx.fillStyle = "#3a0c09";
    ctx.fillRect(0, 0, 8, 8);
    ctx.fillStyle = "#d42a1f";
    ctx.fillRect(2, 3, 4, 5);
    ctx.fillStyle = "#efede9";
    ctx.fillRect(3, 1, 2, 2);
    register(() => swatch);
  }, [register]);

  return (
    <div className="absolute inset-0 bg-[#efede9] text-[#121212] flex flex-col items-center pt-[22%]">
      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#6f6b66]">Type · Colour</span>
      <span className="mt-[2svh] font-fraunces italic font-light leading-none text-[clamp(5rem,22svh,14rem)]">Aa</span>
      <span className="mt-[2svh] h-[6svh] w-[6svh] rounded-full bg-[#d42a1f]" />
    </div>
  );
};

/** A name whose letters roll up into the accent colour while `on` (see .roll-char). */
const RollName = ({ text, on }) => (
  <span data-on={on} aria-hidden="true" className="block whitespace-nowrap">
    {[...text].map((ch, i) => {
      const glyph = ch === " " ? " " : ch;
      return (
        <span key={i} className="roll-char" style={{ "--i": i }}>
          <span className="roll-a">{glyph}</span>
          <span className="roll-b">{glyph}</span>
        </span>
      );
    })}
  </span>
);

/**
 * The gate on "/": who this is, and the three services as a numbered index.
 * Hovering or focusing a service previews its work on the 3D card; clicking
 * walks into that world. Left alone, the preview steps through the services.
 */
const Chooser = () => {
  const [last] = useState(lastService);
  const [active, setActive] = useState(() => {
    const i = visibleServices.findIndex((s) => s.slug === last);
    return i < 0 ? 0 : i;
  });
  const [visible, setVisible] = useState(true);
  const [muted, setMuted] = useState(true);
  const [hovering, setHovering] = useState(false); // pointer over the card: shows the Enter badge
  const [pointerIn, setPointerIn] = useState(false); // pointer over the index or card: holds the preview
  const [focusIn, setFocusIn] = useState(false);

  const rootRef = useRef(null);
  const listRef = useRef(null);
  const cardRef = useRef(null);
  const tiltRef = useRef(null);
  const swingRef = useRef(null);
  const ambientRef = useRef(null);
  const badgeRef = useRef(null);
  const videoRef = useRef(null);
  const activeRef = useRef(active);
  const sources = useRef([]); // per service: () => drawable element for the ambient glow
  const registers = useMemo(
    () => visibleServices.map((_, i) => (fn) => (sources.current[i] = fn)),
    [],
  );

  useEffect(() => {
    setPageMeta({
      title: null,
      description:
        "Priyanshu Shishodia — video editing, content creation, brand websites and full-stack products, one person start to finish.",
      path: "/",
    });
  }, []);

  // A change of service swings the card round from the side it came from.
  useEffect(() => {
    const prev = activeRef.current;
    activeRef.current = active;
    if (prev === active || reducedMotion() || !swingRef.current) return;
    const dir = Math.sign(wrap(active - prev)) || 1;
    gsap.fromTo(
      swingRef.current,
      { rotateY: dir * -26, scale: 0.94 },
      { rotateY: 0, scale: 1, duration: 1.2, ease: "expo.out", overwrite: true },
    );
  }, [active]);

  // Arrival: the headline rises line by line, the index follows, the card
  // tips up out of the floor.
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", { yPercent: 115, duration: 1.3, ease: "power4.out", stagger: 0.08, delay: 0.15 });
      gsap.from("[data-row]", { y: 36, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.08, delay: 0.45 });
      gsap.from("[data-card]", {
        y: 90,
        rotateX: 22,
        opacity: 0,
        duration: 1.7,
        ease: "expo.out",
        delay: 0.25,
        transformPerspective: 1400,
        clearProps: "transform,opacity",
      });
      gsap.from("[data-fade]", { opacity: 0, duration: 1, delay: 0.6, stagger: 0.1 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Pause the video, the glow and the auto-advance once the hero scrolls away.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // The card leans toward the pointer and catches the light where it points.
  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    const card = cardRef.current;
    const tilt = tiltRef.current;
    const rx = gsap.quickTo(tilt, "rotateX", { duration: 0.8, ease: "power3.out" });
    const ry = gsap.quickTo(tilt, "rotateY", { duration: 0.8, ease: "power3.out" });
    const move = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      ry((x - 0.5) * 16);
      rx((0.5 - y) * 12);
      // Read by .card-glare inside the face
      tilt.style.setProperty("--mx", `${x * 100}%`);
      tilt.style.setProperty("--my", `${y * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    card.addEventListener("pointermove", move, { passive: true });
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
    };
  }, []);

  // The backdrop: a tiny canvas fed from whatever the card shows, blurred huge
  // in CSS. Each frame is laid over the last at low opacity, so a change of
  // service crossfades on its own.
  useEffect(() => {
    if (!visible) return;
    const canvas = ambientRef.current;
    const ctx = canvas.getContext("2d");
    let frame;
    let tick = 0;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (document.hidden || tick++ % 3) return;
      const source = sources.current[activeRef.current]?.();
      if (!source) return;
      if (source.tagName === "VIDEO" && source.readyState < 2) return;
      if (source.tagName === "IMG" && !source.complete) return;
      ctx.globalAlpha = 0.14;
      ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  // "Enter" badge trails the pointer over the card (mouse only).
  useEffect(() => {
    const badge = badgeRef.current;
    if (!finePointer()) return;
    const x = gsap.quickTo(badge, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(badge, "y", { duration: 0.45, ease: "power3.out" });
    const move = (e) => {
      x(e.clientX);
      y(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (video.muted) video.setAttribute("muted", "");
    else video.removeAttribute("muted");
    if (!video.muted && video.paused) video.play().catch(() => {});
    setMuted(video.muted);
  };

  useEffect(() => {
    if (!SHOWCASE[visibleServices[active].slug]?.video) setMuted(true);
  }, [active]);

  // Up/down (or left/right) move through the index; focus previews as it goes.
  const onListKeyDown = (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const links = listRef.current.querySelectorAll("a");
    const from = [...links].indexOf(document.activeElement);
    links[mod((from < 0 ? active : from) + step)]?.focus();
  };

  const current = visibleServices[active];
  const hasVideo = Boolean(SHOWCASE[current.slug]?.video);
  // The preview holds still while someone is looking at it or listening.
  const holding = pointerIn || focusIn || !muted || !visible;
  const holdProps = {
    onPointerEnter: (e) => e.pointerType === "mouse" && setPointerIn(true),
    onPointerLeave: () => setPointerIn(false),
  };

  return (
    <>
      {/* clip, not just hidden: the scaled glow overflows, and a hidden box can
          still be scrolled by focus or scrollIntoView, shifting the whole hero */}
      <main ref={rootRef} className="relative min-h-[100svh] overflow-hidden supports-[overflow:clip]:overflow-clip">
        <canvas
          ref={ambientRef}
          width={48}
          height={36}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full scale-125 blur-[70px] brightness-[0.5] saturate-[1.35]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,transparent_20%,rgb(var(--bg)/0.92)_78%)]"
        />
        {/* Ends on the plain background, which is where the footer starts */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1440px] min-h-[100svh] px-5 sm:px-6 md:px-12 pt-24 md:pt-28 pb-10 lg:pb-12 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_1fr] gap-x-10 xl:gap-x-16 content-center">
          {/* Who, and the question */}
          <header className="lg:col-span-7 lg:row-start-1 lg:self-end">
            <p
              data-fade
              className="flex items-center gap-3 font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-muted"
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to work
              <span className="text-ink/20">/</span>
              <span className="text-ink/70">Priyanshu Shishodia</span>
            </p>

            <h1 className="mt-5 md:mt-7 font-grotesk font-light tracking-[-0.04em] leading-[0.94] text-[clamp(2.75rem,5.5vw,6rem)]">
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-rise className="block">
                  What can I do
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.12em] -mt-[0.08em]">
                <span data-rise className="block">
                  for <em className="font-fraunces italic font-light text-accent pr-[0.04em]">you</em>?
                </span>
              </span>
            </h1>

            <p data-fade className="mt-3 md:mt-6 max-w-md text-sm sm:text-[15px] md:text-lg font-light leading-relaxed text-muted">
              Edits that hold attention, brand sites that feel like the brand, and products shipped end to end. One
              person, start to finish.
            </p>
          </header>

          {/* The preview card: a 3D stack, tilting toward the pointer */}
          <div
            ref={cardRef}
            data-card
            className="relative mt-8 lg:mt-0 lg:col-start-8 lg:col-span-5 lg:row-start-1 lg:row-span-2 lg:self-center justify-self-center lg:justify-self-end w-[min(46vw,21svh)] sm:w-[min(54vw,30svh)] lg:w-auto lg:h-[min(calc(100svh-11rem),780px)] aspect-[0.64] [perspective:1600px]"
            {...holdProps}
          >
            <div className="card-float h-full w-full [transform-style:preserve-3d]">
              <div ref={tiltRef} className="h-full w-full [transform-style:preserve-3d] will-change-transform">
                <div ref={swingRef} className="relative h-full w-full [transform-style:preserve-3d]">
                  {/* The other doors, fanned behind */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[1.75rem] md:rounded-[2.25rem] border border-ink/10 bg-elev/70 [transform:translate3d(9%,5%,-90px)_rotate(5deg)]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[1.75rem] md:rounded-[2.25rem] border border-ink/10 bg-elev/80 [transform:translate3d(4.5%,2.5%,-45px)_rotate(2.5deg)]"
                  />

                  <WorldLink
                    to={`/${current.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    draggable={false}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
                    onPointerLeave={() => setHovering(false)}
                    className="group/face absolute inset-0 block overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] bg-elev ring-1 ring-ink/15 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9),0_0_160px_-50px_rgb(var(--accent)/0.6)]"
                  >
                    {visibleServices.map((service, i) => {
                      const show = SHOWCASE[service.slug];
                      const on = i === active;
                      const register = registers[i];
                      return (
                        <div
                          key={service.slug}
                          className={`absolute inset-0 transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`}
                        >
                          {show?.board ? (
                            <show.board on={on} register={register} />
                          ) : show?.video ? (
                            <VideoShowRegistered
                              show={show}
                              on={on}
                              visible={visible}
                              videoRef={videoRef}
                              register={register}
                            />
                          ) : show?.images?.length ? (
                            <ImagesShow show={show} on={on} register={register} />
                          ) : (
                            <Specimen register={register} />
                          )}
                        </div>
                      );
                    })}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 via-40% to-black/20"
                    />
                    <div
                      aria-hidden="true"
                      className="card-glare absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/face:opacity-100"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 text-white">
                      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60 tabular-nums">
                        {pad(active + 1)} / {pad(COUNT)}
                      </p>
                      <p
                        key={current.slug}
                        className="rotate-in hidden sm:block mt-2 max-w-[24ch] font-grotesk text-sm md:text-[17px] leading-snug text-white/90"
                      >
                        {current.tagline}
                      </p>
                    </div>
                  </WorldLink>

                  {/* Labels floating in front of the card, so the tilt shows its depth */}
                  <p
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-3 md:-left-6 top-6 md:top-10 [transform:translateZ(70px)] rounded-full bg-black/60 backdrop-blur-md ring-1 ring-white/10 pl-2.5 pr-3.5 py-1.5 font-mono text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-white flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="hidden sm:inline">Now showing ·</span> {current.word}
                  </p>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-3 md:-right-5 bottom-5 md:bottom-8 [transform:translateZ(90px)] grid place-items-center w-11 h-11 md:w-16 md:h-16 rounded-full bg-accent text-bg shadow-[0_18px_40px_-12px_rgb(var(--accent)/0.8)]"
                  >
                    <HiOutlineArrowUpRight size={20} />
                  </span>
                  <button
                    type="button"
                    onClick={toggleSound}
                    disabled={!hasVideo}
                    tabIndex={hasVideo ? 0 : -1}
                    aria-label={muted ? `Play ${current.name} reel with sound` : `Mute ${current.name} reel`}
                    aria-pressed={!muted}
                    className={`absolute right-4 top-4 md:right-6 md:top-6 [transform:translateZ(60px)] w-10 h-10 md:w-11 md:h-11 grid place-items-center rounded-full bg-black/55 backdrop-blur-md ring-1 ring-white/15 text-white cursor-pointer transition-all duration-500 hover:bg-accent hover:ring-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      hasVideo ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {muted ? <HiOutlineSpeakerXMark size={17} /> : <HiOutlineSpeakerWave size={17} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* The index: every service at once */}
          <nav aria-label="Services" className="mt-8 lg:mt-10 lg:col-span-7 lg:row-start-2 lg:self-start">
            <ol
              ref={listRef}
              onKeyDown={onListKeyDown}
              onFocus={() => setFocusIn(true)}
              onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocusIn(false)}
              {...holdProps}
              className="border-b border-ink/10"
            >
              {visibleServices.map((service, i) => {
                const on = i === active;
                return (
                  <li key={service.slug} data-row>
                    <WorldLink
                      to={`/${service.slug}`}
                      draggable={false}
                      aria-current={on ? "true" : undefined}
                      aria-label={`${service.name}: want to ${service.door}`}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                      onFocus={() => setActive(i)}
                      className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-3.5 md:gap-x-8 py-3 md:py-4 border-t border-ink/10 outline-none focus-visible:bg-ink/[0.03]"
                    >
                      {on && COUNT > 1 && (
                        <span
                          key={`${service.slug}-${active}`}
                          aria-hidden="true"
                          className="row-progress"
                          style={{ animationDuration: `${ADVANCE_MS}ms`, animationPlayState: holding ? "paused" : "running" }}
                          onAnimationEnd={(e) => e.target === e.currentTarget && setActive((a) => mod(a + 1))}
                        />
                      )}
                      <span
                        className={`self-start pt-[0.6em] font-mono text-[10px] md:text-[11px] tabular-nums tracking-[0.2em] transition-colors duration-500 ${
                          on ? "text-accent" : "text-muted"
                        }`}
                      >
                        {pad(i + 1)}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block font-grotesk font-medium tracking-[-0.035em] leading-[1.22] -my-[0.1em] text-[clamp(1.6rem,3.3vw,3.4rem)] transition-colors duration-500 ${
                            on ? "text-ink" : "text-ink/40 group-hover:text-ink/70"
                          }`}
                        >
                          <RollName text={service.name} on={on} />
                        </span>
                        <span className="mt-1.5 md:mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] md:text-[10px] tracking-[0.14em] md:tracking-[0.22em] uppercase text-muted">
                          Want to {service.door}
                          {last === service.slug && (
                            <span className="rounded-full border border-ink/15 px-2 py-0.5 text-ink/70 tracking-[0.18em]">
                              Last visited
                            </span>
                          )}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`grid place-items-center w-10 h-10 md:w-14 md:h-14 rounded-full border transition-all duration-500 ease-[cubic-bezier(0.34,1.36,0.64,1)] ${
                          on
                            ? "bg-ink border-ink text-bg rotate-0 scale-100"
                            : "border-ink/15 text-ink/50 -rotate-45 scale-90 group-hover:scale-100"
                        }`}
                      >
                        <HiOutlineArrowUpRight size={18} />
                      </span>
                    </WorldLink>
                  </li>
                );
              })}
            </ol>

            <p
              data-fade
              className="mt-5 flex items-center justify-between gap-6 font-mono text-[10px] tracking-[0.25em] uppercase text-muted"
            >
              <span className="hidden md:inline">Hover to preview · Click to enter</span>
              <span className="md:hidden">Tap a service to enter</span>
              <span className="hidden sm:inline">Switch anytime</span>
            </p>
          </nav>
        </div>

        {/* Trails the pointer, sitting below-right of it so it never hides the work */}
        <div ref={badgeRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block">
          <div
            className={`translate-x-6 translate-y-6 origin-top-left w-[4.5rem] h-[4.5rem] rounded-full bg-accent text-bg flex items-center justify-center gap-1 font-mono text-[10px] tracking-[0.25em] uppercase transition-all duration-500 ease-[cubic-bezier(0.34,1.36,0.64,1)] ${
              hovering ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            Enter <HiOutlineArrowUpRight size={12} />
          </div>
        </div>
      </main>

      {/* Numbered on from the services */}
      <LazySection anchorId="contact">
        <Contact index={pad(COUNT + 1)} service={{ slug: "gate" }} />
      </LazySection>
    </>
  );
};

export default Chooser;
