// Content for the Apps & Products world. Sections render whatever they're
// given here; the registry wires each list to its chapter.
import {
  HiOutlineGlobeAlt,
  HiOutlineServerStack,
  HiOutlineSignal,
  HiOutlineSparkles,
  HiOutlineSquare3Stack3D,
} from "react-icons/hi2";
import momentum from "../assets/momentum.jpg";
import creatorvision from "../assets/creatorvision.jpg";
import videotube from "../assets/videotube.jpg";
import uber from "../assets/uber.jpg";
import chatapp from "../assets/chatapp.jpg";
import oversocs from "../assets/oversocs.jpg";
import autocrawler from "../assets/autocrawler.jpg";

export const capabilities = [
  {
    id: "01",
    title: "Full-Stack Web Apps",
    icon: HiOutlineSquare3Stack3D,
    description:
      "Complete products — React and Next.js frontends backed by Node or NestJS APIs, taken from first commit to production.",
  },
  {
    id: "02",
    title: "AI-Integrated Products",
    icon: HiOutlineSparkles,
    description:
      "Language and vision models wired into real product surfaces — multimodal pipelines, embeddings and vector search, structured extraction from messy input, and queue-driven processing built for production volume.",
  },
  {
    id: "03",
    title: "Backend & API Systems",
    icon: HiOutlineServerStack,
    description:
      "REST APIs with authentication, role-based access, job queues, and system design that holds up as usage grows.",
  },
  {
    id: "04",
    title: "Realtime Applications",
    icon: HiOutlineSignal,
    description:
      "Live chat, tracking, and notifications over WebSockets — engineered for concurrent users, not demos.",
  },
  {
    id: "05",
    title: "Automation & Scraping",
    icon: HiOutlineGlobeAlt,
    description:
      "Structured data extraction at scale — rate-limited, retry-safe crawlers exposed through clean APIs.",
  },
];

export const stack = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "GSAP", "Framer Motion"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "NestJS", "REST APIs", "WebSockets"],
  },
  {
    category: "AI & Automation",
    items: [
      "LLM APIs",
      "Google Gemini",
      "pgvector",
      "Vector Search",
      "OCR & Transcription",
      "Puppeteer",
    ],
  },
  {
    category: "Data & Cloud",
    items: ["PostgreSQL", "MongoDB", "Redis", "AWS", "Strapi"],
  },
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "SQL"],
  },
];

export const experience = [
  {
    company: "Hypeliv",
    role: "Software Engineer — Current",
    summary:
      "Engineered and delivered a production website for a US-based client using React with a headless CMS backend.",
    points: [
      "Built backend services for an AI-powered creator analytics platform with NestJS, BullMQ for async job queues, and PostgreSQL via TypeORM.",
      "Integrated AWS S3, Rekognition, and SES for media storage, content moderation, and transactional email.",
      "Took part in code reviews, debugging sessions, and sprint planning to drive iterative delivery.",
    ],
    stack: ["React", "NestJS", "BullMQ", "PostgreSQL", "TypeORM", "AWS"],
  },
  {
    company: "Techkrate",
    role: "Full Stack Developer Intern",
    summary:
      "Architected and delivered backend modules for a production e-commerce platform on Node.js, Express, and MongoDB.",
    points: [
      "Built secure REST APIs for product management, cart, and order processing with JWT authentication and role-based access control.",
      "Implemented responsive product listings and checkout flows in React, wired to backend business logic.",
    ],
    stack: ["Node.js", "Express", "MongoDB", "React", "JWT"],
  },
];

export const projects = [
  {
    id: "01",
    src: momentum,
    title: "Momentum",
    description:
      "AI marketing engine built at Hypeliv — turns a plain-language brief into on-brand images, short-form reels, UGC presenter videos, and carousels, then schedules and auto-publishes them straight to Instagram, LinkedIn, YouTube, and TikTok. NestJS backend spanning ~55 modules with BullMQ workers, a multi-provider model layer (Anthropic, Google GenAI, ElevenLabs) behind per-provider spend tracking, and a Next.js 16 admin surface for brand context, planning, and publishing.",
    tags: ["Next.js", "NestJS", "Drizzle", "PostgreSQL", "BullMQ", "Anthropic", "Google GenAI"],
    demoLink: "https://momentum.hypeliv.com",
    codeLink: null,
  },
  {
    id: "02",
    src: creatorvision,
    title: "Creator Vision",
    description:
      "AI brand-detection and creator-analytics platform built at Hypeliv — a multi-signal pipeline (Gemini vision, audio transcription, on-screen OCR) that finds brands inside TikTok and YouTube videos and rolls detections into earned-media-value reports. BullMQ-driven processing across 46 backend modules.",
    tags: ["NestJS", "BullMQ", "PostgreSQL", "pgvector", "Google AI", "AWS"],
    demoLink: null,
    codeLink: null,
  },
  {
    id: "03",
    src: autocrawler,
    title: "AutoCrawler",
    description:
      "Web scraping and automation tool — structured data extraction at scale with rate limiting, retries, and a UI to configure crawls and inspect results.",
    tags: ["Node.js", "Puppeteer", "REST API"],
    demoLink: "https://auto-crawler.vercel.app",
    codeLink: "https://github.com/Shishodious/AutoCrawler",
  },
  {
    id: "04",
    src: chatapp,
    title: "Chat-App",
    description:
      "Realtime one-on-one and group messaging with instant delivery, file sharing, and a UI tested with 100+ concurrent users.",
    tags: ["Socket.io", "React", "Node.js"],
    demoLink: "https://chat-app-client-two-gamma.vercel.app/",
    codeLink: "https://github.com/Shishodious/ChatAPP-Client",
  },
  {
    id: "05",
    src: videotube,
    title: "VideoTube",
    description:
      "Full-stack video-sharing platform (YouTube clone) — users register, upload videos to Cloudinary with auto-thumbnails, then watch, search, like, comment, subscribe, and build playlists. Monorepo with an Express/MongoDB REST API and a React 19 SPA, secured by JWT access/refresh tokens.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Cloudinary", "JWT"],
    demoLink: "https://video-tube-server-blush.vercel.app/",
    codeLink: "https://github.com/Shishodious/VideoTube",
  },
  {
    id: "06",
    src: oversocs,
    title: "Oversocs",
    description:
      "E-commerce for exclusive socks — filtered product listings serving 500+ daily visitors, secure auth with cart and checkout, GSAP and Framer Motion micro-interactions.",
    tags: ["React", "Node.js", "GSAP", "Framer Motion"],
    demoLink: "https://oversocs-d86z.vercel.app/",
    codeLink: "https://github.com/Shishodious/OVERSOCS",
  },
  {
    id: "07",
    src: uber,
    title: "Uber Clone",
    description:
      "Full-stack ride-booking platform — live trip tracking over WebSockets for rider and driver roles, Google Maps routing with fare calculation, JWT-protected routes throughout.",
    tags: ["React", "Maps API", "WebSockets", "JWT"],
    demoLink: "https://uber-zeta-woad.vercel.app/",
    codeLink: "https://github.com/Shishodious/UBER",
  },
];

// Flagship work, told as stacking case-study cards ahead of the project reel.
// Figures come straight from the project descriptions above.
export const caseStudies = [
  {
    id: "momentum",
    src: momentum,
    title: "Momentum",
    context: "AI marketing engine · built at Hypeliv",
    summary:
      "A plain-language brief goes in; on-brand images, short-form reels, UGC presenter videos and carousels come out — then get scheduled and auto-published.",
    facts: [
      { value: "~55", label: "backend modules" },
      { value: "4", label: "platforms auto-published" },
      { value: "3", label: "model providers, spend-tracked" },
    ],
    tags: ["Next.js", "NestJS", "Drizzle", "PostgreSQL", "BullMQ"],
    demoLink: "https://momentum.hypeliv.com",
  },
  {
    id: "creatorvision",
    src: creatorvision,
    title: "Creator Vision",
    context: "Brand detection & creator analytics · built at Hypeliv",
    summary:
      "Finds brands inside TikTok and YouTube videos and rolls every detection into earned-media-value reports.",
    facts: [
      { value: "3", label: "detection signals: vision, audio, OCR" },
      { value: "46", label: "backend modules" },
      { value: "2", label: "platforms analysed" },
    ],
    tags: ["NestJS", "BullMQ", "PostgreSQL", "pgvector", "Google AI", "AWS"],
    demoLink: null,
  },
];
