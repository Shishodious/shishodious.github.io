// Content for the Brand Websites world — styled after a film's press kit:
// a credits block, chapters for the process, work shown as framed artefacts.
// Draft copy: edit freely, the chapters only render what's here.

export const credits = {
  title: "Brand Sites",
  rows: [
    { label: "Directed by", value: ["Priyanshu Shishodia"] },
    { label: "Format", value: ["Strategy · Design · Build"] },
    { label: "Starring", value: ["Your brand", "Your story", "Your customers"] },
  ],
};

export const headline = {
  before: "A site that feels like",
  circled: "the brand",
  after: "before anyone reads a word.",
};

// Press-kit style pull quotes. These are principles, not reviews.
export const pulls = [
  { source: "The brief", quote: "Unmistakably yours, not a template" },
  { source: "The build", quote: "Fast, accessible, easy to edit" },
];

export const process = [
  {
    title: "Listen",
    body: "Who you are, who the site is for, and the one thing it has to make people do.",
    yields: ["Brief", "Sitemap", "Success measure"],
  },
  {
    title: "Direction",
    body: "A visual language before a single page: type, colour, imagery, and how things move.",
    yields: ["Moodboard", "Type & colour system", "Motion principles"],
  },
  {
    title: "Design",
    body: "Key pages designed at real sizes, phone first, with real copy instead of lorem ipsum.",
    yields: ["Page designs", "Responsive layouts", "Clickable prototype"],
  },
  {
    title: "Build",
    body: "Hand-built in React and Next.js, animated with GSAP, wired to a CMS your team can edit.",
    yields: ["Production code", "Headless CMS", "SEO & metadata"],
  },
  {
    title: "Launch",
    body: "Performance-checked, deployed on your domain, and handed over with a walkthrough.",
    yields: ["Deployment", "Analytics", "Handover"],
  },
];

/**
 * Brand work, shown as framed artefacts. `src` is a screenshot; entries
 * without one (client work under NDA) render as a sealed card instead.
 * Add new builds here: { id, title, client, year, role, stack, src, link }.
 */
export const work = [
  {
    id: "us-client",
    title: "Production website",
    client: "US-based client",
    role: "Front end + CMS integration",
    stack: ["React", "Headless CMS"],
    nda: true,
  },
];

export const deliverables = [
  "Brief, sitemap & success measure",
  "Visual direction & type system",
  "Responsive page design",
  "Custom React / Next.js build",
  "Motion & interaction",
  "Headless CMS your team can edit",
  "SEO foundations & social previews",
  "Performance & accessibility pass",
  "Launch, analytics & handover",
];
