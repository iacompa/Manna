import assert from "node:assert/strict";
import { test } from "node:test";
import { pickDailyPassage } from "./daily-pick";

const candidates = [
  { passageId: "p-a", editorialThemes: ["peace"], bookId: "PSA" },
  { passageId: "p-b", editorialThemes: ["wisdom"], bookId: "PRO" },
  { passageId: "p-c", editorialThemes: ["peace"], bookId: "MAT" },
  { passageId: "p-d", editorialThemes: ["hope"], bookId: "ROM" },
  { passageId: "p-e", editorialThemes: ["comfort"], bookId: "ISA" },
];

test("pickDailyPassage is stable for same seed inputs", () => {
  const input = {
    installationId: "install-123",
    localDate: "2026-07-12",
    corpusVersion: "corpus-1",
    candidates,
  };
  const a = pickDailyPassage(input);
  const b = pickDailyPassage(input);
  assert.deepEqual(a, b);
});

test("pickDailyPassage varies across a week of dates", () => {
  const base = {
    installationId: "install-123",
    corpusVersion: "corpus-1",
    candidates,
  };
  const picks = new Set<string>();
  for (let day = 12; day <= 18; day += 1) {
    const pick = pickDailyPassage({ ...base, localDate: `2026-07-${day}` });
    picks.add(pick?.passageId ?? "");
  }
  assert.ok(picks.size > 1);
});
