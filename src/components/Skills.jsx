import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const groups = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "GSAP", "Framer Motion"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "NestJS", "REST APIs", "WebSockets"],
  },
  {
    category: "AI & Automation",
    items: [
      "LLM APIs",
      "Google Gemini",
      "pgvector",
      "Vector Search",
      "OCR & Transcription",
      "Puppeteer",
    ],
  },
  {
    category: "Data & Cloud",
    items: ["PostgreSQL", "MongoDB", "Redis", "AWS", "Strapi"],
  },
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "SQL"],
  },
];

const Skills = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skill-row",
        { opacity: 0, y: 50 },
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
      <span className="section-watermark font-grotesk">03</span>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section label */}
        <div className="skill-row flex items-center gap-4 mb-14 md:mb-20">
          <span className="font-mono text-xs text-accent tracking-[0.2em]">(03)</span>
          <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">
            Stack
          </span>
          <div className="flex-1 h-px bg-line" />
        </div>

        <h2
          className="skill-row font-grotesk font-light tracking-tight mb-16 md:mb-24"
          style={{ fontSize: "clamp(1.75rem, 4.2vw, 3.5rem)" }}
        >
          Tools I <em className="font-fraunces italic text-accent">think</em> in.
        </h2>

        {/* Category rows */}
        <div className="border-t border-line">
          {groups.map(({ category, items }) => (
            <div
              key={category}
              className="skill-row grid md:grid-cols-12 gap-4 md:gap-8 py-10 md:py-14 border-b border-line items-baseline"
            >
              <span className="md:col-span-3 font-mono text-xs tracking-[0.25em] text-muted uppercase">
                {category}
              </span>
              <div className="md:col-span-9 flex flex-wrap gap-x-5 sm:gap-x-3 gap-y-2 items-baseline">
                {items.map((item, i) => (
                  <span key={item} className="flex items-baseline gap-3">
                    <span
                      className="font-grotesk font-light text-ink/90 hover:text-accent hover:font-fraunces hover:italic transition-colors duration-200 cursor-default"
                      style={{ fontSize: "clamp(1.4rem, 3vw, 2.5rem)" }}
                    >
                      {item}
                    </span>
                    {i < items.length - 1 && (
                      <span className="hidden sm:inline text-accent/50 text-xs select-none">◆</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tail note */}
        <p className="skill-row mt-10 font-mono text-[11px] tracking-[0.25em] text-muted uppercase text-right">
          — and always learning more
        </p>
      </div>
    </section>
  );
};

export default Skills;
