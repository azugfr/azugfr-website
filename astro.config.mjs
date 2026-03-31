import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "static",
  // azugfr.github.io is an org/user page → no base path needed
  site: "https://azugfr.github.io",
  integrations: [tailwind()],
});
