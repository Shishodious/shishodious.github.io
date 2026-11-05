import Panel from "./Panel";
import ToolLogo from "./ToolLogo";

// Tossed-down look: each icon at its own angle, the right column dropped a little.
const POSES = [
  "-rotate-[22deg]",
  "rotate-[27deg] translate-y-[28%]",
  "-rotate-[40deg]",
  "rotate-[22deg] translate-y-[28%]",
];

/** The toolkit on one side, the kinds of edit on the other. */
const VideoSkills = ({ index, title, tools, styles }) => (
  <Panel index={index}>
    <div className="grid md:grid-cols-2 gap-14 md:gap-16 items-center">
      <div>
        <h2 data-reveal className="font-grotesk font-light tracking-tight leading-[1.05] text-[clamp(3rem,6.5vw,6.5rem)]">
          {title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <ul aria-label="Editing tools" className="mt-12 ml-3 pb-7 grid grid-cols-2 w-fit gap-x-9 gap-y-8">
          {tools.map((tool, i) => (
            <li key={tool} data-reveal className="w-[clamp(4.5rem,6.5vw,5.75rem)]">
              <span
                className={`block transition-transform duration-500 ease-[cubic-bezier(0.34,1.36,0.64,1)] hover:rotate-0 motion-reduce:transition-none ${
                  POSES[i % POSES.length]
                }`}
              >
                <ToolLogo name={tool} />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 data-reveal className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted">
          Editing styles
        </h3>
        <ul className="mt-5 border-b border-line">
          {styles.map((style) => (
            <li key={style} data-reveal className="border-t border-line py-3 md:py-4 font-fraunces font-light tracking-[-0.01em] text-2xl md:text-3xl">
              {style}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Panel>
);

export default VideoSkills;
