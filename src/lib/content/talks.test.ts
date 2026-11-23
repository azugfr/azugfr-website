import { describe, expect, it } from "vitest";
import type { TalkEntry } from "../../content/schemas";
import { resolveTalk } from "./talks";

const talk: TalkEntry = {
  title: "Le challenge du ROI de l’IA",
  speakerSlugs: ["jean-luc-boucho"],
  translations: { en: { title: "The AI ROI challenge" } },
};

describe("resolveTalk", () => {
  it("returns the EN title for an en reader when the translation exists", () => {
    expect(resolveTalk(talk, "fr", "en").title).toBe("The AI ROI challenge");
  });

  it("falls back to the canonical title when there is no translation", () => {
    const noEn: TalkEntry = { title: "Titre seul", speakerSlugs: [] };
    expect(resolveTalk(noEn, "fr", "en").title).toBe("Titre seul");
  });

  it("is unchanged for the canonical locale", () => {
    expect(resolveTalk(talk, "fr", "fr")).toEqual(talk);
  });
});
