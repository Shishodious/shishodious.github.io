import { lazy } from "react";
import Home from "../components/Home";
import WorldIntro from "../chapters/WorldIntro";

// Below-the-fold chapters are code-split and mounted only when scrolled near
// (see LazySection). Hero chapters are imported eagerly and marked `eager`.
const About = lazy(() => import("../components/About"));
const Services = lazy(() => import("../components/Services"));
const Skills = lazy(() => import("../components/Skills"));
const Experience = lazy(() => import("../components/Experience"));
const Portfolio = lazy(() => import("../components/Portfolio"));
const Contact = lazy(() => import("../components/Contact"));

const contact = { id: "contact", nav: "Contact", component: Contact };

/**
 * Every service the studio offers. The chooser, nav switcher and routes are
 * all generated from this list, so adding a service is a new entry here plus
 * its chapters — nothing in the shell changes.
 *
 * - slug:     route segment and the data-world key in src/worlds.css
 * - chapters: rendered top to bottom; `nav` adds the chapter to the nav pill,
 *             `eager` mounts it immediately instead of on approach
 */
export const services = [
  {
    slug: "video",
    name: "Video Editing",
    word: "Video",
    tagline: "Cuts, colour and pacing that hold attention past the first second.",
    chapters: [{ id: "home", eager: true, component: WorldIntro }, contact],
  },
  {
    slug: "content",
    name: "Content Creation",
    word: "Content",
    tagline: "Short-form that sounds like you and lands with the people you want.",
    chapters: [{ id: "home", eager: true, component: WorldIntro }, contact],
  },
  {
    slug: "brand",
    name: "Brand Websites",
    word: "Brands",
    tagline: "Sites that feel like the brand before anyone reads a word.",
    chapters: [{ id: "home", eager: true, component: WorldIntro }, contact],
  },
  {
    slug: "apps",
    name: "Apps & Products",
    word: "Products",
    tagline: "Full-stack products and AI systems, from first commit to production.",
    chapters: [
      { id: "home", eager: true, component: Home },
      { id: "about", nav: "About", component: About },
      { id: "services", nav: "Services", component: Services },
      { id: "skills", nav: "Stack", component: Skills },
      { id: "experience", nav: "Experience", component: Experience },
      { id: "portfolio", nav: "Work", component: Portfolio },
      contact,
    ],
  },
];

export const findService = (slug) => services.find((s) => s.slug === slug);

const LAST_KEY = "studio:last-service";

export const rememberService = (slug) => {
  try {
    localStorage.setItem(LAST_KEY, slug);
  } catch {
    /* storage blocked — the chooser just won't highlight a last pick */
  }
};

export const lastService = () => {
  try {
    return localStorage.getItem(LAST_KEY);
  } catch {
    return null;
  }
};
