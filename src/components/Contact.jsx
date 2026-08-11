import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineArrowUpRight } from "react-icons/hi2";

const Contact = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-reveal",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-elev text-ink px-6 md:px-12 pt-28 md:pt-40 pb-10 overflow-hidden"
    >
      <span className="section-watermark font-grotesk">06</span>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section label */}
        <div className="contact-reveal flex items-center gap-4 mb-14 md:mb-20">
          <span className="font-mono text-xs text-accent tracking-[0.2em]">(06)</span>
          <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">
            Contact
          </span>
          <div className="flex-1 h-px bg-line" />
        </div>

        {/* Big CTA */}
        <h2
          className="contact-reveal font-grotesk font-light leading-[1.05] tracking-tight max-w-5xl"
          style={{ fontSize: "clamp(2.4rem, 7vw, 6rem)" }}
        >
          Have an idea?
          <br />
          Let&apos;s{" "}
          <em className="font-fraunces italic text-accent">build it</em>{" "}
          together.
        </h2>

        <a
          href="mailto:priyanshushishodia008@gmail.com"
          className="contact-reveal group mt-10 md:mt-14 inline-flex items-center gap-3 font-mono text-sm md:text-lg tracking-wide text-muted hover:text-accent transition-colors duration-300"
        >
          <span className="u-link break-all">priyanshushishodia008@gmail.com</span>
          <HiOutlineArrowUpRight
            size={18}
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </a>

        {/* Form + socials */}
        <div className="mt-20 md:mt-28 grid md:grid-cols-12 gap-12 md:gap-8">
          {/* Left — socials */}
          <div className="contact-reveal md:col-span-4 space-y-8">
            <p className="text-muted font-light text-base leading-[1.85] max-w-sm">
              Taking on freelance projects and open to full-time roles —
              on-site or remote. The form works, or just say hi on either
              of these.
            </p>
            <div className="flex flex-col gap-1">
              {[
                {
                  label: "LinkedIn",
                  icon: <FaLinkedin size={15} />,
                  href: "https://www.linkedin.com/in/priyanshu-shishodia",
                },
                {
                  label: "GitHub",
                  icon: <FaGithub size={15} />,
                  href: "https://github.com/Shishodious",
                },
              ].map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between py-4 border-b border-line text-muted hover:text-ink transition-colors duration-300"
                >
                  <span className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase">
                    {icon}
                    {label}
                  </span>
                  <HiOutlineArrowUpRight
                    size={15}
                    className="text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="contact-reveal md:col-span-7 md:col-start-6">
            <form
              action="https://getform.io/f/bgdplwda"
              method="POST"
              className="space-y-8"
            >
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <label className="block mb-2 font-mono text-[10px] tracking-[0.25em] text-muted uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    className="w-full bg-transparent border-b border-ink/15 py-3 text-ink text-base font-light placeholder:text-ink/25
                               focus:outline-none focus:border-accent transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-mono text-[10px] tracking-[0.25em] text-muted uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-transparent border-b border-ink/15 py-3 text-ink text-base font-light placeholder:text-ink/25
                               focus:outline-none focus:border-accent transition-colors duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-mono text-[10px] tracking-[0.25em] text-muted uppercase">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  placeholder="Tell me about your project..."
                  rows="4"
                  className="w-full bg-transparent border-b border-ink/15 py-3 text-ink text-base font-light placeholder:text-ink/25
                             focus:outline-none focus:border-accent transition-colors duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-accent text-bg rounded-full font-grotesk font-medium text-sm tracking-wide
                           hover:bg-ink transition-colors duration-300"
              >
                Send message
                <HiOutlineArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 md:mt-32 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted/70 uppercase">
            © 2026 Priyanshu Shishodia
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted/70 uppercase">
            Designed &amp; built from scratch
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
