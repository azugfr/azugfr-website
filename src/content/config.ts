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
// Collection definitions
// ---------------------------------------------------------------------------
export const collections = {
  events: defineCollection({ schema: eventsSchema }),
  news: defineCollection({ schema: newsSchema }),
  speakers: defineCollection({ schema: speakersSchema }),
  sponsors: defineCollection({ schema: sponsorsSchema }),
  resources: defineCollection({ schema: resourcesSchema }),
};
