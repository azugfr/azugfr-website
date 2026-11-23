import { defineCollection } from "astro:content";
import {
  eventsSchema,
  newsSchema,
  speakersSchema,
  sponsorsSchema,
  resourcesSchema,
  aboutSchema,
} from "./schemas";

export type {
  EventEntry,
  NewsEntry,
  SpeakerEntry,
  SponsorEntry,
  ResourceEntry,
  AboutSection,
  AboutOrganizer,
} from "./schemas";

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
