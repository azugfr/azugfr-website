import type { Locale } from "@/lib/i18n";

export interface GabEdition {
  year: number;
  city: string;
  date: { fr: string; en: string };
  description: { fr: string; en: string };
  registrationUrl?: string;
  recap?: { fr: string; en: string };
}

export interface GlobalAzureData {
  hero: { fr: string; en: string };
  about: { fr: string; en: string };
  editions: GabEdition[];
}

export const globalAzureData: GlobalAzureData = {
  hero: {
    fr: "AZUG FR co-organise chaque année le Global Azure en France — une journée mondiale de formation gratuite sur Microsoft Azure.",
    en: "AZUG FR co-organises the Global Azure event in France each year — a worldwide free training day on Microsoft Azure.",
  },
  about: {
    fr: "Le Global Azure (anciennement Global Azure Bootcamp) est un événement annuel mondial organisé par des bénévoles : MVPs, experts, passionnés et membres de communautés. Des centaines de villes dans le monde organisent simultanément une journée de sessions et d'ateliers gratuits sur Microsoft Azure. En France, AZUG FR coordonne l'événement depuis ses premières éditions, en partenariat avec d'autres communautés régionales.",
    en: "Global Azure (formerly Global Azure Bootcamp) is an annual worldwide event run by volunteers: MVPs, experts, enthusiasts and community members. Hundreds of cities around the world simultaneously host a day of free sessions and workshops on Microsoft Azure. In France, AZUG FR has coordinated the event since its early editions, in partnership with other regional communities.",
  },
  editions: [
    {
      year: 2026,
      city: "Paris (ESGI)",
      date: {
        fr: "18 avril 2026",
        en: "April 18, 2026",
      },
      description: {
        fr: "Édition 2026 du Global Azure France organisée par AZUG FR et l'ESGI à Paris (12ᵉ). Sessions gratuites sur le développement Azure, l'IA, l'infrastructure, le DevOps, la sécurité et la gouvernance cloud.",
        en: "2026 edition of Global Azure France organised by AZUG FR and ESGI in Paris (12th). Free sessions on Azure development, AI, infrastructure, DevOps, security and cloud governance.",
      },
      registrationUrl: "https://www.meetup.com/azug-fr/events/313716280/",
    },
    {
      year: 2022,
      city: "Paris (ESGI)",
      date: {
        fr: "7 mai 2022",
        en: "May 7, 2022",
      },
      description: {
        fr: "Édition parisienne du Global Azure 2022 accueillie à l'ESGI. Une journée complète de sessions sur Microsoft Azure organisée par AZUG FR, avec un agenda détaillé via Sessionize.",
        en: "Parisian edition of Global Azure 2022 hosted at ESGI. A full day of Microsoft Azure sessions organised by AZUG FR, with a detailed agenda via Sessionize.",
      },
      registrationUrl: "https://www.meetup.com/fr-FR/AZUG-FR/events/285002702/",
    },
    {
      year: 2022,
      city: "Aix-en-Provence (PACA)",
      date: {
        fr: "5 mai 2022",
        en: "May 5, 2022",
      },
      description: {
        fr: "Édition PACA du Global Azure 2022 organisée par la communauté Azure & DevOps User Group d'Aix-en-Provence, en partenariat avec AZUG FR.",
        en: "PACA edition of Global Azure 2022 organised by the Azure & DevOps User Group Aix-en-Provence community, in partnership with AZUG FR.",
      },
      registrationUrl:
        "https://www.meetup.com/fr-FR/Meetup-Azure-Devops-Aix-en-Provence/events/259728426/",
    },
    {
      year: 2019,
      city: "France — 6 villes",
      date: {
        fr: "27 avril 2019",
        en: "April 27, 2019",
      },
      description: {
        fr: "Record de participation en France : plus de 250 personnes réunies sur 6 sites — Bordeaux, Lyon, Aix-en-Provence, Paris, Rennes et Strasbourg. L'événement mondial a rassemblé plus de 13 000 participants dans 273 villes de 59 pays.",
        en: "Record turnout in France: over 250 people across 6 venues — Bordeaux, Lyon, Aix-en-Provence, Paris, Rennes and Strasbourg. The global event brought together more than 13,000 participants across 273 cities in 59 countries.",
      },
      recap: {
        fr: "https://globalazure.net",
        en: "https://globalazure.net",
      },
    },
  ],
};

/** Helper to get localised field value */
export function getLocalizedField(
  field: { fr: string; en: string },
  locale: Locale,
): string {
  return field[locale];
}
