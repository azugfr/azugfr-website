/**
 * Pure helpers for scripts/sync-linkedin-news.mjs (kept free of side effects so they can be unit-tested).
 */

const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  laquo: "«",
  raquo: "»",
  hellip: "…",
  rsquo: "’",
  lsquo: "‘",
  ndash: "–",
  mdash: "—",
};

export function decodeEntities(text) {
  return (text || "").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, body) => {
    if (body[0] === "#") {
      const code = body[1].toLowerCase() === "x" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      try {
        return String.fromCodePoint(code);
      } catch {
        return whole;
      }
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? whole;
  });
}

/** Single-line plain text (used for summaries). */
export function stripHtml(html) {
  return decodeEntities((html || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

/** Multi-line plain text: block-level tags become line breaks, other tags are dropped, entities decoded. */
export function htmlToText(html) {
  const text = (html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|h[1-6]|ul|ol|blockquote)\s*>/gi, "\n\n")
    .replace(/<\/li\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  return decodeEntities(text)
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t ]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** `urn:li:activity:123` (anywhere in a guid or link) maps to `123`; other ids are returned unchanged. */
export function normalizeExternalId(id) {
  const raw = (id || "").trim();
  return raw.match(/urn:li:activity:(\d+)/)?.[1] ?? raw;
}
