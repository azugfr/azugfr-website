import { defineCollection, z } from "astro:content";

// ---------------------------------------------------------------------------
// Shared locale enum
// ---------------------------------------------------------------------------
const localeEnum = z.enum(["fr", "en"]);

// ---------------------------------------------------------------------------
// events
// ---------------------------------------------------------------------------
export const eventsSchema = z.object({
  // locale-neutral
  slug: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  timezone: z.string(),
  status: z.enum(["upcoming", "past", "cancelled"]),
  venue: z
    .object({
      name: z.string().optional(),
      city: z.string().optional(),
      address: z.string().optional(),
      mode: z.enum(["in_person", "online", "hybrid"]),
    })
    .optional(),
  registrationUrl: z.string().optional(),
  meetupUrl: z.string().optional(),
  heroImage: z.string().optional(),
  speakerSlugs: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  source: z.object({
    provider: z.literal("meetup"),
    externalId: z.string(),
    lastSyncedAt: z.string(),
  }),
  // locale-specific (canonical)
  locale: localeEnum,
  title: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  // translations
  translations: z
    .object({
      fr: z
        .object({
          title: z.string().optional(),
          summary: z.string().optional(),
          description: z.string().optional(),
        })
        .optional(),
      en: z
        .object({
          title: z.string().optional(),
          summary: z.string().optional(),
          description: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type EventEntry = z.infer<typeof eventsSchema>;

// ---------------------------------------------------------------------------
// news
// ---------------------------------------------------------------------------
export const newsSchema = z.object({
  // locale-neutral
  slug: z.string(),
  publishedAt: z.string(),
  author: z.string().optional(),
  sourceUrl: z.string(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source: z.object({
    provider: z.literal("linkedin-rss"),
    externalId: z.string(),
    lastSyncedAt: z.string(),
  }),
  // locale-specific (canonical)
  locale: localeEnum,
  title: z.string(),
  summary: z.string(),
  content: z.string().optional(),
  // translations
  translations: z
    .object({
      fr: z
        .object({
          title: z.string().optional(),
          summary: z.string().optional(),
          content: z.string().optional(),
        })
        .optional(),
      en: z
        .object({
          title: z.string().optional(),
          summary: z.string().optional(),
          content: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type NewsEntry = z.infer<typeof newsSchema>;

// ---------------------------------------------------------------------------
// speakers
// ---------------------------------------------------------------------------
export const speakersSchema = z.object({
  // locale-neutral
  slug: z.string(),
  name: z.string(),
  photo: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  location: z.string().optional(),
  links: z
    .object({
      website: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      x: z.string().optional(),
    })
    .optional(),
  derivedFrom: z
    .object({
      eventSourceIds: z.array(z.string()).optional(),
      displayNameVariants: z.array(z.string()).optional(),
    })
    .optional(),
  // locale-specific (canonical)
  locale: localeEnum,
  headline: z.string().optional(),
  bio: z.string().optional(),
  expertise: z.array(z.string()).optional(),
  // translations
  translations: z
    .object({
      fr: z
        .object({
          headline: z.string().optional(),
          bio: z.string().optional(),
          expertise: z.array(z.string()).optional(),
        })
        .optional(),
      en: z
        .object({
          headline: z.string().optional(),
          bio: z.string().optional(),
          expertise: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
});

export type SpeakerEntry = z.infer<typeof speakersSchema>;

// ---------------------------------------------------------------------------
// sponsors
// ---------------------------------------------------------------------------
export const sponsorsSchema = z.object({
  // locale-neutral
  slug: z.string(),
  name: z.string(),
  tier: z.string().optional(),
  website: z.string(),
  logo: z.string().optional(),
  featured: z.boolean().optional(),
  // locale-specific (canonical)
  locale: localeEnum,
  description: z.string().optional(),
  alt: z.string().optional(),
  // translations
  translations: z
    .object({
      fr: z
        .object({
          description: z.string().optional(),
          alt: z.string().optional(),
        })
        .optional(),
      en: z
        .object({
          description: z.string().optional(),
          alt: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type SponsorEntry = z.infer<typeof sponsorsSchema>;

// ---------------------------------------------------------------------------
// resources
// ---------------------------------------------------------------------------
export const resourcesSchema = z.object({
  // locale-neutral
  slug: z.string(),
  type: z.enum(["slides", "video", "article", "repository", "other"]),
  url: z.string(),
  eventSlug: z.string().optional(),
  speakerSlugs: z.array(z.string()).optional(),
  publishedAt: z.string().optional(),
  // locale-specific (canonical)
  locale: localeEnum,
  title: z.string(),
  summary: z.string().optional(),
  // translations
  translations: z
    .object({
      fr: z
        .object({
          title: z.string().optional(),
          summary: z.string().optional(),
        })
        .optional(),
      en: z
        .object({
          title: z.string().optional(),
          summary: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type ResourceEntry = z.infer<typeof resourcesSchema>;

// ---------------------------------------------------------------------------
// about — sections + organizers
// ---------------------------------------------------------------------------
export const aboutSectionSchema = z.object({
  type: z.literal("section"),
  slug: z.string(),
  order: z.number(),
  locale: localeEnum,
  title: z.string(),
  body: z.string(),
  translations: z
    .object({
      fr: z
        .object({
          title: z.string().optional(),
          body: z.string().optional(),
        })
        .optional(),
      en: z
        .object({
          title: z.string().optional(),
          body: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const aboutOrganizerSchema = z.object({
  type: z.literal("organizer"),
  slug: z.string(),
  order: z.number().optional(),
  locale: localeEnum,
  name: z.string(),
  role: z.string(),
  photo: z.string().optional(),
  company: z.string().optional(),
  mvp: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  twitter: z.string().optional(),
  translations: z
    .object({
      fr: z
        .object({
          role: z.string().optional(),
        })
        .optional(),
      en: z
        .object({
          role: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const aboutSchema = z.discriminatedUnion("type", [
  aboutSectionSchema,
  aboutOrganizerSchema,
]);

export type AboutSection = z.infer<typeof aboutSectionSchema>;
export type AboutOrganizer = z.infer<typeof aboutOrganizerSchema>;

// ---------------------------------------------------------------------------
// Collection definitions
// ---------------------------------------------------------------------------
export const collections = {
  events: defineCollection({ type: "data", schema: eventsSchema }),
  news: defineCollection({ type: "data", schema: newsSchema }),
  speakers: defineCollection({ type: "data", schema: speakersSchema }),
  sponsors: defineCollection({ type: "data", schema: sponsorsSchema }),
  resources: defineCollection({ type: "data", schema: resourcesSchema }),
  about: defineCollection({ type: "data", schema: aboutSchema }),
};
