import Panel from "./Panel";
import VideoTile from "./VideoTile";

/** Who's cutting: heading and a short bio beside a wide reel. */
const VideoAbout = ({ index, title, body, reel }) => (
  <Panel index={index} tone="bone">
    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <div className="lg:col-span-5">
        <h2 data-reveal className="font-fraunces font-light tracking-[-0.035em] leading-[0.95] text-[clamp(3rem,6.5vw,6.5rem)]">
          {title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed">
          {body}
        </p>
      </div>
      <VideoTile data-reveal item={reel} ratio="16 / 9" className="lg:col-span-7" />
    </div>
  </Panel>
);

export default VideoAbout;
