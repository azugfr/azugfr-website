import { readdirSync, readFileSync, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  aboutSchema,
  eventsSchema,
  newsSchema,
  resourcesSchema,
  sponsorsSchema,
  speakersSchema,
} from "../../src/content/schemas";
import { globalAzureData } from "../../src/data/globalAzure";
import { deriveEventStatus } from "../../src/lib/content/eventStatus";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const contentDir = (collection: string) => join(ROOT, "src/content", collection);

type Loaded = { file: string; data: any };

function loadCollection(collection: string): Loaded[] {
  const dir = contentDir(collection);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => ({ file: f, data: JSON.parse(readFileSync(join(dir, f), "utf8")) }));
}

const events = loadCollection("events");
const news = loadCollection("news");
const speakers = loadCollection("speakers");
const sponsors = loadCollection("sponsors");
const resources = loadCollection("resources");
const about = loadCollection("about");

/** Every string value in a JSON tree, with the key it sits under. */
function walk(value: unknown, key = "", out: { key: string; value: string }[] = []) {
  if (typeof value === "string") out.push({ key, value });
  else if (Array.isArray(value)) value.forEach((v) => walk(v, key, out));
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) walk(v, k, out);
  return out;
}

const allContentFiles = ["events", "news", "speakers", "sponsors", "resources", "about"].flatMap((c) =>
  loadCollection(c).map((l) => ({ ...l, collection: c })),
);

describe("content integrity", () => {
  it("1. every file in every collection passes its schema", () => {
    const schemas: [string, Loaded[], { safeParse: (d: unknown) => { success: boolean; error?: any } }][] = [
      ["events", events, eventsSchema],
      ["news", news, newsSchema],
      ["speakers", speakers, speakersSchema],
      ["sponsors", sponsors, sponsorsSchema],
      ["resources", resources, resourcesSchema],
      ["about", about, aboutSchema],
    ];
    const failures: string[] = [];
    for (const [name, files, schema] of schemas) {
      for (const { file, data } of files) {
        const res = schema.safeParse(data);
        if (!res.success) {
          const issues = res.error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join("; ");
          failures.push(`${name}/${file}: ${issues}`);
        }
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("2. filename equals slug (about: section-<slug> / organizer-<slug>)", () => {
    const failures: string[] = [];
    for (const [name, files] of [
      ["events", events],
      ["news", news],
      ["speakers", speakers],
      ["resources", resources],
    ] as const) {
      for (const { file, data } of files) {
        if (basename(file, ".json") !== data.slug) failures.push(`${name}/${file} has slug "${data.slug}"`);
      }
    }
    for (const { file, data } of about) {
      const expected = `${data.type}-${data.slug}`;
      if (basename(file, ".json") !== expected) failures.push(`about/${file} should be "${expected}.json"`);
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("3. slugs are unique within each collection", () => {
    const failures: string[] = [];
    for (const [name, files] of [
      ["events", events],
      ["news", news],
      ["speakers", speakers],
      ["sponsors", sponsors],
      ["resources", resources],
      ["about", about],
    ] as const) {
      const seen = new Set<string>();
      for (const { data } of files) {
        if (seen.has(data.slug)) failures.push(`${name}: duplicate slug "${data.slug}"`);
        seen.add(data.slug);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("4. every event speaker (event-level and talk-level) has a speaker file", () => {
    const known = new Set(speakers.map((s) => s.data.slug));
    const misses: string[] = [];
    for (const { data } of events) {
      for (const slug of data.speakerSlugs ?? []) {
        if (!known.has(slug)) misses.push(`${data.slug}: speakerSlugs -> ${slug}`);
      }
      (data.talks ?? []).forEach((t: any, i: number) => {
        for (const slug of t.speakerSlugs) {
          if (!known.has(slug)) misses.push(`${data.slug}: talks[${i}] -> ${slug}`);
        }
      });
    }
    expect(misses, `missing speaker files:\n${misses.join("\n")}`).toEqual([]);
  });

  it("5. no placeholder speakers and no speaker file unreferenced by an event or organizer", () => {
    const slugs = speakers.map((s) => s.data.slug);
    expect(slugs).not.toContain("marie-dupont");
    expect(slugs).not.toContain("jean-martin");

    const referenced = new Set<string>();
    for (const { data } of events) {
      (data.speakerSlugs ?? []).forEach((s: string) => referenced.add(s));
      (data.talks ?? []).forEach((t: any) => t.speakerSlugs.forEach((s: string) => referenced.add(s)));
    }
    // organizers are rendered as speakers on their profile page, so their slug also counts
    for (const { data } of about) if (data.type === "organizer") referenced.add(data.slug);

    const orphans = slugs.filter((s) => !referenced.has(s));
    expect(orphans, `unreferenced speaker files: ${orphans.join(", ")}`).toEqual([]);
  });

  it("6. no sample content", () => {
    const sampleExternal = [...events, ...news].filter(({ data }) =>
      /sample/i.test(String(data.source?.externalId ?? "")),
    );
    expect(sampleExternal.map((f) => f.file)).toEqual([]);

    const hits: string[] = [];
    for (const { file, collection, data } of allContentFiles) {
      for (const { key, value } of walk(data)) {
        if (/sample|contoso|example\.com/i.test(value)) hits.push(`${collection}/${file} [${key}]: ${value}`);
      }
    }
    expect(hits, hits.join("\n")).toEqual([]);

    expect(events.map((e) => e.data.slug)).not.toContain("azure-meetup-may-2025");
  });

  it("7. every event has a non-empty title and summary in both locales", () => {
    const failures: string[] = [];
    for (const { file, data } of events) {
      const other = data.locale === "fr" ? "en" : "fr";
      if (!data.title?.trim()) failures.push(`${file}: empty title`);
      if (!data.summary?.trim()) failures.push(`${file}: empty summary`);
      if (!data.translations?.[other]?.title?.trim()) failures.push(`${file}: no ${other} title`);
      if (!data.translations?.[other]?.summary?.trim()) failures.push(`${file}: no ${other} summary`);
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  // Talks whose source title is already English. They need no translation, since
  // the EN page shows the same text. Any other untranslated talk of a French event fails.
  const ENGLISH_SOURCE_TALKS = new Set([
    "Design. Co-Pilot. Deploy. No Slides. Just Blazor.",
    "Improving Ops with Azure Copilot and GitHub Copilot",
    "Abstractions on top of Azure Blob Storage",
    "Lokad.Onnx, Running deep learning models in .NET managed code",
  ]);

  it("8. talks have titles, valid times, and EN titles when the event is French", () => {
    const failures: string[] = [];
    for (const { file, data } of events) {
      (data.talks ?? []).forEach((t: any, i: number) => {
        const where = `${file} talks[${i}]`;
        if (!t.title?.trim()) failures.push(`${where}: empty title`);
        if (t.time !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(t.time)) failures.push(`${where}: bad time ${t.time}`);
        if (data.locale === "fr" && !t.translations?.en?.title && !ENGLISH_SOURCE_TALKS.has(t.title)) {
          failures.push(`${where}: no en title for "${t.title}"`);
        }
      });
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("9. ihor-leontiev is spelled correctly everywhere", () => {
    expect(existsSync(join(contentDir("speakers"), "ihor-leontiev.json"))).toBe(true);
    const bad = allContentFiles.filter(({ file }) => file.includes("igor-leontiev"));
    const badValues = allContentFiles.flatMap(({ file, data }) =>
      walk(data)
        .filter(({ value }) => value.includes("igor-leontiev"))
        .map(({ value }) => `${file}: ${value}`),
    );
    expect(bad.map((b) => b.file)).toEqual([]);
    expect(badValues).toEqual([]);
  });

  it("10. local image paths exist under public/, organizer photos are remote https, no /organizers/ paths", () => {
    const failures: string[] = [];
    for (const { file, collection, data } of allContentFiles) {
      for (const { key, value } of walk(data)) {
        if (value.includes("/organizers/")) failures.push(`${collection}/${file} [${key}]: ${value}`);
        if (["photo", "heroImage", "logo"].includes(key) && value.startsWith("/")) {
          if (!existsSync(join(ROOT, "public", value))) failures.push(`${collection}/${file} [${key}]: missing ${value}`);
        }
      }
      if (collection === "about" && data.type === "organizer" && data.photo !== undefined) {
        if (!String(data.photo).startsWith("https://")) failures.push(`about/${file}: photo is not https`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("11. no event carries a status other than cancelled", () => {
    const bad = events
      .filter(({ data }) => data.status !== undefined && data.status !== "cancelled")
      .map(({ file, data }) => `${file}: ${data.status}`);
    expect(bad).toEqual([]);
    const cancelled = events.filter(({ data }) => data.status === "cancelled").map(({ data }) => data.slug);
    expect(cancelled).toEqual(["vs-code-dev-days-paris-2025-09-18"]);
  });

  it("12. derived status on real content, at 2026-11-23 and 2026-04-01", () => {
    const late = new Date("2026-11-23T12:00:00Z");
    const early = new Date("2026-04-01T00:00:00Z");
    const statusAt = (now: Date) => Object.fromEntries(events.map(({ data }) => [data.slug, deriveEventStatus(data, now)]));

    const atLate = statusAt(late);
    expect(Object.values(atLate)).not.toContain("upcoming");
    expect(atLate["global-azure-france-2026"]).toBe("past");
    expect(atLate["vs-code-dev-days-paris-2025-09-18"]).toBe("cancelled");

    expect(statusAt(early)["global-azure-france-2026"]).toBe("upcoming");
  });

  it("13. Global Azure editions cover 2023-2026 and every eventSlug resolves to an event file", () => {
    const years = new Set(globalAzureData.editions.map((e) => e.year));
    for (const y of [2023, 2024, 2025, 2026]) expect(years.has(y), `edition ${y}`).toBe(true);

    const slugs = new Set(events.map((e) => e.data.slug));
    const dangling = globalAzureData.editions
      .filter((e) => e.eventSlug !== undefined && !slugs.has(e.eventSlug))
      .map((e) => `${e.year}: ${e.eventSlug}`);
    expect(dangling).toEqual([]);
  });

  it("14. research events exist and the talk lineups match the research", () => {
    const byExternal = new Map(events.map((e) => [e.data.source.externalId, e.data]));
    for (const id of ["315082158", "313762069", "315504913", "316312251", "316280862"]) {
      expect(byExternal.has(id), `externalId ${id}`).toBe(true);
    }

    const ga = events.find((e) => e.data.slug === "global-azure-france-2026")!.data;
    expect(ga.talks).toHaveLength(5);

    const build = events.find((e) => e.data.slug === "build-2026-localhost-paris-2026-06-10")!.data;
    expect(build.talks).toHaveLength(3);
    expect(build.talks.map((t: any) => t.speakerSlugs[0])).toEqual([
      "marius-zaharia",
      "achraf-ben-alaya",
      "ihor-leontiev",
    ]);
  });
});
