import test from "node:test";
import assert from "node:assert/strict";
import { validateScriptureDb } from "./validate-scripture-db.mjs";

test("shipping scripture.db passes sanity checks", () => {
  const result = validateScriptureDb();
  assert.equal(result.ok, true);
});
