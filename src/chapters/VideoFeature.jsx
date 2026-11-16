import Panel from "./Panel";
import VideoTile from "./VideoTile";

/**
 * One wide edit, as large as the screen allows at its own aspect ratio, with
 * its title and running time underneath. `heading` opens a run of panels.
 */
const VideoFeature = ({ index, heading, item }) => {
  const ratio = item.ratio ?? "16 / 9";

  return (
    <Panel index={index} tone={item.tone}>
      {heading && (
        <h2 data-reveal className="mb-10 font-grotesk font-light tracking-tight leading-[1.05] text-[clamp(3rem,6.5vw,6.5rem)]">
          {heading}
        </h2>
      )}
      <div
        style={{ "--ratio": ratio }}
        className={`w-full mx-auto ${
          heading ? "md:max-w-[calc(56svh*(var(--ratio)))]" : "md:max-w-[calc(68svh*(var(--ratio)))]"
        }`}
      >
        <VideoTile data-reveal item={item} ratio={ratio} className="w-full" />
        <p data-reveal className="mt-4 flex justify-between gap-4 font-mono text-[11px] tracking-[0.2em] uppercase text-muted">
          <span className="text-ink/80">{item.title}</span>
          {item.length && <span>{item.length}</span>}
        </p>
      </div>
    </Panel>
  );
};

export default VideoFeature;
