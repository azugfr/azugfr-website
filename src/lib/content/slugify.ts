/**
 * Converts arbitrary text to a stable, URL-safe slug.
 * Handles French accented characters (é→e, ç→c, etc.)
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

/** Generates a slug from an event: prefers explicit slug field, otherwise slugifies title+year */
export function eventSlug(entry: { slug?: string; title: string; startDate: string }): string {
  if (entry.slug) return entry.slug;
  const year = entry.startDate.slice(0, 4);
  return slugify(`${entry.title} ${year}`);
}

/** Generates a slug from a news item: prefers explicit slug, otherwise slugifies title+publishedAt */
export function newsSlug(entry: { slug?: string; title: string; publishedAt: string }): string {
  if (entry.slug) return entry.slug;
  const date = entry.publishedAt.slice(0, 10);
  return slugify(`${entry.title} ${date}`);
}
