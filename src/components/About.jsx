import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { value: "05+", label: "Projects shipped" },
  { value: "02", label: "Internships" },
  { value: "'26", label: "B.Tech IT Graduate" },
];

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-reveal",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-bg text-ink px-6 md:px-12 py-28 md:py-40 overflow-hidden"
    >
      <span className="section-watermark font-grotesk">01</span>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section label */}
        <div className="about-reveal flex items-center gap-4 mb-14 md:mb-20">
          <span className="font-mono text-xs text-accent tracking-[0.2em]">(01)</span>
          <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">
            About
          </span>
          <div className="flex-1 h-px bg-line" />
        </div>

        {/* Statement */}
        <h2
          className="about-reveal font-grotesk font-light leading-[1.15] tracking-tight max-w-5xl"
          style={{ fontSize: "clamp(1.75rem, 4.2vw, 3.5rem)" }}
        >
          I engineer web products{" "}
          <em className="font-fraunces italic text-accent">end to end</em> —
          from system design to the{" "}
          <em className="font-fraunces italic text-accent">last pixel</em>.
        </h2>

        {/* Body copy */}
        <div className="mt-16 md:mt-24 grid md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5 md:col-start-2 about-reveal">
            <p className="text-muted text-base md:text-lg leading-[1.9] font-light">
              I&apos;m a 22-year-old developer and Information Technology
              graduate,
              currently engineering backend services for an AI-powered
              creator-analytics platform at{" "}
              <span className="text-ink">Hypeliv</span> — NestJS services,
              queue-driven jobs with BullMQ, PostgreSQL, and AWS
              infrastructure running in production.
            </p>
            <p className="mt-6 text-muted text-base md:text-lg leading-[1.9] font-light">
              I build <span className="text-ink">with</span> AI as much as I
              build <span className="text-ink">on</span> it — models sit in my
              daily loop for scaffolding, review, and the tedious middle of a
              build. It&apos;s less a skill I list than the reason I ship at
              the pace I do.
            </p>
          </div>
          <div className="md:col-span-5 about-reveal">
            <p className="text-muted text-base md:text-lg leading-[1.9] font-light">
              My work spans the whole product: realtime systems over{" "}
              <span className="text-ink">WebSockets</span>, REST APIs with
              proper auth and role-based access, and interfaces in{" "}
              <span className="text-ink">React</span> and{" "}
              <span className="text-ink">Next.js</span> that move with intent.
              I take on <span className="text-ink">freelance projects</span>{" "}
              and <span className="text-ink">full-time roles</span>, on-site
              or remote.
            </p>
            <p className="mt-6 text-muted text-base md:text-lg leading-[1.9] font-light">
              Off the keyboard, I captain my college football team and have
              played at district level — I&apos;m used to owning the result,
              not just my position.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 md:mt-28 grid grid-cols-3 border-t border-line">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className={`about-reveal py-8 md:py-12 ${
                i > 0 ? "border-l border-line pl-6 md:pl-12" : ""
              }`}
            >
              <span
                className="block font-grotesk font-medium text-accent tracking-tight"
                style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
              >
                {value}
              </span>
              <span className="mt-2 block font-mono text-[10px] md:text-xs tracking-[0.2em] text-muted uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
