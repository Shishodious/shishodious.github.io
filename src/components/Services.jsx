import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HiOutlineGlobeAlt,
  HiOutlineServerStack,
  HiOutlineShoppingBag,
  HiOutlineSignal,
  HiOutlineSparkles,
  HiOutlineSquare3Stack3D,
} from "react-icons/hi2";

const services = [
  {
    id: "01",
    title: "Full-Stack Web Apps",
    icon: HiOutlineSquare3Stack3D,
    description:
      "Complete products — React and Next.js frontends backed by Node or NestJS APIs, taken from first commit to production.",
  },
  {
    id: "02",
    title: "AI-Integrated Products",
    icon: HiOutlineSparkles,
    description:
      "Language and vision models wired into real product surfaces — multimodal pipelines, embeddings and vector search, structured extraction from messy input, and queue-driven processing built for production volume.",
  },
  {
    id: "03",
    title: "Backend & API Systems",
    icon: HiOutlineServerStack,
    description:
      "REST APIs with authentication, role-based access, job queues, and system design that holds up as usage grows.",
  },
  {
    id: "04",
    title: "Realtime Applications",
    icon: HiOutlineSignal,
    description:
      "Live chat, tracking, and notifications over WebSockets — engineered for concurrent users, not demos.",
  },
  {
    id: "05",
    title: "E-commerce Builds",
    icon: HiOutlineShoppingBag,
    description:
      "Storefronts with product management, carts, and order processing wired to real business logic.",
  },
  {
    id: "06",
    title: "Automation & Scraping",
    icon: HiOutlineGlobeAlt,
    description:
      "Structured data extraction at scale — rate-limited, retry-safe crawlers exposed through clean APIs.",
  },
];

// Registration ticks in each corner — the card reads as a spec sheet.
const CORNERS = [
  "top-3 left-3 border-t border-l",
  "top-3 right-3 border-t border-r",
  "bottom-3 left-3 border-b border-l",
  "bottom-3 right-3 border-b border-r",
];

const CardFace = ({ id, title, description, icon: Icon, inverted, className = "" }) => (
  <div
    className={`flex flex-col h-full p-7 md:p-8 ${
      inverted ? "bg-ink text-bg" : "text-ink"
    } ${className}`}
  >
    {CORNERS.map((pos) => (
      <span
        key={pos}
        className={`absolute w-2.5 h-2.5 ${pos} ${
          inverted ? "border-bg/30" : "border-ink/20"
        }`}
      />
    ))}

    <div className="flex items-start justify-between">
      <span className="font-mono text-xs text-accent tracking-[0.2em]">/{id}</span>
      <Icon
        size={30}
        className={inverted ? "text-accent" : "text-muted"}
        style={{ strokeWidth: 1.1 }}
      />
    </div>

    <div className="mt-16 md:mt-24">
      <h3
        className="font-grotesk font-light tracking-tight leading-[1.1]"
        style={{ fontSize: "clamp(1.5rem, 2.1vw, 2rem)" }}
      >
        {title}
      </h3>
      <p
        className={`mt-4 text-sm md:text-[15px] font-light leading-[1.8] ${
          inverted ? "text-bg/70" : "text-muted"
        }`}
      >
        {description}
      </p>
    </div>
  </div>
);

/**
 * A service card that inverts on hover. The inverted face is a full copy of the
 * card laid over the top and clipped to a circle; the circle grows from the
 * point the cursor came in and shrinks back toward the point it left, so the
 * colour change wipes across with the pointer instead of snapping.
 */
const ServiceCard = (service) => {
  const cardRef = useRef(null);
  const invertedRef = useRef(null);

  const wipe = (e, open) => {
    // A tap fires enter and leave back to back — not worth a flash.
    if (e.pointerType === "touch") return;
    const face = invertedRef.current;
    const rect = cardRef.current.getBoundingClientRect();
    const at = `at ${e.clientX - rect.left}px ${e.clientY - rect.top}px`;
    if (open) {
      // Start from a dot under the cursor, not from wherever the last wipe ended.
      face.style.transition = "none";
      face.style.clipPath = `circle(0% ${at})`;
      face.getBoundingClientRect();
      face.style.transition = "";
    }
    face.style.clipPath = `circle(${open ? 150 : 0}% ${at})`;
  };

  return (
    <div
      ref={cardRef}
      onPointerEnter={(e) => wipe(e, true)}
      onPointerLeave={(e) => wipe(e, false)}
      className="relative flex flex-col h-full min-h-[320px] md:min-h-[360px] overflow-hidden rounded-2xl border border-line bg-bg
                 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:-rotate-[0.6deg]"
    >
      <CardFace {...service} className="flex-1" />
      <div ref={invertedRef} aria-hidden="true" className="invert-face absolute inset-0">
        <CardFace {...service} inverted />
      </div>
    </div>
  );
};

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

        {/* Service cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {services.map((service) => (
            <div key={service.id} className="service-row">
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
