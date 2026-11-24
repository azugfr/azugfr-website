import { describe, expect, it } from "vitest";
import { en } from "../../src/data/i18n/en";
import { fr } from "../../src/data/i18n/fr";

type Dict = Record<string, unknown>;

/** Flattens a nested dictionary to dotted key -> value. */
function flatten(obj: Dict, prefix = ""): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v) && typeof v !== "function") {
      Object.assign(out, flatten(v as Dict, key));
    } else {
      out[key] = v;
    }
  }
  return out;
}

const frFlat = flatten(fr as unknown as Dict);
const enFlat = flatten(en as unknown as Dict);

describe("i18n dictionaries", () => {
  it("fr and en have identical deep key sets", () => {
    expect(Object.keys(enFlat).sort()).toEqual(Object.keys(frFlat).sort());
  });

  it("function-valued keys are functions in both locales", () => {
    const fnKeys = Object.keys(frFlat).filter((k) => typeof frFlat[k] === "function");
    expect(fnKeys.length).toBeGreaterThan(0);
    for (const k of fnKeys) {
      expect(typeof enFlat[k], k).toBe("function");
    }
  });

  it("function-valued keys return non-empty strings for n = 1 and n = 2", () => {
    for (const dict of [frFlat, enFlat]) {
      for (const [k, v] of Object.entries(dict)) {
        if (typeof v !== "function") continue;
        for (const n of [1, 2]) {
          const out = (v as (n: number) => unknown)(n);
          expect(typeof out, `${k}(${n})`).toBe("string");
          expect((out as string).trim().length, `${k}(${n})`).toBeGreaterThan(0);
        }
      }
    }
  });
});
