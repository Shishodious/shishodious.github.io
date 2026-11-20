import { lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

// What each door shows inside the pebble. Anything without an entry here gets
// the type specimen, so a newly enabled service still has something to show.
const SHOWCASE = {
  video: { video: videoHero.reel.src, poster: videoHero.reel.poster },
  apps: { board: AppsOS },
  brand: { board: BrandOS },
};

const COUNT = visibleServices.length;
const SPACING = 56; // degrees between neighbouring titles on the ring
const mod = (i) => ((i % COUNT) + COUNT) % COUNT;
// Shortest signed distance around the ring, in [-COUNT/2, COUNT/2).
const wrap = (d) => mod(d + COUNT / 2) - COUNT / 2;
// "Apps & Products" -> ["Apps &", "Products"]: the last word gets its own line.
const titleLines = (name) => {
  const words = name.split(" ");
  return [words.slice(0, -1).join(" "), words.at(-1)].filter(Boolean);
};

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The pebble's video: plays only while its door is in front and on screen. */
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

/**
 * The gate on "/": one door per service on a ring. The front door's name sits
 * big at the bottom with its neighbours curving away in outline; the pebble in
 * the middle plays that service's work and the backdrop glows in its colours.
 * Wheel, drag, arrow keys or a click on a side title turn the ring; clicking
 * the front title or the pebble walks into that world.
 */
const Chooser = () => {
  const [last] = useState(lastService);
  const [active, setActive] = useState(() => {
    const i = visibleServices.findIndex((s) => s.slug === last);
    return i < 0 ? 0 : i;
  });
  const [visible, setVisible] = useState(true);
  const [muted, setMuted] = useState(true);
  const [hovering, setHovering] = useState(false);

  const rootRef = useRef(null);
  const pebbleRef = useRef(null);
  const ambientRef = useRef(null);
  const badgeRef = useRef(null);
  const videoRef = useRef(null);
  const itemRefs = useRef([]);
  const sources = useRef([]); // per door: () => drawable element for the ambient glow
  const registers = useMemo(
    () => visibleServices.map((_, i) => (fn) => (sources.current[i] = fn)),
    [],
  );
  const pos = useRef({ v: active }); // continuous ring position, tweened
  const target = useRef(active); // where the ring is heading
  const activeRef = useRef(active);
  const drag = useRef(null);
  const widest = useRef(0); // widest title, measured on resize
  const suppressClick = useRef(false);

  useEffect(() => {
    setPageMeta({
      title: null,
      description:
        "Priyanshu Shishodia — video editing, content creation, brand websites and full-stack products, one person start to finish.",
      path: "/",
    });
  }, []);

  // Places every title on the ring and tips the pebble while it turns.
  const layout = useCallback(() => {
    const p = pos.current.v;
    // Wide enough apart that a neighbour never runs into the front title.
    const radius = Math.max(window.innerWidth * 0.52, widest.current * 0.82);
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = wrap(i - p);
      const deg = d * SPACING;
      const rad = (deg * Math.PI) / 180;
      const ad = Math.abs(d);
      el.style.transform = `translate3d(calc(-50% + ${Math.sin(rad) * radius}px), 0, ${
        (Math.cos(rad) - 1) * radius * 0.45
      }px) rotateY(${deg}deg)`;
      el.style.opacity = String(Math.min(1, Math.max(0, (1.45 - ad) / 0.45)));
      el.style.setProperty("--fill", String(Math.max(0, 1 - ad * 1.6)));
      el.style.pointerEvents = ad > 1.3 ? "none" : "auto";
      el.style.zIndex = String(10 - Math.round(ad * 4));
    });
    const turn = Math.sin((p - Math.floor(p)) * Math.PI);
    if (pebbleRef.current) {
      pebbleRef.current.style.transform = `rotateY(${turn * 34}deg) scale(${1 - turn * 0.07})`;
    }
    const front = mod(Math.round(p));
    if (front !== activeRef.current) {
      activeRef.current = front;
      setActive(front);
    }
  }, []);

  const spinTo = useCallback(
    (to) => {
      target.current = to;
      gsap.to(pos.current, {
        v: to,
        duration: reducedMotion() ? 0 : 1.1,
        ease: "power3.out",
        overwrite: true,
        onUpdate: layout,
      });
    },
    [layout],
  );

  // Turn to door `i` the short way round.
  const goTo = useCallback(
    (i) => spinTo(target.current + wrap(i - mod(target.current))),
    [spinTo],
  );

  useEffect(() => {
    const measure = () => {
      widest.current = Math.max(0, ...itemRefs.current.map((el) => el?.offsetWidth ?? 0));
      layout();
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [layout]);

  // Arrival: titles rise, the pebble settles in.
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.06, delay: 0.2 });
      gsap.from("[data-pebble]", { scale: 0.82, opacity: 0, duration: 1.6, ease: "power3.out" });
      gsap.from("[data-fade]", { opacity: 0, duration: 1, delay: 0.7, stagger: 0.1 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Pause the video and the glow once the hero has scrolled away.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // The wheel turns the ring while the page sits at the top. Past the last
  // door (or before the first) it scrolls the page as normal, so the contact
  // footer stays reachable. A step locks out the rest of a trackpad flick.
  useEffect(() => {
    const el = rootRef.current;
    let sum = 0;
    let lockedUntil = 0;
    const onWheel = (e) => {
      if (window.scrollY > 4) return;
      const now = performance.now();
      if (now < lockedUntil) {
        lockedUntil = Math.max(lockedUntil, now + 140);
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const i = mod(target.current);
      if ((delta > 0 && i >= COUNT - 1) || (delta < 0 && i <= 0)) {
        sum = 0;
        return;
      }
      // Stopping propagation keeps Lenis (listening on window) from scrolling.
      e.preventDefault();
      e.stopPropagation();
      sum += delta;
      if (Math.abs(sum) > 30) {
        goTo(i + Math.sign(sum));
        sum = 0;
        lockedUntil = now + 650;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo]);

  // Horizontal drag (or swipe) turns the ring freely and snaps on release.
  useEffect(() => {
    const move = (e) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x;
      if (Math.abs(dx) > 6) d.moved = true;
      if (!d.moved) return;
      const now = performance.now();
      d.velocity = (e.clientX - d.lastX) / Math.max(1, now - d.lastT);
      d.lastX = e.clientX;
      d.lastT = now;
      pos.current.v = d.start - dx / (window.innerWidth * 0.4);
      layout();
    };
    const end = (e) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.id) return;
      drag.current = null;
      if (!d.moved) return;
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);
      const fling = Math.max(-0.45, Math.min(0.45, -d.velocity * 0.35));
      spinTo(Math.round(pos.current.v + fling));
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [layout, spinTo]);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    gsap.killTweensOf(pos.current);
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      lastX: e.clientX,
      lastT: performance.now(),
      start: pos.current.v,
      velocity: 0,
      moved: false,
    };
  };

  // Left/right arrows turn the ring and keep focus on the front title.
  const onKeyDown = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = mod(target.current + (e.key === "ArrowRight" ? 1 : -1));
    goTo(next);
    if (rootRef.current.contains(document.activeElement)) {
      itemRefs.current[next]?.querySelector("a")?.focus({ preventScroll: true });
    }
  };

  // The backdrop: a tiny canvas fed from whatever the pebble shows, blurred
  // huge in CSS. Each frame is laid over the last at low opacity, so a change
  // of door crossfades on its own.
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

  // "Enter" badge trails the pointer over the pebble or front title (mouse only).
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

  const current = visibleServices[active];
  const hasVideo = Boolean(SHOWCASE[current.slug]?.video);
  const hoverProps = {
    onPointerEnter: (e) => e.pointerType === "mouse" && setHovering(true),
    onPointerLeave: () => setHovering(false),
  };

  return (
    <>
      <main
        ref={rootRef}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className="relative h-[100svh] min-h-[560px] overflow-hidden select-none touch-pan-y"
      >
        <canvas
          ref={ambientRef}
          width={48}
          height={36}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full scale-125 blur-[60px] brightness-[0.55] saturate-[1.3]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(var(--bg)/0.85)_100%)]" />
        {/* Ends on the plain background, which is where the footer starts */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-bg via-bg/60 to-transparent" />

        <div
          data-fade
          className="absolute inset-x-0 top-24 md:top-28 z-20 flex items-baseline justify-between px-6 md:px-12 font-display text-sm md:text-lg tracking-[0.03em] uppercase text-muted"
        >
          <h1>What can I do for you?</h1>
          <p className="hidden sm:block">Choose one — switch anytime</p>
        </div>

        {/* The pebble: that door's work, in a slowly breathing shape */}
        <div
          data-pebble
          className="absolute left-1/2 top-[14svh] md:top-[12svh] -translate-x-1/2 h-[60svh] md:h-[66svh] aspect-[0.62] [perspective:1200px]"
        >
          <WorldLink
            to={`/${current.slug}`}
            tabIndex={-1}
            aria-hidden="true"
            draggable={false}
            {...hoverProps}
            className="block h-full w-full"
          >
            <div
              ref={pebbleRef}
              className="pebble relative h-full w-full overflow-hidden bg-elev will-change-transform shadow-[0_0_140px_-30px_rgb(var(--accent)/0.55),inset_0_0_60px_rgba(255,255,255,0.08)]"
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
                className="pebble absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 via-35% to-transparent shadow-[inset_0_0_50px_rgba(0,0,0,0.35)]"
              />
            </div>
          </WorldLink>
        </div>

        {/* The ring of titles */}
        <div className="absolute inset-x-0 bottom-[calc(3.5rem+3svh)] md:bottom-[calc(3.75rem+4svh)] z-10 [perspective:1100px]">
          {visibleServices.map((service, i) => {
            const on = i === active;
            return (
              <div
                key={service.slug}
                ref={(el) => (itemRefs.current[i] = el)}
                className="absolute left-1/2 bottom-0 will-change-transform"
              >
                <WorldLink
                  to={`/${service.slug}`}
                  draggable={false}
                  aria-current={on ? "true" : undefined}
                  aria-label={`${service.name}: ${service.door}`}
                  onClick={(e) => {
                    if (i !== activeRef.current) {
                      e.preventDefault();
                      goTo(i);
                    }
                  }}
                  onFocus={(e) => e.currentTarget.matches(":focus-visible") && goTo(i)}
                  {...(on ? hoverProps : {})}
                  className="group block text-center outline-none"
                >
                  <span className="ring-door inline-block mb-3 md:mb-4 rounded-full bg-black/55 backdrop-blur-sm px-3 py-1.5 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent whitespace-nowrap">
                    0{i + 1} — {service.door}
                    {last === service.slug && <span className="text-muted"> · last visited</span>}
                  </span>
                  <span className="ring-title block font-helvetica font-bold whitespace-nowrap leading-[0.86] tracking-[-0.04em] text-[clamp(2.3rem,min(8vw,13svh),10rem)] group-focus-visible:underline decoration-accent decoration-4 underline-offset-8">
                    {titleLines(service.name).map((line) => (
                      <span key={line} className="block overflow-hidden pb-[0.18em] -mb-[0.14em]">
                        <span data-rise className="block">
                          {line}
                        </span>
                      </span>
                    ))}
                  </span>
                </WorldLink>
              </div>
            );
          })}
        </div>

        {/* Bottom bar: where you are on the ring, and sound for the reel */}
        <div
          data-fade
          className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-6 px-6 md:px-12 pb-5 md:pb-7 font-mono text-[11px] tracking-[0.25em] uppercase text-muted"
        >
          <p className="tabular-nums">
            <span className="text-ink">0{active + 1}</span> / 0{COUNT}
          </p>
          <p
            key={current.slug}
            className="rotate-in hidden md:block flex-1 max-w-md normal-case tracking-normal font-grotesk text-sm text-ink/75 text-center mx-auto"
          >
            {current.tagline}
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Scroll · drag</span>
            <button
              type="button"
              onClick={toggleSound}
              disabled={!hasVideo}
              aria-label={muted ? `Play ${current.name} reel with sound` : `Mute ${current.name} reel`}
              aria-pressed={!muted}
              className={`w-10 h-10 grid place-items-center rounded-full border border-ink/20 text-ink transition-all duration-500 hover:bg-accent hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                hasVideo ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {muted ? <HiOutlineSpeakerXMark size={16} /> : <HiOutlineSpeakerWave size={16} />}
            </button>
          </div>
        </div>

        {/* Trails the pointer, sitting below-right of it so it never hides the word */}
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

      {/* Numbered on from the doors */}
      <LazySection anchorId="contact">
        <Contact index={String(COUNT + 1).padStart(2, "0")} service={{ slug: "gate" }} />
      </LazySection>
    </>
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

export default Chooser;
