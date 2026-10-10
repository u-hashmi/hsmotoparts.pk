import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { VARIANT_WIDTHS } from "./image-urls";

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
  if (folder === "images") {
    const id = name.split(".")[0];
    for (const w of VARIANT_WIDTHS) {
      await unlink(path.join(/*turbopackIgnore: true*/ root(), "images", "variants", `${id}-${w}.webp`)).catch(() => {});
    }
  }
}

/** Public URL for a product/blog image stored by name. */
export function imageUrl(name: string) {
  return `/uploads/${name}`;
}

const generating = new Map<string, Promise<Buffer | null>>();

/**
 * Returns a resized WebP copy of an uploaded product/blog image, creating and caching it
 * on first request. `name` looks like `<id>-640.webp`.
 */
export async function readVariant(name: string) {
  const m = /^([a-f0-9]{24})-(\d+)\.webp$/.exec(name);
  if (!m || !(VARIANT_WIDTHS as readonly number[]).includes(Number(m[2]))) return null;
  const [, id, width] = m;
  const dir = path.join(/*turbopackIgnore: true*/ root(), "images", "variants");
  const file = path.join(/*turbopackIgnore: true*/ dir, name);
  try {
    return await readFile(file);
  } catch {}

  let job = generating.get(name);
  if (!job) {
    job = (async () => {
      let original: Buffer | null = null;
      for (const ext of ["jpg", "png", "webp"]) {
        original = (await readUpload("images", `${id}.${ext}`))?.data ?? null;
        if (original) break;
      }
      if (!original) return null;
      const out = await sharp(original).rotate().resize({ width: Number(width), withoutEnlargement: true }).webp({ quality: 72 }).toBuffer();
      await mkdir(dir, { recursive: true });
      const tmp = `${file}.${randomBytes(4).toString("hex")}.tmp`;
      await writeFile(tmp, out);
      await rename(tmp, file);
      return out;
    })().finally(() => generating.delete(name));
    generating.set(name, job);
  }
  return job;
}
