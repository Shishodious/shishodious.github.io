// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Channels come from the active world in src/worlds.css.
        bg: "rgb(var(--bg) / <alpha-value>)",
        elev: "rgb(var(--elev) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        line: "rgb(var(--ink) / 0.08)",
      },
      fontFamily: {
        grotesk: ['"Space Grotesk"', "sans-serif"],
        fraunces: ["Fraunces", "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      transitionDuration: {
        350: "350ms",
        400: "400ms",
      },
    },
  },
  plugins: [],
};
