import { describe, expect, it } from "vitest";
import { linkify } from "./linkify";

describe("linkify", () => {
  it("wraps URLs in external links and keeps the surrounding text", () => {
    expect(linkify("Inscription : https://www.meetup.com/azug-fr/events/317553267/")).toBe(
      'Inscription : <a href="https://www.meetup.com/azug-fr/events/317553267/" class="link" target="_blank" rel="noopener noreferrer">https://www.meetup.com/azug-fr/events/317553267/</a>',
    );
  });

  it("leaves sentence punctuation after a URL outside the link", () => {
    expect(linkify("Voir https://luma.com/7n9bgsow.")).toBe(
      'Voir <a href="https://luma.com/7n9bgsow" class="link" target="_blank" rel="noopener noreferrer">https://luma.com/7n9bgsow</a>.',
    );
  });

  it("keeps a closing parenthesis that balances one in the URL", () => {
    const url = "https://fr.wikipedia.org/wiki/Azure_(Microsoft)";
    expect(linkify(`Voir ${url}.`)).toBe(
      `Voir <a href="${url}" class="link" target="_blank" rel="noopener noreferrer">${url}</a>.`,
    );
  });

  it("drops an unbalanced closing parenthesis after a URL", () => {
    expect(linkify("(voir https://x.fr/a)")).toBe(
      '(voir <a href="https://x.fr/a" class="link" target="_blank" rel="noopener noreferrer">https://x.fr/a</a>)',
    );
  });

  it("keeps query strings in URLs", () => {
    const url = "https://docs.google.com/forms/d/e/abc/viewform?usp=sf_link&x=1";
    expect(linkify(url)).toContain('href="https://docs.google.com/forms/d/e/abc/viewform?usp=sf_link&amp;x=1"');
  });

  it("turns email addresses into mailto links", () => {
    expect(linkify("Écrivez à paris@azug.fr !")).toBe('Écrivez à <a href="mailto:paris@azug.fr" class="link">paris@azug.fr</a> !');
  });

  it("escapes HTML in the text", () => {
    expect(linkify("a <b>bold</b> & co\nnext line")).toBe("a &lt;b&gt;bold&lt;/b&gt; &amp; co\nnext line");
  });
});
