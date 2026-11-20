import { lazy } from "react";
import Home from "../components/Home";
import BrandHero from "../chapters/BrandHero";
import VideoHero from "../chapters/VideoHero";
import * as apps from "./apps";
import * as brand from "./brand";
import * as video from "./video";

// Below-the-fold chapters are code-split and mounted only when scrolled near
// (see LazySection). Hero chapters are imported eagerly and marked `eager`.
const About = lazy(() => import("../components/About"));
const Services = lazy(() => import("../components/Services"));
const Skills = lazy(() => import("../components/Skills"));
const Experience = lazy(() => import("../components/Experience"));
const Portfolio = lazy(() => import("../components/Portfolio"));
const Contact = lazy(() => import("../components/Contact"));
const CaseStudies = lazy(() => import("../chapters/CaseStudies"));
const ProcessChapters = lazy(() => import("../chapters/ProcessChapters"));
const Artefacts = lazy(() => import("../chapters/Artefacts"));
const Deliverables = lazy(() => import("../chapters/Deliverables"));
const SeoAeo = lazy(() => import("../chapters/SeoAeo"));
const VideoAbout = lazy(() => import("../chapters/VideoAbout"));
const VideoSkills = lazy(() => import("../chapters/VideoSkills"));
const ReelPanel = lazy(() => import("../chapters/ReelPanel"));
const VideoFeature = lazy(() => import("../chapters/VideoFeature"));

const contact = { id: "contact", nav: "Contact", component: Contact };

// The Video world is a numbered deck: hero 01, about 02, skills 03, then one
// panel per row of vertical reels and one per wide edit, so the numbers after
// that follow the data in ./video.js.
const panelNumber = (n) => String(n).padStart(2, "0");
const videoWork = [
  ...video.reelPanels.map((panel) => ({ component: ReelPanel, props: panel })),
  ...video.work.edits.map((item, i) => ({
    component: VideoFeature,
    props: { item, heading: i === 0 && !video.reelPanels.length ? video.work.title : undefined },
  })),
].map((chapter, i) => ({
  ...chapter,
  id: i === 0 ? "work" : `work-${i + 1}`,
  nav: i === 0 ? "Work" : undefined,
  props: { ...chapter.props, index: panelNumber(4 + i) },
}));

/**
 * Every service the studio offers. The chooser, nav switcher and routes are
 * all generated from this list, so adding a service is a new entry here plus
 * its chapters — nothing in the shell changes.
 *
 * - slug:     route segment and the data-world key in src/worlds.css
 * - word:     short label for the nav pill and page openers
 * - door:     the option's full label on the home page
 * - chapters: rendered top to bottom; `nav` adds the chapter to the nav pill,
 *             `eager` mounts it immediately instead of on approach, `props`
 *             is the content handed to the chapter (see ./apps.js etc.)
 */
export const services = [
  {
    slug: "video",
    name: "Video Editing",
    word: "Video",
    door: "edit and create content?",
    tagline: "Edits and short-form content that hold attention past the first second.",
    chapters: [
      { id: "home", eager: true, component: VideoHero, props: { hero: video.hero } },
      { id: "about", nav: "About", component: VideoAbout, props: { ...video.about, index: "02" } },
      { id: "skills", nav: "Skills", component: VideoSkills, props: { ...video.skills, index: "03" } },
      ...videoWork,
      { ...contact, props: { index: panelNumber(4 + videoWork.length) } },
    ],
  },
  {
    slug: "brand",
    name: "Brand Websites",
    word: "Brand",
    door: "increase your brand's presence?",
    tagline: "Sites that feel like the brand before anyone reads a word.",
    chapters: [
      {
        id: "home",
        eager: true,
        component: BrandHero,
        props: { credits: brand.credits, headline: brand.headline, pulls: brand.pulls },
      },
      {
        id: "process",
        nav: "Process",
        component: ProcessChapters,
        props: { steps: brand.process, title: "How a brand site gets made." },
      },
      { id: "seo", nav: "SEO", component: SeoAeo, props: { ...brand.seo, index: "02" } },
      { id: "work", nav: "Work", component: Artefacts, props: { items: brand.work, index: "03" } },
      {
        id: "included",
        nav: "Included",
        component: Deliverables,
        props: { items: brand.deliverables, index: "04" },
      },
      { ...contact, props: { index: "05" } },
    ],
  },
  {
    slug: "apps",
    name: "Apps & Products",
    word: "Products",
    door: "develop a custom product?",
    tagline: "Full-stack products and AI systems, from first commit to production.",
    chapters: [
      { id: "home", eager: true, component: Home },
      { id: "about", nav: "About", component: About },
      { id: "services", nav: "Services", component: Services, props: { items: apps.capabilities } },
      { id: "skills", nav: "Stack", component: Skills, props: { groups: apps.stack } },
      { id: "experience", nav: "Experience", component: Experience, props: { experiences: apps.experience } },
      { id: "work", nav: "Work", component: CaseStudies, props: { studies: apps.caseStudies } },
      {
        id: "portfolio",
        component: Portfolio,
        props: {
          eyebrow: "More work",
          projects: apps.projects.filter((p) => !apps.caseStudies.some((c) => c.title === p.title)),
        },
      },
      contact,
    ],
  },
];

// Each service can be hidden from the live site without deleting its code:
// set its VITE_SHOW_* env var to "false" (in .env.local, or as a build-time
// env var on the host) and it drops out of the chooser, the nav pill and its
// own route. Unset or anything else means shown — this never hides a page by
// accident. See .env.example.
const flags = {
  video: import.meta.env.VITE_SHOW_VIDEO,
  brand: import.meta.env.VITE_SHOW_BRAND,
  apps: import.meta.env.VITE_SHOW_APPS,
};
export const visibleServices = services.filter((s) => flags[s.slug] !== "false");

export const findService = (slug) => visibleServices.find((s) => s.slug === slug);

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
