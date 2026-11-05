// Content for the Video Editing world: a deck of numbered full-screen panels.
// Draft copy: edit freely, the chapters only render what's here.
//
// Adding your videos: put the file in public/video/ and fill in the entry, e.g.
//   { id: "reel-01", title: "Client — Campaign", src: "/video/reel-01.mp4", poster: "/video/reel-01.jpg" }
// `poster` is optional. An entry with `src: null` shows a film-leader placeholder.
// Keep each file under about 4 MB (H.264 .mp4): they all ship with the site.

export const hero = {
  name: "Priyanshu Shishodia",
  word: "Portfolio",
  role: "Video Editor",
  reel: { id: "hero", title: "Showreel loop", src: null },
};

export const about = {
  title: ["A little", "about me"],
  body: "Hi, I'm Priyanshu. I edit video that holds attention past the first second: clean cuts, considered colour, and pacing built around the story you're telling.",
  reel: { id: "about", title: "Showreel", src: null },
};

export const skills = {
  title: ["Skills &", "expertise"],
  tools: ["CapCut", "DaVinci Resolve", "After Effects", "Premiere Pro"],
  styles: [
    "Short-form & social",
    "Ads & promos",
    "Podcasts & talking heads",
    "Corporate & brand films",
    "Documentary",
    "Music videos",
  ],
};

// One panel per row of three vertical videos. Add or remove panels freely:
// the numbering on the page follows this list. `tone` is a set in worlds.css.
export const reelPanels = [
  {
    title: "My work",
    tone: "bone",
    reels: [
      { id: "reel-01", title: "Reel 01", src: null },
      { id: "reel-02", title: "Reel 02", src: null },
      { id: "reel-03", title: "Reel 03", src: null },
    ],
  },
  {
    reels: [
      { id: "reel-04", title: "Reel 04", src: null },
      { id: "reel-05", title: "Reel 05", src: null },
      { id: "reel-06", title: "Reel 06", src: null },
    ],
  },
  {
    tone: "ash",
    reels: [
      { id: "reel-07", title: "Reel 07", src: null },
      { id: "reel-08", title: "Reel 08", src: null },
      { id: "reel-09", title: "Reel 09", src: null },
    ],
  },
  {
    reels: [
      { id: "reel-10", title: "Reel 10", src: null },
      { id: "reel-11", title: "Reel 11", src: null },
      { id: "reel-12", title: "Reel 12", src: null },
    ],
  },
];

// The one wide edit that closes the work.
export const feature = { id: "feature", title: "Long-form edit", src: null };
