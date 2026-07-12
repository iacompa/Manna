export const RECOMMENDATION_ALGORITHM_VERSION = "daily-v1" as const;

export type ReviewedDailyCandidate = {
  passageId: string;
  editorialThemes: string[];
  bookId: string;
};

export type DailyPickInput = {
  installationId: string;
  /** ISO date YYYY-MM-DD in the user's local calendar */
  localDate: string;
  corpusVersion: string;
  algorithmVersion?: string;
  candidates: ReviewedDailyCandidate[];
  selectedThemes?: string[];
  excludedPassageIds?: string[];
};

export type DailyPickReason =
  | "editorial_rotation"
  | "theme_match"
  | "deterministic_seed";

export type DailyPickResult = {
  passageId: string;
  reason: DailyPickReason;
  algorithmVersion: string;
};

function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function seedKey(input: DailyPickInput): string {
  const algo = input.algorithmVersion ?? RECOMMENDATION_ALGORITHM_VERSION;
  return [input.installationId, input.localDate, input.corpusVersion, algo].join("|");
}

function filterPool(input: DailyPickInput): ReviewedDailyCandidate[] {
  const excluded = new Set(input.excludedPassageIds ?? []);
  let pool = input.candidates.filter((c) => !excluded.has(c.passageId));
  if (pool.length === 0) {
    pool = [...input.candidates];
  }

  const themes = input.selectedThemes?.filter(Boolean) ?? [];
  if (themes.length === 0) {
    return pool;
  }

  const themeSet = new Set(themes.map((t) => t.toLowerCase()));
  const themed = pool.filter((c) =>
    c.editorialThemes.some((t) => themeSet.has(t.toLowerCase())),
  );
  return themed.length > 0 ? themed : pool;
}

function pickDeterministic(pool: ReviewedDailyCandidate[], key: string): ReviewedDailyCandidate {
  const sorted = [...pool].sort((a, b) => a.passageId.localeCompare(b.passageId));
  const index = fnv1a(key) % sorted.length;
  return sorted[index]!;
}

export function pickDailyPassage(input: DailyPickInput): DailyPickResult | null {
  if (input.candidates.length === 0) {
    return null;
  }

  const algorithmVersion = input.algorithmVersion ?? RECOMMENDATION_ALGORITHM_VERSION;
  const key = seedKey({ ...input, algorithmVersion });
  const pool = filterPool(input);
  const chosen = pickDeterministic(pool, key);

  const themes = input.selectedThemes?.filter(Boolean) ?? [];
  let reason: DailyPickReason = "editorial_rotation";
  if (themes.length > 0) {
    const themeSet = new Set(themes.map((t) => t.toLowerCase()));
    const themed = pool.filter((c) =>
      c.editorialThemes.some((t) => themeSet.has(t.toLowerCase())),
    );
    reason = themed.length > 0 ? "theme_match" : "editorial_rotation";
  } else {
    reason = "deterministic_seed";
  }

  return {
    passageId: chosen.passageId,
    reason,
    algorithmVersion,
  };
}
