import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import {
  loadDenylist,
  scanStoreForByokLeaks,
} from "./scan-store-byok-leak.mjs";

test("denylist loads patterns", () => {
  const patterns = loadDenylist();
  assert.ok(patterns.includes("@manna/ai-byok"));
  assert.ok(patterns.includes("openrouter.ai"));
});

test("clean stub store passes flag-off scan", () => {
  const violations = scanStoreForByokLeaks();
  assert.deepEqual(violations, []);
});

test("detects OpenRouter leak in store source", () => {
  const root = mkdtempSync(join(tmpdir(), "manna-byok-scan-"));
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({ name: "mobile-store", dependencies: {} }),
  );
  mkdirSync(join(root, "app"), { recursive: true });
  writeFileSync(
    join(root, "app", "leak.tsx"),
    'const u = "https://openrouter.ai/api/v1";\n',
  );

  const violations = scanStoreForByokLeaks({
    storeRoot: root,
    files: [join(root, "app", "leak.tsx"), join(root, "package.json")],
  });
  assert.ok(violations.some((v) => v.pattern === "openrouter.ai"));
});

test("detects @manna/ai-byok dependency in package.json", () => {
  const root = mkdtempSync(join(tmpdir(), "manna-byok-dep-"));
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({
      name: "mobile-store",
      dependencies: { "@manna/ai-byok": "workspace:*" },
    }),
  );

  const violations = scanStoreForByokLeaks({
    storeRoot: root,
    files: [join(root, "package.json")],
  });
  assert.ok(
    violations.some((v) => v.pattern.includes("@manna/ai-byok in dependencies")),
  );
});
