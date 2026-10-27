import { useEffect, useState } from "react";

const NAV_OFFSET = -70;

/**
 * Smooth-scrolls to a section by id. Sections mount lazily (LazySection) and
 * grow as the page passes them, so the target moves mid-trip — re-aim on
 * arrival until it actually lands under the nav.
 */
export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = window.__lenis;

  const land = (attempt) => {
    const delta = el.getBoundingClientRect().top + NAV_OFFSET;
    if (Math.abs(delta) < 2 || attempt > 4) return;
    if (lenis) {
      lenis.scrollTo(el, {
        offset: NAV_OFFSET,
        duration: attempt ? 0.5 : 1.2,
        onComplete: () => land(attempt + 1),
      });
    } else {
      window.scrollTo(0, window.scrollY + delta);
      setTimeout(() => land(attempt + 1), 250);
    }
  };
  land(0);
};

/** The id of the section currently under the nav, or null above the first. */
export const useActiveSection = (ids) => {
  const [active, setActive] = useState(null);
  const key = ids.join(",");

  useEffect(() => {
    const list = key ? key.split(",") : [];
    let frame;
    const update = () => {
      frame = null;
      let current = null;
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + NAV_OFFSET <= 20) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
};
