import { describe, expect, it } from "vitest";
import { htmlToText, normalizeExternalId } from "../../scripts/lib/news-text.mjs";

describe("htmlToText", () => {
  it("turns block tags into line breaks and drops other tags", () => {
    expect(htmlToText("<p>Bonjour <b>tous</b></p><p>Suite<br/>ligne</p><ul><li>a</li><li>b</li></ul>")).toBe(
      "Bonjour tous\n\nSuite\nligne\n\na\nb",
    );
  });

  it("decodes entities after stripping tags and collapses blank lines", () => {
    expect(htmlToText("Tom &amp; Jerry &lt;b&gt; l&#39;&#xE9;t&#233;<br><br><br><br>fin ")).toBe(
      "Tom & Jerry <b> l'été\n\nfin",
    );
  });
});

describe("normalizeExternalId", () => {
  it("extracts the activity id from LinkedIn urns and links", () => {
    expect(normalizeExternalId("urn:li:activity:7478476599030521856")).toBe("7478476599030521856");
    expect(normalizeExternalId("https://www.linkedin.com/feed/update/urn:li:activity:123/")).toBe("123");
  });

  it("leaves other ids unchanged", () => {
    expect(normalizeExternalId("7478476599030521856")).toBe("7478476599030521856");
    expect(normalizeExternalId("abc")).toBe("abc");
  });
});
