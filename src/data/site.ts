export const site = {
  name: "AZUG FR",
  description: {
    fr: "La communauté Azure en France — Azure User Group France",
    en: "The Azure community in France — Azure User Group France",
  },
  /** Contact address used for every mailto link */
  contactEmail: "paris@azug.fr",
  /** Canonical base URL (GitHub Pages custom domain) */
  url: "https://azug.fr",
  /** Source repository of this website, for profile updates by pull request */
  repo: "https://github.com/azugfr/azugfr-website",
  /** MTG France (Microsoft Tech Group France): the network AZUG FR belongs to, as its Paris community */
  network: {
    name: "MTG France",
    url: "https://www.mtg-france.org/",
  },
  social: {
    twitter: "https://twitter.com/azugfr",
    github: "https://github.com/azugfr",
    meetup: "https://www.meetup.com/azug-fr",
    linkedin: "https://www.linkedin.com/company/azugfr",
  },
};

export type SiteConfig = typeof site;
