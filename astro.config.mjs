import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "static",
  // azugfr.github.io is an org/user page → no base path needed
  site: "https://azugfr.github.io",
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      i18n: { defaultLocale: "fr", locales: { fr: "fr-FR", en: "en-GB" } },
      filter: (page) => {
        const p = new URL(page).pathname;
        return p !== "/" && !/^\/(fr|en)\/search\/?$/.test(p) && !/^\/404/.test(p);
      },
    }),
  ],
});
