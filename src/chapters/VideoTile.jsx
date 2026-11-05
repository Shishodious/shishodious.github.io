import { useEffect, useRef, useState } from "react";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";

// Only one tile plays sound at a time.
let audible = null;

/** Film-leader countdown shown until a real video is supplied. */
const Leader = ({ title, ratio }) => (
  <div className="absolute inset-0 font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
    <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-[14%] w-[72%] h-[72%]">
      <path className="leader-sweep" d="M50 50 L50 3 A47 47 0 0 1 97 50 Z" fill="currentColor" opacity="0.28" />
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.5" />
      <path d="M0 50 H100 M50 0 V100" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.5" />
    </svg>
    <span className="absolute top-3 left-3 md:top-4 md:left-4 text-ink/80">{title}</span>
    <span className="absolute bottom-3 left-3 md:bottom-4 md:left-4">Placeholder</span>
    <span className="absolute bottom-3 right-3 md:bottom-4 md:right-4">{ratio.replace(" / ", ":")}</span>
  </div>
);

/**
 * Muted loop that only plays while on screen. Reduced-motion visitors get
 * native controls and nothing starts by itself.
 */
const Player = ({ item, sound, onFail }) => {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (reduced) return;
    const video = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.muted = true;
          video.pause();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  const toggleSound = () => {
    const video = ref.current;
    if (video.muted) {
      if (audible && audible !== video) audible.muted = true;
      audible = video;
    }
    video.muted = !video.muted;
  };

  return (
    <>
      <video
        ref={ref}
        src={item.src}
        poster={item.poster}
        aria-label={item.title}
        muted
        loop
        playsInline
        controls={reduced}
        preload={reduced ? "metadata" : "none"}
        onError={onFail}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {sound && !reduced && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? `Play ${item.title} with sound` : `Mute ${item.title}`}
          aria-pressed={!muted}
          className="absolute bottom-2 right-2 w-11 h-11 grid place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm cursor-pointer transition-colors duration-300 hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {muted ? <HiOutlineSpeakerXMark size={18} /> : <HiOutlineSpeakerWave size={18} />}
        </button>
      )}
    </>
  );
};

/**
 * One framed video from services/video.js. Always in the dark cinema palette,
 * whichever tone of panel it sits on. A missing or broken file falls back to
 * the placeholder rather than an empty frame.
 */
const VideoTile = ({ item, ratio, sound = true, className = "", ...rest }) => {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      {...rest}
      data-world="video"
      style={{ aspectRatio: ratio }}
      className={`relative overflow-hidden rounded-xl md:rounded-2xl border border-ink/25 bg-elev text-ink shadow-[0_24px_50px_-28px_rgba(0,0,0,0.6)] ${className}`}
    >
      {item.src && !failed ? (
        <Player item={item} sound={sound} onFail={() => setFailed(true)} />
      ) : (
        <Leader title={item.title} ratio={ratio} />
      )}
    </figure>
  );
};

export default VideoTile;
