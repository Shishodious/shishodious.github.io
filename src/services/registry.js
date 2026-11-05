import { lazy } from "react";
import Home from "../components/Home";
import WorldIntro from "../chapters/WorldIntro";
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
// panel per row of reels, so the numbers after that follow the reel data.
const panelNumber = (n) => String(n).padStart(2, "0");
const firstAfterReels = 4 + video.reelPanels.length;

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
    door: "Video editing",
    tagline: "Cuts, colour and pacing that hold attention past the first second.",
    chapters: [
      { id: "home", eager: true, component: VideoHero, props: { hero: video.hero } },
      { id: "about", nav: "About", component: VideoAbout, props: { ...video.about, index: "02" } },
      { id: "skills", nav: "Skills", component: VideoSkills, props: { ...video.skills, index: "03" } },
      ...video.reelPanels.map((panel, i) => ({
        id: i === 0 ? "work" : `work-${i + 1}`,
        nav: i === 0 ? "Work" : undefined,
        component: ReelPanel,
        props: { ...panel, index: panelNumber(4 + i) },
      })),
      {
        id: "feature",
        component: VideoFeature,
        props: { item: video.feature, index: panelNumber(firstAfterReels) },
      },
      { ...contact, props: { index: panelNumber(firstAfterReels + 1) } },
    ],
  },
  {
    slug: "content",
    name: "Content Creation",
    word: "Content",
    door: "Content creation",
    tagline: "Short-form that sounds like you and lands with the people you want.",
    chapters: [{ id: "home", eager: true, component: WorldIntro }, contact],
  },
  {
    slug: "brand",
    name: "Brand Websites",
    word: "Brand",
    door: "Brand presence",
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
    door: "Product development",
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
