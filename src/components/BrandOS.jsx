import { HiArrowUpRight } from "react-icons/hi2";
import { Board, Card, Dots, Ruler } from "./osKit";

// The Brand Websites door on the home ring: the same widget-board idea as
// AppsOS, dressed in the brand world's paper, ink and red, with a serif in
// charge. Each card is one part of a brand site: type, palette, the build,
// speed, search, motion, the CMS and the launch.
const PAPER = "#efede9";
const INK = "#121212";
const RED = "#d42a1f";

const BrandOS = ({ on, register }) => (
  <Board on={on} register={register} bg="#d6d1c8" glow={[RED, "#5a1410", PAPER]}>
    <p className="absolute left-[96px] top-[118px] font-fraunces italic text-[24px] text-[#121212]">
      Brand <span className="not-italic font-helvetica text-[#8a857d]">Kit</span>
    </p>

    {/* Top row */}
    <Card x={214} y={34} w={192} h={210} delay={0.4} light title="Type" sub="Display serif" bg={PAPER}>
      <p className="absolute left-0 right-0 top-[66px] text-center font-fraunces italic font-light text-[92px] leading-none">
        Aa
      </p>
      <p className="absolute left-4 right-4 bottom-4 flex justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-black/45">
        <span>Fraunces</span>
        <span className="text-[#d42a1f]">300</span>
      </p>
    </Card>

    <Card x={72} y={160} w={160} h={180} delay={1.1} title="Lighthouse" sub="Performance" bg={INK}>
      <Dots value="100" dot={4.6} className="absolute left-1/2 top-[80px] -translate-x-1/2 text-[#efede9]" />
      <Ruler at={0.96} color={RED} className="absolute left-4 right-4 bottom-9" />
      <p className="absolute left-4 bottom-3 font-helvetica text-[13px] text-white/55">Mobile</p>
    </Card>

    <Card
      x={392}
      y={162}
      w={160}
      h={160}
      delay={0.8}
      title="Palette"
      sub="Four colours"
      bg={`linear-gradient(180deg, #2a0906 0%, #7d1610 60%, ${RED} 100%)`}
    >
      <div className="absolute left-4 right-4 bottom-4 grid grid-cols-4 gap-1.5">
        {[PAPER, INK, RED, "#8a857d"].map((c) => (
          <span key={c} className="aspect-[1/1.6] rounded-md ring-1 ring-white/25" style={{ background: c }} />
        ))}
      </div>
    </Card>

    {/* The build: a browser window with the brand's hero in it */}
    <Card x={62} y={372} w={496} h={192} delay={1.6} className="!p-0" bg={PAPER} light>
      <div className="flex items-center gap-1.5 px-4 h-9 border-b border-black/10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#d42a1f]" />
        <span className="w-2.5 h-2.5 rounded-full bg-black/20" />
        <span className="w-2.5 h-2.5 rounded-full bg-black/20" />
        <span className="ml-3 flex-1 h-5 rounded-full bg-black/[0.06] font-mono text-[10px] leading-5 px-3 text-black/50">
          yourbrand.com
        </span>
      </div>
      <div className="relative px-6 pt-5">
        <nav className="flex gap-4 font-helvetica text-[10px] font-semibold uppercase tracking-[0.15em] text-black/50">
          <span className="text-[#121212]">Studio</span>
          <span>Work</span>
          <span>Journal</span>
          <span>Contact</span>
        </nav>
        <p className="mt-4 font-fraunces font-light text-[40px] leading-[0.98] tracking-[-0.02em]">
          Feel it before
          <br />
          you <em className="text-[#d42a1f]">read</em> it.
        </p>
        <span className="absolute right-6 bottom-0 inline-flex items-center gap-1.5 rounded-full bg-[#121212] text-[#efede9] px-4 py-2 font-helvetica text-[11px] font-bold">
          See the work <HiArrowUpRight size={12} />
        </span>
        <span className="absolute right-[150px] top-6 w-16 h-16 rounded-full bg-[#d42a1f]" />
      </div>
    </Card>

    {/* Bottom row */}
    <Card x={44} y={590} w={150} h={168} delay={0.2} light title="Search" sub="Preview" bg="#e6e1d8">
      <div className="absolute left-4 right-4 top-[76px] space-y-1.5">
        <p className="font-helvetica text-[9px] text-black/45">yourbrand.com › studio</p>
        <p className="font-helvetica text-[13px] font-bold leading-tight text-[#1a3fbf]">Your Brand — Studio</p>
        <span className="block h-1.5 rounded bg-black/15" />
        <span className="block h-1.5 w-4/5 rounded bg-black/15" />
      </div>
    </Card>

    <Card
      x={208}
      y={594}
      w={176}
      h={184}
      delay={1.3}
      title="Motion"
      sub="Ease out"
      bg={`radial-gradient(120% 110% at 50% 30%, #3a3633 0%, ${INK} 70%)`}
    >
      <svg className="absolute left-4 top-[70px]" width="144" height="80" viewBox="0 0 144 80" aria-hidden="true">
        <path d="M0 80 L144 80 M0 80 L0 0" stroke="rgba(255,255,255,0.18)" />
        <path d="M0 80 C 40 6, 70 2, 144 0" fill="none" stroke={RED} strokeWidth="2.5" />
        <circle cx="40" cy="6" r="3.5" fill={PAPER} />
        <circle cx="70" cy="2" r="3.5" fill={PAPER} />
      </svg>
      <p className="absolute left-4 bottom-4 font-mono text-[10px] tracking-[0.1em] text-white/55">.16, 1, .3, 1</p>
    </Card>

    <Card
      x={398}
      y={604}
      w={176}
      h={150}
      delay={0.6}
      title="CMS"
      sub="Journal"
      bg={`linear-gradient(160deg, #e2563d 0%, ${RED} 55%, #8f1a12 100%)`}
    >
      <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
        <span className="font-helvetica text-[11px] font-semibold">Published</span>
        <span className="relative w-8 h-[18px] rounded-full bg-[#efede9]">
          <span className="absolute right-[3px] top-[3px] w-3 h-3 rounded-full bg-[#d42a1f]" />
        </span>
      </div>
    </Card>

    <div
      className="os-float absolute left-[258px] top-[800px] w-[104px] h-[104px] rounded-[28px] grid place-items-center bg-[#121212] shadow-[0_20px_40px_-12px_rgba(212,42,31,0.6)]"
      style={{ animationDelay: "1.9s" }}
    >
      <span className="w-14 h-14 rounded-full bg-[#d42a1f] grid place-items-center text-[#efede9]">
        <HiArrowUpRight size={24} />
      </span>
    </div>
  </Board>
);

export default BrandOS;
