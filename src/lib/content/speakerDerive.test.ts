import { describe, expect, it } from "vitest";
import { getEventSpeakerSlugs } from "./speakerDerive";

describe("getEventSpeakerSlugs", () => {
  it("returns the unique union of event and talk speakers in first-seen order", () => {
    expect(getEventSpeakerSlugs({ speakerSlugs: ["a", "b"], talks: [{ speakerSlugs: ["b", "c"] }] } as never)).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("handles undefined speakerSlugs and talks", () => {
    expect(getEventSpeakerSlugs({})).toEqual([]);
    expect(getEventSpeakerSlugs({ speakerSlugs: ["x"] })).toEqual(["x"]);
    expect(getEventSpeakerSlugs({ talks: [{ speakerSlugs: ["y"] }] } as never)).toEqual(["y"]);
  });
});
