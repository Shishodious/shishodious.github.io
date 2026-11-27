// What crawlers and AI assistants read. The build turns each entry in
// `pages` into a real HTML file (see prerender in vite.config.js): its own
// title, description, canonical and Open Graph tags, JSON-LD, and the page's
// text as plain semantic HTML. Visitors never see that text: the app replaces
// it on load, and a head script hides it until then. Everything here is read
// from the same data the pages render, so the two can't drift apart.
//
// Plain JS on purpose: it runs in Node at build time, outside React.

import { catalog, home, person } from "../services/catalog";
import * as video from "../services/video";
import * as brand from "../services/brand";
import * as apps from "../services/apps";

export const SITE_URL = "https://shishodious.github.io";

// Same switch the registry uses: a service hidden with VITE_SHOW_<SLUG>=false
// gets no page and no links.
const shown = (slug) => import.meta.env[`VITE_SHOW_${slug.toUpperCase()}`] !== "false";
const services = catalog.filter((s) => shown(s.slug));

const esc = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
const url = (path) => `${SITE_URL}${path}`;

// ——— Structured data ———

const personLd = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: person.name,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og-image.png`,
  jobTitle: person.role,
  email: `mailto:${person.email}`,
  worksFor: { "@type": "Organization", name: "Hypeliv", url: "https://hypeliv.com" },
  knowsAbout: [
    "Video editing",
    "Short-form content",
    "Content creation",
    ...video.skills.tools,
    "Brand websites",
    "SEO",
    "Answer engine optimisation",
    ...apps.stack.flatMap((group) => group.items).slice(0, 12),
  ],
  sameAs: Object.values(person.links),
};

const websiteLd = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: person.name,
  url: `${SITE_URL}/`,
  publisher: { "@id": `${SITE_URL}/#person` },
};

const graph = (...nodes) => ({ "@context": "https://schema.org", "@graph": nodes });

const breadcrumb = (service) => ({
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: person.name, item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: service.name, item: url(`/${service.slug}`) },
  ],
});

const serviceLd = (service, extra = {}) => ({
  "@type": "Service",
  name: service.name,
  description: service.tagline,
  url: url(`/${service.slug}`),
  provider: { "@id": `${SITE_URL}/#person` },
  ...extra,
});

// ——— Shared page chrome ———

const nav = `<nav aria-label="Pages">${list([
  link("/", "Home"),
  ...services.map((s) => link(`/${s.slug}`, s.name)),
])}</nav>`;

const contact = `<section id="contact"><h2>Contact</h2>
<p>Open to freelance work, collaborations and full-time roles, on-site or remote.</p>
${list([
  link(`mailto:${person.email}`, person.email),
  link(person.links.linkedin, "LinkedIn"),
  link(person.links.github, "GitHub"),
  link(person.links.instagram, "Instagram"),
])}</section>`;

const body = (main) => `<header>${link("/", person.name)}${nav}</header><main>${main}</main>${contact}`;

// ——— Pages ———

const homePage = {
  path: "/",
  title: home.title,
  description: home.description,
  jsonLd: graph(personLd, websiteLd),
  html: body(`<h1>${esc(person.name)}</h1>
<p>${esc(person.roleShort)}</p>
<p>${esc(home.headline.join(" "))}</p>
<p>${esc(home.statement)}</p>
<section><h2>What can I do for you?</h2>${list(
    services.map((s) => `${link(`/${s.slug}`, s.name)}: ${esc(s.tagline)}`),
  )}</section>`),
};

const pageFor = {
  video: (service) => ({
    jsonLd: graph(
      personLd,
      serviceLd(service, { serviceType: "Video editing", category: video.skills.styles }),
      breadcrumb(service),
    ),
    html: body(`<h1>${esc(service.name)} by ${esc(person.name)}</h1>
<p>${esc(video.hero.greeting)}. ${esc(video.hero.story.filter((bit) => typeof bit === "string").join(" "))}</p>
<section><h2>${esc(video.about.title.join(" "))}</h2><p>${esc(video.about.body)}</p></section>
<section><h2>${esc(video.skills.title.join(" "))}</h2>
<h3>Tools</h3>${list(video.skills.tools.map(esc))}
<h3>Editing styles</h3>${list(video.skills.styles.map(esc))}</section>
<section><h2>${esc(video.work.title)}</h2>${list(
      video.work.edits.map((edit) => `${esc(edit.title)}${edit.length ? ` (${esc(edit.length)})` : ""}`),
    )}</section>`),
  }),

  brand: (service) => ({
    jsonLd: graph(personLd, serviceLd(service, { serviceType: "Brand website design and development" }), breadcrumb(service)),
    html: body(`<h1>${esc(service.name)} by ${esc(person.name)}</h1>
<p>${esc(`${brand.headline.before} ${brand.headline.circled} ${brand.headline.after}`)}</p>
<section><h2>How a brand site gets made</h2><ol>${brand.process
      .map((step) => `<li><h3>${esc(step.title)}</h3><p>${esc(step.body)}</p><p>Delivers: ${esc(step.yields.join(", "))}</p></li>`)
      .join("")}</ol></section>
<section><h2>${esc(brand.seo.title.join(" "))}</h2><p>${esc(brand.seo.intro)}</p>${brand.seo.groups
      .map((group) => `<h3>${esc(group.title)}</h3><p>${esc(group.body)}</p>${list(group.items.map(esc))}`)
      .join("")}</section>
<section><h2>What's included</h2>${list(brand.deliverables.map(esc))}</section>`),
  }),

  apps: (service) => ({
    jsonLd: graph(personLd, serviceLd(service, { serviceType: "Full-stack web and AI product development" }), breadcrumb(service)),
    html: body(`<h1>${esc(service.name)} by ${esc(person.name)}</h1>
<p>${esc(service.tagline)}</p>
<section><h2>Services</h2>${apps.capabilities
      .map((c) => `<h3>${esc(c.title)}</h3><p>${esc(c.description)}</p>`)
      .join("")}</section>
<section><h2>Stack</h2>${apps.stack.map((g) => `<h3>${esc(g.category)}</h3>${list(g.items.map(esc))}`).join("")}</section>
<section><h2>Experience</h2>${apps.experience
      .map(
        (job) =>
          `<h3>${esc(job.role)}, ${esc(job.company)}</h3><p>${esc(job.summary)}</p>${list(job.points.map(esc))}`,
      )
      .join("")}</section>
<section><h2>Projects</h2>${apps.projects
      .map((p) => {
        const links = [p.demoLink && link(p.demoLink, "Live"), p.codeLink && link(p.codeLink, "Code")].filter(Boolean);
        return `<article><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><p>Built with ${esc(p.tags.join(", "))}.</p>${
          links.length ? `<p>${links.join(" · ")}</p>` : ""
        }</article>`;
      })
      .join("")}</section>`),
  }),
};

export const pages = [
  homePage,
  ...services.map((service) => ({
    path: `/${service.slug}`,
    title: `${service.name} — ${person.name}`,
    description: service.tagline,
    ...pageFor[service.slug](service),
  })),
];
