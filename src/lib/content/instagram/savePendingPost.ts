import fs from "node:fs/promises";
import path from "node:path";
import type { CraftlinkInstagramConcept, PendingPostArtifacts } from "./types";

const PENDING_DIR = path.join(process.cwd(), "public", "pending_posts");

function buildStamp(date = new Date()): string {
  // Ex. 20260718-233045
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

/**
 * Écrit le PNG + la caption dans `/public/pending_posts/`.
 */
export async function savePendingPost(
  concept: CraftlinkInstagramConcept,
  imageBuffer: Buffer,
): Promise<PendingPostArtifacts> {
  await fs.mkdir(PENDING_DIR, { recursive: true });

  const stamp = buildStamp();
  const imagePath = path.join(PENDING_DIR, `post-${stamp}.png`);
  const captionPath = path.join(PENDING_DIR, `post-${stamp}-caption.txt`);
  const metaPath = path.join(PENDING_DIR, `post-${stamp}-meta.json`);

  await fs.writeFile(imagePath, imageBuffer);
  await fs.writeFile(captionPath, `${concept.caption_insta}\n`, "utf8");
  await fs.writeFile(
    metaPath,
    `${JSON.stringify(concept, null, 2)}\n`,
    "utf8",
  );

  return { stamp, imagePath, captionPath, concept };
}
