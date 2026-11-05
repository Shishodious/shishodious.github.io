import { SiAdobeaftereffects, SiAdobepremierepro } from "react-icons/si";

// Traced by hand: no icon set ships the CapCut mark.
const CapCut = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true" className="block w-full h-full">
    <rect width="100" height="100" rx="17" fill="#fff" />
    <path
      fill="#000"
      fillRule="evenodd"
      d="M20 22H66.8Q72 22 72 27V29.5L85.4 22.3V33.6L54.7 50.5 85.4 67V78.2L72 71.1V73.6Q72 79 66.8 79H20Q14.8 79 14.8 73.6V60.7L33 50.5 14.8 41.1V27.3Q14.8 22 20 22ZM21.2 32.5 43.8 44.6 66.3 32.5ZM21.2 68.2H66.3L43.8 56.3Z"
    />
  </svg>
);

// Geometry from Simple Icons, split into tile, rim and petals so each can take
// the app icon's colour.
const TILE =
  "M17.621 0 5.977.004c-1.37 0-2.756.345-3.762 1.11a4.925 4.925 0 0 0-1.61 2.003C.233 3.93 0 5.02 0 5.951l.012 12.2c.002 1.604.479 3.057 1.461 4.112.984 1.056 2.462 1.683 4.331 1.691L16.856 24c1.26.005 3.095-.036 4.303-.714 1.075-.605 2.025-1.556 2.497-2.984.278-.84.345-2.084.344-3.147l-.021-11.13c-.002-.888-.15-2.023-.547-2.934-.425-.976-1.181-1.815-2.322-2.425C20.353.26 19.123 0 17.622 0z";
const RIM =
  TILE +
  "M17.621.93c1.378 0 2.538.295 3.04.565.977.523 1.544 1.166 1.889 1.96.315.721.47 1.793.473 2.572l.018 11.13c.002 1.013-.097 2.257-.298 2.86-.396 1.202-1.146 1.946-2.063 2.462-.814.457-2.612.593-3.82.588l-11.05-.044c-1.657-.007-2.832-.534-3.626-1.386-.792-.851-1.212-2.06-1.212-3.485L.999 5.95c0-.829.196-1.827.474-2.437.345-.757.75-1.207 1.365-1.674C3.585 1.27 4.868.97 6.08.97z";

const Resolve = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="block w-full h-full">
    <defs>
      <linearGradient id="resolve-tile" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2f4060" />
        <stop offset="1" stopColor="#1b2433" />
      </linearGradient>
      <linearGradient id="resolve-rim" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4fb6f0" />
        <stop offset="0.5" stopColor="#6fd3b4" />
        <stop offset="1" stopColor="#c7dc4a" />
      </linearGradient>
      <linearGradient id="resolve-rim-warm" x1="1" y1="1" x2="0.5" y2="0.5">
        <stop offset="0" stopColor="#ee5a5a" />
        <stop offset="1" stopColor="#ee5a5a" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d={TILE} fill="url(#resolve-tile)" />
    <path d={RIM} fill="url(#resolve-rim)" />
    <path d={RIM} fill="url(#resolve-rim-warm)" />
    <path
      fill="#4fd6f5"
      d="M11.961 4.353c-1.976.089-3.204 1.658-3.214 3.29.019 1.443 1.635 3.481 2.884 4.53.12.099.154.109.33.18.062.025.198-.047.327-.135.36-.245.993-.947 1.648-1.738a7.67 7.67 0 0 0 1.031-1.683c.409-.89.261-1.599.235-1.888a3.983 3.983 0 0 0-.99-1.692 3.36 3.36 0 0 0-2.251-.864z"
    />
    <path
      fill="#f0665a"
      d="M16.133 12.275a10.185 10.185 0 0 0-3.244.61c-.15.058-.26.1-.374.17-.057.036-.11.135-.105.292.017.433.29 1.278.624 2.27.384 1.135 1.066 2.27 1.844 2.74a3.23 3.23 0 0 0 2.53.342c.832-.243 1.595-.868 1.962-1.546.986-1.818.19-3.548-1.121-4.417-.447-.296-1.133-.445-1.89-.46-.074 0-.15-.002-.226-.001z"
    />
    <path
      fill="#e5e23f"
      d="M7.701 12.313a6.201 6.201 0 0 0-.752.047c-.596.078-.932.273-1.29.51a3.177 3.177 0 0 0-1.365 1.979c-.075.552-.086 1.053.033 1.507.433 1.389 1.326 2.222 2.847 2.452.636.028 1.37-.063 1.99-.45 1.269-.782 2.08-3.17 2.412-4.742.053-.176.035-.357-.013-.42-.005-.067-.044-.113-.19-.183-.398-.192-1.32-.417-2.375-.6a7.68 7.68 0 0 0-1.297-.1z"
    />
  </svg>
);

// The icon is a navy tile with the letters cut out, so lavender behind it
// shows through as the letters.
const Adobe = ({ icon: Icon }) => (
  <span className="relative block">
    <span className="absolute inset-[15%] bg-[#9999ff]" />
    <Icon aria-hidden="true" color="#00005b" className="relative block w-full h-full" />
  </span>
);

const LOGOS = {
  CapCut: <CapCut />,
  "DaVinci Resolve": <Resolve />,
  "After Effects": <Adobe icon={SiAdobeaftereffects} />,
  "Premiere Pro": <Adobe icon={SiAdobepremierepro} />,
};

/** An editing app's icon, or its name in a pill if there's no logo for it yet. */
const ToolLogo = ({ name }) =>
  LOGOS[name] ? (
    <span role="img" aria-label={name} title={name} className="block">
      {LOGOS[name]}
    </span>
  ) : (
    <span className="block px-3 py-1.5 rounded-full border border-ink/20 font-mono text-[11px] tracking-[0.15em] uppercase text-center">
      {name}
    </span>
  );

export default ToolLogo;
