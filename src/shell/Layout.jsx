import { useEffect, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavBar from "../components/NavBar";
import SocialLinks from "../components/SocialLinks";
import { findService } from "../services/registry";

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared shell around every page: grain, nav, socials and smooth scroll.
 * The current service's slug becomes data-world on <html>, which swaps the
 * colour channels every Tailwind token reads (src/worlds.css).
 */
const Layout = () => {
  const { pathname } = useLocation();
  const service = findService(pathname.split("/")[1]);

  // Lenis on GSAP's ticker so ScrollTrigger and smooth scroll share a frame.
  // Reduced-motion visitors keep native scrolling.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    const tick = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Before paint, so the new page never flashes in the old world's colours.
  useLayoutEffect(() => {
    const world = service?.slug ?? "gate";
    document.documentElement.dataset.world = world;
    const theme = getComputedStyle(document.documentElement)
      .getPropertyValue("--theme")
      .trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme);
    window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
  }, [pathname, service]);

  return (
    <>
      {/* Film grain over everything */}
      <div className="grain" aria-hidden="true" />

      <NavBar service={service} />
      {service && <SocialLinks />}
      <Outlet />
    </>
  );
};

export default Layout;
