import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "static",
  trailingSlash: "always",
  // Served from GitHub Pages under the custom domain azug.fr (repo Settings → Pages) → no base path
  site: "https://azug.fr",
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
