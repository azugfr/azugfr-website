import type { Locale } from "@/lib/i18n";

interface OrganizerData {
  name: string;
  role: { fr: string; en: string };
  linkedin?: string;
  github?: string;
}

interface AboutData {
  manifesto: { fr: string; en: string };
  history: { fr: string; en: string };
  mission: { fr: string; en: string };
  organizers: OrganizerData[];
}

export const aboutData: AboutData = {
  manifesto: {
    fr: "AZUG FR est la communauté francophone des professionnels et passionnés de Microsoft Azure en France. Fondée par des praticiens pour des praticiens, notre mission est de favoriser le partage de connaissances, l'entraide et le développement professionnel autour de la plateforme cloud Azure.",
    en: "AZUG FR is the French-speaking community for Microsoft Azure professionals and enthusiasts in France. Founded by practitioners for practitioners, our mission is to foster knowledge sharing, mutual support and professional development around the Azure cloud platform.",
  },
  history: {
    fr: "AZUG FR a été créé en 2014 par un groupe d'experts Azure convaincus que la communauté locale était essentielle pour faire progresser les compétences cloud en France. Depuis, nous avons organisé plus de 50 événements — meetups, ateliers, et notre événement phare Global Azure France — réunissant des milliers de participants.",
    en: "AZUG FR was founded in 2014 by a group of Azure experts convinced that a local community was essential for advancing cloud skills in France. Since then, we have organized over 50 events — meetups, workshops, and our flagship Global Azure France event — bringing together thousands of participants.",
  },
  mission: {
    fr: "Notre mission : créer un espace bienveillant où chacun — du débutant à l'expert — peut apprendre, partager et progresser sur Azure et l'écosystème Microsoft Cloud.",
    en: "Our mission: create a welcoming space where everyone — from beginner to expert — can learn, share and grow on Azure and the Microsoft Cloud ecosystem.",
  },
  organizers: [
    {
      name: "Équipe AZUG FR",
      role: { fr: "Organisateurs bénévoles", en: "Volunteer Organizers" },
      linkedin: "https://www.linkedin.com/company/azure-user-group-france/",
    },
  ],
};

/** Helper to keep templates clean */
export function getAboutContent(locale: Locale) {
  return {
    manifesto: aboutData.manifesto[locale],
    history: aboutData.history[locale],
    mission: aboutData.mission[locale],
    organizers: aboutData.organizers.map((o) => ({
      ...o,
      role: o.role[locale],
    })),
  };
}
