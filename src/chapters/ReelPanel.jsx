import Panel from "./Panel";
import VideoTile from "./VideoTile";

/** Three vertical videos: spaced across on desktop, a swipeable strip on phones. */
const ReelPanel = ({ index, tone, title, reels }) => (
  <Panel index={index} tone={tone}>
    {title && (
      <h2 data-reveal className="mb-10 font-grotesk font-light tracking-tight leading-[1.05] text-[clamp(3rem,6.5vw,6.5rem)]">
        {title}
      </h2>
    )}
    <div className="-mx-6 px-6 md:mx-0 md:px-0 flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {reels.map((reel) => (
        <VideoTile
          key={reel.id}
          data-reveal
          item={reel}
          ratio="9 / 16"
          className={`shrink-0 snap-start w-[72vw] sm:w-[44vw] md:w-full md:justify-self-center ${
            title ? "md:max-w-[calc(54svh*9/16)]" : "md:max-w-[calc(68svh*9/16)]"
          }`}
        />
      ))}
    </div>
  </Panel>
);

export default ReelPanel;
