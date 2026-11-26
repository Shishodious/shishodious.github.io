import { Fragment, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { HiOutlineArrowDown } from "react-icons/hi2";
import { PanelNumber } from "./Panel";
import VideoTile from "./VideoTile";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A clip set into the sentence like a word. They all loop together while the
 * hero is on screen, from small silent previews (the full edits live further
 * down the page), and rest on their posters otherwise.
 */
const Clip = ({ item, playing }) => {
  const video = useRef(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing) {
      // iOS only autoplays when the muted attribute itself is present
      v.muted = true;
      v.setAttribute("muted", "");
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [playing]);

  return (
    <span
      data-clip
      title={item.title}
      className="relative mx-[0.22em] inline-block h-[1.7em] w-[3em] overflow-hidden rounded-[0.32em] bg-ink/10 align-middle shadow-[0_14px_28px_-14px_rgba(0,0,0,0.45)] ring-1 ring-ink/10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110"
    >
      <video
        ref={video}
        src={item.preview}
        poster={item.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </span>
  );
};

/** Opening panel: a hello with the reel playing beside it, then the story with the work tucked in. */
const VideoHero = ({ hero }) => {
  const ref = useRef(null);
  const [onScreen, setOnScreen] = useState(false);

  // The inline clips play while any of the hero shows; reduced motion keeps them still.
  useEffect(() => {
    if (reducedMotion()) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia(ref.current);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hello]", { opacity: 0, y: 20, duration: 0.9 })
        .from("[data-tile]", { opacity: 0, scale: 0.85, rotate: -6, duration: 1.2, ease: "expo.out" }, "-=0.6")
        // Phrases stay inline so they wrap like prose, which rules out moving them: they fade.
        .from("[data-bit]", { opacity: 0, duration: 0.9, stagger: 0.07 }, "-=0.8")
        .from("[data-clip]", { scale: 0, duration: 0.7, stagger: 0.08, ease: "back.out(2)", clearProps: "transform" }, "-=0.9");
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={ref}
      data-tone="paper"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-bg px-6 pb-24 pt-28 text-center text-ink md:px-12"
    >
      <PanelNumber index="01" />

      <div className="flex flex-wrap items-end justify-center gap-x-[0.5em] gap-y-4 font-quicksand text-[clamp(1.25rem,2vw,2rem)] font-bold tracking-[-0.01em]">
        <h1 data-hello className="pb-[0.15em] [text-wrap:balance]">
          {hero.greeting}
        </h1>
        <VideoTile
          data-tile
          item={hero.reel}
          ratio={hero.reel.ratio}
          soundAt="top-2 right-2"
          className="w-[min(78vw,22rem,38svh)] rounded-2xl md:rounded-3xl"
        />
      </div>

      <p className="mt-[clamp(1.5rem,5svh,3.5rem)] max-w-[24ch] font-quicksand text-[clamp(1.5rem,min(2.7vw,4.6svh),2.9rem)] font-bold leading-[1.95] tracking-[-0.01em] md:max-w-[34ch]">
        {hero.story.map((bit, i) => (
          <Fragment key={i}>
            {typeof bit === "string" ? <span data-bit>{bit}</span> : <Clip item={bit} playing={onScreen} />}{" "}
          </Fragment>
        ))}
      </p>

      <HiOutlineArrowDown className="scroll-bounce absolute bottom-8 text-accent" size={16} aria-hidden="true" />
    </section>
  );
};

export default VideoHero;
