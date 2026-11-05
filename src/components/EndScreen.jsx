import { useEffect, useRef } from "react";
import { createHaze } from "./effects/shaders/haze";
import { Leader } from "../chapters/VideoTile";
import { worldColors } from "../shell/worldColors";

// The end card under the footer, served from public/. Without a `src`, a
// placeholder shows instead.
const END_CARD = { src: "/end-card.gif" };

/**
 * The closing screen of every service page: the footer floats as a card on the
 * world's coloured haze, with a small end card below it. The haze only runs
 * while on screen; reduced motion and no-WebGL visitors get a still gradient.
 */
const EndScreen = ({ world, children }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    let haze = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !haze) {
          haze = createHaze(canvas);
          haze?.setWorld({ ...worldColors(world), glow: 0.95 });
        } else if (!entry.isIntersecting && haze) {
          haze.destroy();
          haze = null;
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      haze?.destroy();
    };
  }, [world]);

  return (
    <div className="end-screen relative overflow-hidden px-3 sm:px-5 md:px-10 pt-3 sm:pt-5 md:pt-10">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full" />
      {/* Eases out of the panel above instead of starting on a hard line */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg to-transparent" />

      <div className="relative">{children}</div>

      <div className="relative grid place-items-center h-[clamp(11rem,26svh,15rem)]">
        <div className="relative w-[100px] aspect-[100/77] overflow-hidden bg-bg text-ink shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)]">
          {END_CARD.src ? (
            <img src={END_CARD.src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <Leader />
          )}
        </div>
      </div>
    </div>
  );
};

export default EndScreen;
