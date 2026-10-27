import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { lastService, services } from "../services/registry";

/**
 * The gate on "/": the visitor picks what they came for. P1 skeleton —
 * the full gate (haze shader, world preview, dissolve) lands in P2.
 */
const Chooser = () => {
  const [last] = useState(lastService);

  useEffect(() => {
    document.title = "Priyanshu Shishodia — Studio";
  }, []);

  return (
    <main className="min-h-[100svh] flex flex-col justify-center px-6 md:px-12 pt-28 pb-16">
      <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted">
        What are we making?
      </p>

      <ul className="mt-8 border-t border-line">
        {services.map((service, i) => (
          <li key={service.slug} className="border-b border-line">
            <Link
              to={`/${service.slug}`}
              className="group flex items-baseline gap-4 md:gap-8 py-4 md:py-5 outline-none focus-visible:text-accent"
            >
              <span className="font-mono text-xs text-accent w-6 shrink-0">
                0{i + 1}
              </span>
              <span className="font-fraunces font-light tracking-[-0.03em] leading-none text-[clamp(3rem,9vw,8rem)] transition-transform duration-500 group-hover:translate-x-3">
                {service.word}
              </span>
              {last === service.slug && (
                <span className="self-start mt-1 md:mt-3 font-mono text-[10px] tracking-[0.25em] uppercase text-accent whitespace-nowrap">
                  Last visited
                </span>
              )}
              <span className="hidden md:block ml-auto max-w-xs text-sm text-muted leading-snug">
                {service.tagline}
              </span>
              <HiOutlineArrowUpRight
                className="shrink-0 self-center ml-auto md:ml-0 text-muted transition-colors duration-300 group-hover:text-accent"
                size={22}
              />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Chooser;
