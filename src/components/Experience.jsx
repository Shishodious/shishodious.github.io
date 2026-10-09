import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const experiences = [
  {
    company: "Hypeliv",
    role: "Software Engineer — Current",
    summary:
      "Engineered and delivered a production website for a US-based client using React with a headless CMS backend.",
    points: [
      "Built backend services for an AI-powered creator analytics platform with NestJS, BullMQ for async job queues, and PostgreSQL via TypeORM.",
      "Integrated AWS S3, Rekognition, and SES for media storage, content moderation, and transactional email.",
      "Took part in code reviews, debugging sessions, and sprint planning to drive iterative delivery.",
    ],
    stack: ["React", "NestJS", "BullMQ", "PostgreSQL", "TypeORM", "AWS"],
  },
  {
    company: "Techkrate",
    role: "Full Stack Developer Intern",
    summary:
      "Architected and delivered backend modules for a production e-commerce platform on Node.js, Express, and MongoDB.",
    points: [
      "Built secure REST APIs for product management, cart, and order processing with JWT authentication and role-based access control.",
      "Implemented responsive product listings and checkout flows in React, wired to backend business logic.",
    ],
    stack: ["Node.js", "Express", "MongoDB", "React", "JWT"],
  },
];

const Experience = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".exp-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.18,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Fill the timeline rail as the user scrolls through it.
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top 65%",
            end: "bottom 75%",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-elev text-ink px-6 md:px-12 py-28 md:py-40 overflow-hidden"
    >
      <span className="section-watermark font-grotesk">04</span>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-14 md:mb-20">
          <span className="font-mono text-xs text-accent tracking-[0.2em]">(04)</span>
          <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">
            Experience
          </span>
          <div className="flex-1 h-px bg-line" />
        </div>

        <h2
          className="font-grotesk font-light tracking-tight mb-16 md:mb-24"
          style={{ fontSize: "clamp(1.75rem, 4.2vw, 3.5rem)" }}
        >
          Where I&apos;ve{" "}
          <em className="font-fraunces italic text-accent">worked</em>.
        </h2>

        {/* Timeline */}
        <div className="relative md:ml-1">
          {/* Rail */}
          <div
            ref={trackRef}
            className="absolute left-[5px] top-2 bottom-2 w-px bg-ink/[0.08] overflow-hidden"
          >
            <div
              ref={fillRef}
              className="absolute inset-0 origin-top bg-accent"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-20">
            {experiences.map(({ company, role, summary, points, stack }) => (
              <article key={company} className="exp-card relative pl-10 md:pl-16">
                {/* Node */}
                <span className="absolute left-0 top-3 w-[11px] h-[11px] rounded-full border border-accent bg-bg">
                  <span className="absolute inset-[2.5px] rounded-full bg-accent" />
                </span>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-5">
                  <h3
                    className="font-grotesk font-medium tracking-tight"
                    style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}
                  >
                    {company}
                  </h3>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
                    {role}
                  </span>
                </div>

                <p className="text-muted text-base md:text-lg leading-[1.85] font-light max-w-3xl mb-6">
                  {summary}
                </p>

                <ul className="space-y-3 max-w-3xl">
                  {points.map((point, i) => (
                    <li
                      key={i}
                      className="flex gap-4 text-muted text-sm md:text-base leading-[1.8] font-light"
                    >
                      <span className="mt-[0.7em] shrink-0 w-4 h-px bg-accent/60" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-2">
                  {stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/80 border border-line rounded-full hover:border-accent/40 hover:text-accent transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
