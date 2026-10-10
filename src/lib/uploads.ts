import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export type UploadFolder = "images" | "proofs";

const MAX_BYTES = 6 * 1024 * 1024;

const TYPES: Record<string, { ext: string; magic: (b: Buffer) => boolean }> = {
  "image/jpeg": { ext: "jpg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 },
  "image/png": { ext: "png", magic: (b) => b.subarray(0, 4).toString("hex") === "89504e47" },
  "image/webp": { ext: "webp", magic: (b) => b.subarray(8, 12).toString() === "WEBP" },
};

export const CONTENT_TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

function root() {
  return path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR || "./uploads");
}

export class UploadError extends Error {}

/** Validates and stores an uploaded image, returning its generated file name. */
export async function saveUpload(file: File, folder: UploadFolder) {
  const type = TYPES[file.type];
  if (!type) throw new UploadError("Only JPG, PNG or WEBP images are allowed.");
  if (file.size > MAX_BYTES) throw new UploadError("Images must be under 6 MB.");
  const buf = Buffer.from(await file.arrayBuffer());
  if (!type.magic(buf)) throw new UploadError("That file doesn't look like a valid image.");
  const name = `${randomBytes(12).toString("hex")}.${type.ext}`;
  const dir = path.join(/*turbopackIgnore: true*/ root(), folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(/*turbopackIgnore: true*/ dir, name), buf);
  return name;
}

/** Reads a stored upload; returns null for unknown or unsafe names. */
export async function readUpload(folder: UploadFolder, name: string) {
  if (!/^[a-f0-9]{24}\.(jpg|png|webp)$/.test(name)) return null;
  try {
    const data = await readFile(path.join(/*turbopackIgnore: true*/ root(), folder, name));
    return { data, contentType: CONTENT_TYPES[name.split(".").pop()!] };
  } catch {
    return null;
  }
}

export async function deleteUpload(folder: UploadFolder, name: string) {
  if (!/^[a-f0-9]{24}\.(jpg|png|webp)$/.test(name)) return;
  await unlink(path.join(/*turbopackIgnore: true*/ root(), folder, name)).catch(() => {});
}

/** Public URL for a product/blog image stored by name. */
export function imageUrl(name: string) {
  return `/uploads/${name}`;
}
