/**
 * Turn plain text (e.g. a LinkedIn post) into safe HTML: escape it, then wrap
 * http(s) URLs and email addresses in links. Line breaks are kept as text, so
 * render the result in an element with `white-space: pre-line`.
 */

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// A URL runs to the next whitespace; an email is a plain user@domain.tld address.
const TOKEN = /(https?:\/\/[^\s]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})/g;
// Sentence punctuation that follows a URL is not part of it.
const TRAILING = /[.,;:!?\]»"']+$/;
const count = (s: string, ch: string) => s.split(ch).length - 1;

// Drop trailing punctuation, and a closing ")" only while it is unbalanced (so Wikipedia-style URLs keep theirs).
function trimUrl(url: string): string {
  let end = url;
  for (;;) {
    const trail = end.match(TRAILING)?.[0] ?? "";
    if (trail) end = end.slice(0, end.length - trail.length);
    else if (end.endsWith(")") && count(end, ")") > count(end, "(")) end = end.slice(0, -1);
    else return end;
  }
}

export function linkify(text: string, linkClass = "link"): string {
  let html = "";
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    let token = match[0];
    let rest = "";
    if (match[1]) {
      const trimmed = trimUrl(token);
      rest = token.slice(trimmed.length);
      token = trimmed;
    }
    html += escapeHtml(text.slice(last, start));
    const label = escapeHtml(token);
    html += match[1]
      ? `<a href="${label}" class="${linkClass}" target="_blank" rel="noopener noreferrer">${label}</a>`
      : `<a href="mailto:${label}" class="${linkClass}">${label}</a>`;
    html += escapeHtml(rest);
    last = start + match[0].length;
  }
  return html + escapeHtml(text.slice(last));
}
