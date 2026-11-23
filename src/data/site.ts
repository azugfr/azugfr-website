export const site = {
  name: "AZUG FR",
  description: {
    fr: "La communauté Azure en France — Azure User Group France",
    en: "The Azure community in France — Azure User Group France",
  },
  /** Contact address used for every mailto link */
  contactEmail: "paris@azug.fr",
  /** Canonical base URL (org GitHub Pages — no subdirectory) */
  url: "https://azugfr.github.io",
  social: {
    twitter: "https://twitter.com/azugfr",
    github: "https://github.com/azugfr",
    meetup: "https://www.meetup.com/azug-fr",
    linkedin: "https://www.linkedin.com/company/azugfr",
  },
};

export type SiteConfig = typeof site;
