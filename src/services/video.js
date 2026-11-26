// Content for the Video Editing world: a deck of numbered full-screen panels.
// Draft copy: edit freely, the chapters only render what's here.
//
// Adding your videos: put the file in public/video/ and fill in the entry, e.g.
//   { id: "reel-01", title: "Client — Campaign", src: "/video/reel-01.mp4", poster: "/video/reel-01.jpg" }
// `poster` is optional. An entry with `src: null` shows a film-leader placeholder.
// Compress first (H.264 .mp4, 1080p, a few MB per 10 s): they all ship with the
// site, though each only downloads when its panel comes on screen.

// One of the edits in public/video, by file name. `preview` is the small silent
// loop the hero plays inline (8 s, 480px wide, in public/video/previews).
const clip = (id, title) => ({
  id,
  title,
  src: `/video/${id}.mp4`,
  poster: `/video/${id}.jpg`,
  preview: `/video/previews/${id}.mp4`,
});

// The opening panel: a hello with a playing reel, then a short story with a
// clip of the work tucked in after each phrase. Strings are text, `clip`s sit inline.
export const hero = {
  greeting: "Hi, nice to meet you. I'm Priyanshu",
  reel: { ...clip("i-hate-creating-content", "I Hate Creating Content"), ratio: "16 / 9" },
  story: [
    "I got into editing through my own projects",
    clip("game-to-bike", "Game to Bike"),
    "and ended up falling in love with making things move.",
    clip("office-thorfinn", "Office × Thorfinn"),
    "These days I cut life crossovers,",
    clip("almighty-push", "Gym × Akatsuki"),
    "gym edits",
    clip("gym-car-wheel", "Gym × Car Wheel"),
    "and everything in between.",
    clip("office-clones", "Office Clones"),
  ],
};

export const about = {
  title: ["A little", "about me"],
  body: "Hi, I'm Priyanshu. I edit video that holds attention past the first second: clean cuts, considered colour, and pacing built around the story you're telling.",
  reel: {
    id: "almighty-push",
    title: "Gym × Akatsuki",
    ratio: "16 / 9",
    src: "/video/almighty-push.mp4",
    poster: "/video/almighty-push.jpg",
  },
};

export const skills = {
  title: ["Skills &", "expertise"],
  tools: ["CapCut", "DaVinci Resolve", "After Effects", "Premiere Pro"],
  styles: [
    "Short-form & social",
    "Content creation",
    "Ads & promos",
    "Podcasts & talking heads",
    "Corporate & brand films",
    "Documentary",
    "Music videos",
  ],
};

// Rows of three vertical (9:16) videos, shown before the wide edits. Empty for
// now; add rows like
//   { title: "Shorts", tone: "ash", reels: [{ id, title, src }, { ... }, { ... }] }
// and the panel numbering on the page follows.
export const reelPanels = [];

// Landscape edits, one full-screen panel each, in this order. `ratio` is the
// file's width / height so nothing gets cropped; `tone` is a set in worlds.css.
export const work = {
  title: "My work",
  edits: [
    {
      id: "office-thorfinn",
      title: "Office × Thorfinn",
      length: "0:33",
      ratio: "1920 / 824",
      src: "/video/office-thorfinn.mp4",
      poster: "/video/office-thorfinn.jpg",
    },
    {
      id: "gym-car-wheel",
      title: "Gym × Car Wheel",
      length: "0:08",
      ratio: "16 / 9",
      tone: "bone",
      src: "/video/gym-car-wheel.mp4",
      poster: "/video/gym-car-wheel.jpg",
    },
    {
      id: "office-clones",
      title: "Office Clones",
      length: "0:21",
      ratio: "16 / 9",
      src: "/video/office-clones.mp4",
      poster: "/video/office-clones.jpg",
    },
    {
      id: "game-to-bike",
      title: "Game to Bike",
      length: "0:17",
      ratio: "16 / 9",
      tone: "bone",
      src: "/video/game-to-bike.mp4",
      poster: "/video/game-to-bike.jpg",
    },
  ],
};
