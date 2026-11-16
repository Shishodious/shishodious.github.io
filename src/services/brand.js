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

// SEO and AEO. Tools and techniques only: no promises about rankings.
export const seo = {
  title: ["Found on Google.", "Cited by AI."],
  intro:
    "SEO and AEO are handled end to end, from the first line of code to the reports after launch. Nothing to bolt on later, and no extra agency to brief.",
  groups: [
    {
      title: "Technical SEO",
      body: "A site search engines can crawl, understand and load fast, on every device.",
      items: ["XML sitemap", "Robots.txt", "Canonical tags", "Redirects", "Core Web Vitals", "Mobile-first", "Image optimisation"],
    },
    {
      title: "On-page SEO",
      body: "Every page built around a real search, in the words your customers actually use.",
      items: ["Keyword research", "Titles & meta", "Heading structure", "Internal linking", "Alt text", "Open Graph images"],
    },
    {
      title: "AEO",
      body: "Answer engine optimisation: making your brand easy for ChatGPT, Perplexity and Google's AI Overviews to understand and quote.",
      items: ["JSON-LD schema", "FAQ content", "llms.txt", "AI crawler access", "Answer-first copy", "Brand & entity signals"],
    },
    {
      title: "Analytics & tracking",
      body: "Search Console shows how people find you, GA4 what they do next, a Meta Pixel which ads pay off, and Clarity's heatmaps and session recordings where they get stuck.",
      items: ["Google Search Console", "Google Analytics 4", "Google Tag Manager", "Meta Pixel", "Microsoft Clarity", "Bing Webmaster Tools", "Conversion events"],
    },
  ],
};

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
