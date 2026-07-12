#!/usr/bin/env node
/**
 * Fail closed when EXPO_PUBLIC_ENABLE_BYOK is false/unset and BYOK leaks into the store app.
 * Source scan (Phase 0); extend with bundle/IPA scan per ADR-0001 before GA.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(import.meta.dirname, "../..");
const STORE_ROOT = join(REPO_ROOT, "apps/mobile-store");
const DENYLIST_PATH = join(REPO_ROOT, "tooling/byok-artifact-denylist.txt");

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  "dist",
  ".expo",
  "assets",
]);

const SKIP_FILE_SUFFIXES = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".ttf", ".otf"];

export function loadDenylist(path = DENYLIST_PATH) {
  const raw = readFileSync(path, "utf8");
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

export function listStoreSourceFiles(root = STORE_ROOT) {
  const files = [];
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        if (SKIP_DIR_NAMES.has(name)) continue;
        walk(full);
        continue;
      }
      if (SKIP_FILE_SUFFIXES.some((s) => name.endsWith(s))) continue;
      files.push(full);
    }
  }
  walk(root);
  return files;
}

export function scanStoreForByokLeaks(options = {}) {
  const storeRoot = options.storeRoot ?? STORE_ROOT;
  const denylist = options.denylist ?? loadDenylist(options.denylistPath);
  const files = options.files ?? listStoreSourceFiles(storeRoot);
  const violations = [];

  for (const file of files) {
    const rel = relative(storeRoot, file).replaceAll("\\", "/");
    if (rel.endsWith(".byok.tsx.example")) continue;

    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }

    for (const pattern of denylist) {
      if (text.includes(pattern)) {
        violations.push({ file: rel, pattern });
      }
    }
  }

  const pkgPath = join(storeRoot, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    const depFields = ["dependencies", "optionalDependencies", "devDependencies"];
    for (const field of depFields) {
      const deps = pkg[field];
      if (deps && Object.prototype.hasOwnProperty.call(deps, "@manna/ai-byok")) {
        violations.push({
          file: "package.json",
          pattern: `@manna/ai-byok in ${field}`,
        });
      }
    }
  }

  return violations;
}

export function main() {
  const flag = process.env.EXPO_PUBLIC_ENABLE_BYOK;
  if (flag === "true") {
    console.log("BYOK store leak scan skipped (EXPO_PUBLIC_ENABLE_BYOK=true).");
    return 0;
  }

  const violations = scanStoreForByokLeaks();
  if (violations.length === 0) {
    console.log("BYOK store leak scan: OK (flag off, no denylist matches).");
    return 0;
  }

  console.error("BYOK store leak scan FAILED (EXPO_PUBLIC_ENABLE_BYOK is not true):");
  for (const v of violations) {
    console.error(`  - ${v.file}: matched "${v.pattern}"`);
  }
  return 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exit(main());
}
