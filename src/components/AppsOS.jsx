import { HiMiniPlay } from "react-icons/hi2";
import { Board, Card, Dots, Ruler } from "./osKit";

// The Apps & Products door on the home ring: a little "operating system" of
// glowing widget cards in the spirit of AI-OS style dashboard shots, filled
// with this studio's own work.
const AppsOS = ({ on, register }) => (
  <Board on={on} register={register} bg="#d9d9db" glow={["#c2183a", "#5b2a86", "#139c9a"]}>
        {/* Corner marks */}
        <p className="absolute left-[96px] top-[118px] font-helvetica text-[22px] text-[#111]">
          AI <span className="text-[#8a8a8e]">OS</span>
        </p>

        {/* Top row */}
        <Card
          x={214}
          y={34}
          w={192}
          h={210}
          delay={0.4}
          title="Shipped"
          sub="This week"
          bg="radial-gradient(120% 90% at 50% 40%, #2f6b4f 0%, #1d3b30 55%, #2a4a40 100%)"
        >
          <div className="absolute left-1/2 top-[86px] -translate-x-1/2 w-12 h-12 rounded-full bg-[#9bf08f] shadow-[0_0_30px_#9bf08f]" />
          <div className="absolute left-1/2 top-[70px] -translate-x-1/2 w-[84px] h-[84px] rounded-full border border-dashed border-white/25" />
          <Ruler at={0.55} color="#9bf08f" className="absolute left-4 right-4 bottom-12" />
          <p className="absolute left-4 bottom-4 font-helvetica text-[15px] text-[#9bf08f]">12 deploys</p>
        </Card>

        <Card
          x={72}
          y={160}
          w={160}
          h={180}
          delay={1.1}
          title="Uptime"
          sub="Today"
          bg="radial-gradient(110% 90% at 50% 45%, #e0123a 0%, #8a0f2c 45%, #4b1a3a 100%)"
        >
          <Dots value="99.9" dot={5} className="absolute left-1/2 top-[78px] -translate-x-1/2" />
          <Ruler at={0.7} className="absolute left-4 right-4 bottom-9" />
          <p className="absolute left-4 bottom-3 font-helvetica text-[13px] text-white/60">Prod</p>
        </Card>

        <Card
          x={392}
          y={162}
          w={160}
          h={160}
          delay={0.8}
          title="Next"
          sub="Standup"
          bg="linear-gradient(180deg, #3a0d22 0%, #7a1024 60%, #c2183a 100%)"
        >
          <Dots value="09:30" dot={4.4} className="absolute left-4 top-[78px]" />
          <div className="absolute left-4 right-4 bottom-3 flex items-end justify-between h-10">
            {Array.from({ length: 22 }, (_, i) => (
              <span
                key={i}
                className="w-[2px] rounded"
                style={{ height: [10, 22, 14, 34, 18][i % 5], background: i === 6 ? "#ffd84a" : "rgba(255,255,255,0.4)" }}
              />
            ))}
          </div>
        </Card>

        {/* Middle row: two of the flagship products */}
        <Card
          x={62}
          y={372}
          w={236}
          h={174}
          delay={1.6}
          title="Momentum"
          sub="Modules"
          bg="radial-gradient(120% 100% at 60% 40%, #c7a6ff 0%, #9b7fe0 45%, #6c5bb4 100%)"
        >
          <Dots value="55" dot={6} className="absolute left-1/2 top-[70px] -translate-x-1/2" />
          <svg className="absolute left-4 right-4 bottom-6" width="204" height="24" viewBox="0 0 204 24" aria-hidden="true">
            <path d="M0 12 C 25 0, 45 24, 70 12 S 115 0, 140 12 S 180 24, 204 12" fill="none" stroke="#ffe36a" strokeWidth="2" />
          </svg>
        </Card>

        <Card
          x={322}
          y={384}
          w={236}
          h={174}
          delay={2.1}
          title="Creator Vision"
          sub="Signals"
          bg="radial-gradient(110% 100% at 55% 55%, #0b1a6e 0%, #102a9a 50%, #1f5cff 100%)"
        >
          <div className="absolute left-1/2 top-[64px] bottom-6 w-px bg-white/15" />
          <div className="absolute left-4 right-4 top-[110px] h-px bg-white/15" />
          {[
            [118, 84, 12], [142, 96, 16], [128, 112, 10], [160, 118, 14], [104, 124, 8], [150, 138, 12],
            [90, 104, 6], [176, 102, 8], [134, 146, 9], [166, 150, 13], [112, 152, 7], [70, 96, 5],
          ].map(([cx, cy, r], i) => (
            <span
              key={i}
              className="absolute rounded-full bg-[#2b9bff]"
              style={{ left: cx - r / 2, top: cy - r / 2, width: r, height: r }}
            />
          ))}
          <p className="absolute left-4 bottom-3 font-helvetica text-[12px] text-white/55">Vision · Audio · OCR</p>
        </Card>

        {/* Bottom row */}
        <Card
          x={44}
          y={576}
          w={150}
          h={168}
          delay={0.2}
          title="Commits"
          sub="Today"
          bg="radial-gradient(110% 100% at 50% 60%, #b05a3a 0%, #5b5f72 60%, #3a4d66 100%)"
          className="opacity-95"
        >
          <div className="absolute left-1/2 top-[70px] -translate-x-1/2 w-[86px] h-[86px] rounded-full border-2 border-dotted border-white/30" />
          <Dots value="24" dot={5.5} className="absolute left-1/2 top-[94px] -translate-x-1/2" />
        </Card>

        <Card
          x={208}
          y={580}
          w={176}
          h={184}
          delay={1.3}
          title="Server"
          sub="vs Edge"
          bg="radial-gradient(120% 110% at 50% 30%, #c8f53a 0%, #8bb51a 45%, #4d6a12 100%)"
        >
          <p className="absolute left-0 right-0 top-[76px] text-center font-helvetica text-[40px] font-medium">
            75<span className="text-[16px] align-top text-white/70"> %</span>
          </p>
          <div className="absolute left-4 right-4 top-[132px] h-[2px] bg-white/60" />
          <span className="absolute top-[126px] left-[118px] w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-[#ffe36a]" />
          <p className="absolute left-4 right-4 bottom-4 flex justify-between font-helvetica text-[12px] text-white/80">
            <span className="text-white/45">Server</span>
            <span>Edge</span>
          </p>
        </Card>

        <Card
          x={398}
          y={590}
          w={176}
          h={150}
          delay={0.6}
          bg="linear-gradient(160deg, #a35cff 0%, #7b3fe0 50%, #3c3a9a 100%)"
        >
          <div className="flex gap-2">
            {["Build", "Deploy"].map((label, i) => (
              <div key={label} className="flex-1 rounded-xl bg-white/10 p-2">
                <span className="inline-block rounded-full bg-white/25 px-2 py-0.5 font-helvetica text-[9px] font-bold">ON</span>
                <p className="mt-4 font-helvetica text-[10px] text-white/60">{label}</p>
                <Dots value={i ? "10:00" : "09:50"} dot={2.4} className="mt-1" />
              </div>
            ))}
          </div>
          <div className="mt-3 h-7 rounded-full bg-black/80 flex items-center justify-center gap-[3px]">
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i} className="w-px bg-white/50" style={{ height: i % 4 ? 6 : 12 }} />
            ))}
          </div>
        </Card>

        <div
          className="os-float absolute left-[258px] top-[786px] w-[104px] h-[104px] rounded-[28px] grid place-items-center bg-[radial-gradient(circle_at_50%_45%,#d8ff7a_0%,#7af0c8_55%,#4fb8ff_100%)] shadow-[0_20px_40px_-12px_rgba(79,184,255,0.6)]"
          style={{ animationDelay: "1.9s" }}
        >
          <span className="w-14 h-14 rounded-full bg-[#111] grid place-items-center text-[#d8ff7a]">
            <HiMiniPlay size={26} />
          </span>
        </div>
  </Board>
);

export default AppsOS;
