import path from "path";
import { mkdir, readFile, writeFile } from "fs/promises";

const DEFAULT_UPLOADS_DIR = ".data/uploads";

const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function getUploadsRoot() {
  return path.join(process.cwd(), process.env.LOCAL_UPLOADS_DIR || DEFAULT_UPLOADS_DIR);
}

export function inferMimeType(filePath: string) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

export async function saveUploadedFile(
  bucket: "provider-documents" | "provider-content" | "avatars" | "listing-images",
  file: File,
  prefix: string
) {
  const originalName = sanitizeSegment(file.name || "upload");
  const extension = path.extname(originalName) || ".bin";
  const baseName = path.basename(originalName, extension) || "upload";
  const fileName = `${Date.now()}-${baseName}${extension}`;
  const relativePath = path.join(bucket, sanitizeSegment(prefix), fileName);
  const absolutePath = path.join(getUploadsRoot(), relativePath);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, bytes);

  return {
    fileName: file.name || fileName,
    storedFileName: fileName,
    relativePath: relativePath.split(path.sep).join("/"),
    fileUrl: `/api/uploads/${relativePath.split(path.sep).join("/")}`,
    contentType: file.type || inferMimeType(absolutePath),
    size: bytes.length,
  };
}

export async function readStoredUpload(relativePath: string) {
  const normalizedPath = relativePath
    .split("/")
    .map((segment) => sanitizeSegment(segment))
    .join(path.sep);
  const absolutePath = path.join(getUploadsRoot(), normalizedPath);
  return {
    absolutePath,
    data: await readFile(absolutePath),
  };
}
