import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

/** @param {string | Buffer} input */
export function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}

/** @param {string} filePath */
export function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}
