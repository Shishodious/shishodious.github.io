import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HiOutlineArrowUpRight } from "react-icons/hi2";

const services = [
  {
    id: "01",
    title: "Full-Stack Web Apps",
    description:
      "Complete products — React and Next.js frontends backed by Node or NestJS APIs, taken from first commit to production.",
  },
  {
    id: "02",
    title: "AI-Integrated Products",
    description:
      "Language and vision models wired into real product surfaces — multimodal pipelines, embeddings and vector search, structured extraction from messy input, and queue-driven processing built for production volume.",
  },
  {
    id: "03",
    title: "Backend & API Systems",
    description:
      "REST APIs with authentication, role-based access, job queues, and system design that holds up as usage grows.",
  },
  {
    id: "04",
    title: "Realtime Applications",
    description:
      "Live chat, tracking, and notifications over WebSockets — engineered for concurrent users, not demos.",
  },
  {
    id: "05",
    title: "E-commerce Builds",
    description:
      "Storefronts with product management, carts, and order processing wired to real business logic.",
  },
  {
    id: "06",
    title: "Automation & Scraping",
    description:
      "Structured data extraction at scale — rate-limited, retry-safe crawlers exposed through clean APIs.",
  },
];

const Services = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-row",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
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
      className="relative w-full bg-elev text-ink px-6 md:px-12 py-28 md:py-40 overflow-hidden"
    >
      <span className="section-watermark font-grotesk">02</span>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section label */}
        <div className="service-row flex items-center gap-4 mb-14 md:mb-20">
          <span className="font-mono text-xs text-accent tracking-[0.2em]">(02)</span>
          <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">
            What I Do
          </span>
          <div className="flex-1 h-px bg-line" />
        </div>

        <h2
          className="service-row font-grotesk font-light tracking-tight mb-16 md:mb-24"
          style={{ fontSize: "clamp(1.75rem, 4.2vw, 3.5rem)" }}
        >
          Capabilities, not{" "}
          <em className="font-fraunces italic text-accent">buzzwords</em>.
        </h2>

        {/* Service rows */}
        <div className="border-t border-line">
          {services.map(({ id, title, description }) => (
            <div
              key={id}
              className="service-row group grid md:grid-cols-12 gap-3 md:gap-8 py-9 md:py-12 border-b border-line items-baseline"
            >
              <span className="md:col-span-1 font-mono text-xs text-accent tracking-[0.2em]">
                /{id}
              </span>
              <h3
                className="md:col-span-5 font-grotesk font-light text-ink group-hover:text-accent transition-colors duration-300 flex items-baseline gap-3"
                style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.6rem)" }}
              >
                {title}
                <HiOutlineArrowUpRight
                  size={20}
                  className="shrink-0 text-accent opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300"
                />
              </h3>
              <p className="md:col-span-6 text-muted text-sm md:text-base font-light leading-[1.85] max-w-xl">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
