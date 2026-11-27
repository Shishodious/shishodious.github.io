// Who this is and what's on offer, as plain data with no React in it. The
// registry builds each world from these entries, and the build-time page
// snapshots (src/seo/snapshot.js) read the same copy, so what crawlers and AI
// assistants see always matches the live pages.

export const person = {
  name: "Priyanshu Shishodia",
  role: "Video editor, designer and full-stack developer",
  roleShort: "Editor · Designer · Developer",
  email: "priyanshushishodia008@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/priyanshu-shishodia",
    github: "https://github.com/Shishodious",
    instagram: "https://www.instagram.com/pryyshuu/",
  },
};

// The home page's copy: the hero headline, one line per entry, and the
// statement that reveals word by word on scroll.
export const home = {
  title: "Priyanshu Shishodia — Video Editor, Designer & Developer",
  description:
    "Priyanshu Shishodia — video editing, content creation, brand websites and full-stack products, one person start to finish.",
  headline: ["I create and edit.", "Your brand grows.", "Simple."],
  statement:
    "I edit videos that hold attention past the first second, build brand sites that feel like the brand, and ship products end to end. One person, start to finish.",
};

/**
 * One entry per service, in display order.
 * - slug:     route segment and the data-world key in src/worlds.css
 * - word:     short label for the nav pill and page openers
 * - door:     the option's full label on the home page
 * - tagline:  one-line summary, also the page's meta description
 * - heroTone: optional tone the nav borrows while it floats over the hero
 */
export const catalog = [
  {
    slug: "video",
    name: "Video Editing",
    word: "Video",
    door: "edit and create content?",
    tagline: "Edits and short-form content that hold attention past the first second.",
    heroTone: "paper",
  },
  {
    slug: "brand",
    name: "Brand Websites",
    word: "Brand",
    door: "increase your brand's presence?",
    tagline: "Sites that feel like the brand before anyone reads a word.",
  },
  {
    slug: "apps",
    name: "Apps & Products",
    word: "Products",
    door: "develop a custom product?",
    tagline: "Full-stack products and AI systems, from first commit to production.",
  },
];

export const catalogEntry = (slug) => catalog.find((s) => s.slug === slug);
