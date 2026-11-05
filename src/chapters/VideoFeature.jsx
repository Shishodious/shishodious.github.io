import Panel from "./Panel";
import VideoTile from "./VideoTile";

/** One wide edit, as large as the screen allows. */
const VideoFeature = ({ index, item }) => (
  <Panel index={index}>
    <VideoTile data-reveal item={item} ratio="16 / 9" className="w-full md:max-w-[calc(70svh*16/9)] mx-auto" />
  </Panel>
);

export default VideoFeature;
