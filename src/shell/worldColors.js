// Reads a world's palette out of src/worlds.css as 0–1 RGB triples, for the
// WebGL effects that can't use CSS variables directly.

const cache = new Map();

const channels = (style, name) =>
  style.getPropertyValue(name).trim().split(/\s+/).map((n) => Number(n) / 255);

export const worldColors = (slug) => {
  if (cache.has(slug)) return cache.get(slug);
  const probe = document.createElement("div");
  probe.dataset.world = slug;
  probe.hidden = true;
  document.body.appendChild(probe);
  const style = getComputedStyle(probe);
  const colors = {
    bg: channels(style, "--bg"),
    accent: channels(style, "--accent"),
    glow: Number(style.getPropertyValue("--glow")) || 0.4,
  };
  probe.remove();
  cache.set(slug, colors);
  return colors;
};
