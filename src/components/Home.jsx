import { useEffect, useRef } from "react";
import { Link } from "react-scroll";
import gsap from "gsap";
import RotatingText from "./RotatingText";
import VariableProximity from "./VariableProximity";
import HeroBackdrop from "./HeroBackdrop";
import { HiOutlineArrowDown, HiOutlineArrowUpRight } from "react-icons/hi2";

const marqueeItems = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "NestJS",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "WebSockets",
  "AWS",
  "GSAP",
  "Tailwind CSS",
];

const Home = () => {
  const homeRef = useRef(null);
  const imageRef = useRef(null);
  const introRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      imageRef.current,
      { opacity: 0, scale: 1.06 },
      { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" }
    )
      .fromTo(
        introRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=1.0"
      )
      .fromTo(
        titleRef.current.children,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 },
        "-=0.5"
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.6"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.45"
      )
      .fromTo(
        marqueeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.9 },
        "-=0.3"
      );

    return () => tl.kill();
  }, []);

  return (
    <section
      name="home"
      id="home"
      ref={homeRef}
      className="relative min-h-screen bg-bg text-ink overflow-hidden"
    >
      {/* Full-bleed photo split into depth planes, graded into the palette */}
      <HeroBackdrop imageRef={imageRef} />

      {/* Foreground content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 min-h-screen flex flex-col items-end justify-center text-right pt-24 pb-36">
        {/* Intro line */}
        <div ref={introRef} className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
              Freelance & full-time
            </span>
          </div>
          <p className="font-mono text-sm md:text-base text-muted tracking-wide">
            Hi, I&apos;m{" "}
            <span className="text-ink">Priyanshu Shishodia</span> — full-stack
            developer.
          </p>
        </div>

        {/* Headline */}
        <h1
          ref={titleRef}
          className="leading-[0.95] select-none"
          style={{ fontSize: "clamp(3.2rem, 10vw, 8.5rem)" }}
        >
          <span className="block font-grotesk uppercase tracking-tight">
            <VariableProximity
              label="I Build"
              containerRef={homeRef}
              fromFontVariationSettings='"wght" 350'
              toFontVariationSettings='"wght" 700'
              radius={200}
              falloff="exponential"
            />
          </span>
          <span className="block font-fraunces italic font-light text-accent mt-1 md:mt-2 pl-4">
            <VariableProximity
              label="the whole thing."
              containerRef={homeRef}
              fromFontVariationSettings='"wght" 340'
              toFontVariationSettings='"wght" 640'
              radius={200}
              falloff="exponential"
            />
          </span>
        </h1>

        {/* Rotating subtitle */}
        <div ref={subtitleRef} className="mt-8 md:mt-10 flex items-center gap-4">
          <div className="h-[1.6rem] overflow-hidden">
            <RotatingText
              texts={[
                "Realtime apps & WebSockets",
                "REST APIs that scale",
                "Interfaces with motion",
              ]}
              className="font-mono text-xs md:text-sm tracking-[0.2em] text-muted uppercase"
              rotationInterval={2600}
            />
          </div>
          <div className="w-10 h-px bg-accent/70" />
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="mt-12 flex flex-wrap items-center justify-end gap-6">
          <Link
            to="portfolio"
            smooth
            duration={700}
            offset={-70}
            className="group cursor-pointer inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-bg rounded-full font-grotesk font-medium text-sm tracking-wide hover:bg-ink transition-colors duration-300"
          >
            Selected work
            <HiOutlineArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <Link
            to="contact"
            smooth
            duration={700}
            offset={-70}
            className="u-link cursor-pointer font-mono text-sm tracking-[0.15em] text-ink uppercase"
          >
            Get in touch
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <Link
        to="about"
        smooth
        duration={700}
        offset={-70}
        className="absolute bottom-24 left-6 md:left-12 z-10 cursor-pointer hidden sm:flex flex-col items-center gap-3"
      >
        <span
          className="font-mono text-[10px] tracking-[0.3em] text-muted uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <HiOutlineArrowDown size={16} className="text-accent scroll-bounce" />
      </Link>

      {/* Tech marquee */}
      <div
        ref={marqueeRef}
        className="marquee absolute bottom-0 left-0 right-0 z-10 border-t border-line bg-bg/60 backdrop-blur-sm overflow-hidden py-4"
      >
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center"
              aria-hidden={dup === 1}
            >
              {marqueeItems.map((item) => (
                <span
                  key={`${dup}-${item}`}
                  className="flex items-center font-mono text-xs tracking-[0.2em] text-muted uppercase"
                >
                  <span className="px-6">{item}</span>
                  <span className="text-accent/60 text-[8px]">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
