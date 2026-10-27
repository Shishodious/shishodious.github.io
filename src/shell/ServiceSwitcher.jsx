import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HiChevronDown, HiOutlineSquares2X2 } from "react-icons/hi2";
import { services } from "../services/registry";

/** Nav pill naming the current world; opens a list to jump to another. */
const ServiceSwitcher = ({ service }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close when the route (and so the service) changes.
  useEffect(() => setOpen(false), [service.slug]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2.5 pl-3.5 pr-3 py-2 rounded-full border border-line bg-bg/30 backdrop-blur-md font-mono text-[11px] tracking-[0.2em] uppercase whitespace-nowrap text-ink hover:border-ink/25 transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-accent/60"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
        {service.word}
        <HiChevronDown
          size={14}
          className={`text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+10px)] w-64 p-1.5 rounded-2xl border border-line bg-elev/95 backdrop-blur-xl shadow-2xl shadow-black/30 origin-top-right transition-all duration-300 ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <ul>
          {services.map((s, i) => {
            const current = s.slug === service.slug;
            return (
              <li key={s.slug}>
                <Link
                  to={`/${s.slug}`}
                  tabIndex={open ? 0 : -1}
                  aria-current={current ? "page" : undefined}
                  className={`flex items-baseline gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 outline-none focus-visible:bg-ink/[0.07] ${
                    current ? "bg-ink/[0.06]" : "hover:bg-ink/[0.05]"
                  }`}
                >
                  <span className="font-mono text-[10px] text-accent">0{i + 1}</span>
                  <span className="font-fraunces text-lg leading-none text-ink">{s.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          to="/"
          tabIndex={open ? 0 : -1}
          className="mt-1 flex items-center gap-2.5 px-3 py-2.5 border-t border-line font-mono text-[10px] tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors duration-200 outline-none focus-visible:text-ink"
        >
          <HiOutlineSquares2X2 size={14} />
          All services
        </Link>
      </div>
    </div>
  );
};

export default ServiceSwitcher;
