/** @type {import('tailwindcss').Config} */
// Colour tokens are CSS variables (RGB channels) defined in src/styles/global.css,
// so utilities such as `bg-ciel` and `border-encre/15` share one source of truth.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ciel: token("ciel"),
        "ciel-soft": token("ciel-soft"),
        aube: token("aube"),
        encre: token("encre"),
        azur: token("azur"),
        "azur-deep": token("azur-deep"),
        rouge: token("rouge"),
        papier: token("papier"),
        brume: token("brume"),
        trait: token("trait"),
        gris: token("gris"),
        givre: token("givre"),
      },
      fontFamily: {
        sans: ['"Archivo Variable"', "system-ui", "sans-serif"],
      },
      // Type scale from docs/DESIGN-2026-11.md: 15, 18, 20, 24, 28, 36, 40, 60, 112
      fontSize: {
        meta: ["15px", { lineHeight: "1.45" }],
        body: ["18px", { lineHeight: "1.55" }],
        lead: ["20px", { lineHeight: "1.4" }],
      },
      borderRadius: {
        btn: "6px",
        panel: "10px",
      },
    },
  },
  plugins: [],
};
