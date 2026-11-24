import { describe, expect, it } from "vitest";
import { initials } from "./initials";

describe("initials", () => {
  it.each([
    ["Jean-Luc Boucho", "JB"],
    ["Ihor Leontiev", "IL"],
    ["Joannès Vermorel", "JV"],
    ["Cher", "CH"],
    ["  Achraf  Ben Alaya ", "AA"],
  ])("%j -> %j", (input, expected) => {
    expect(initials(input)).toBe(expected);
  });
});
