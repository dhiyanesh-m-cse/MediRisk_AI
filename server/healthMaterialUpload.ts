/**
 * MediRisk release safety boundary: uploaded reports and images are treated as
 * private user records. The server validates type, byte size, and a small file
 * signature before creating an object-store reference.
 */
import { TRPCError } from "@trpc/server";

export const ALLOWED_HEALTH_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type HealthMimeType = (typeof ALLOWED_HEALTH_MIME_TYPES)[number];
export const MAX_HEALTH_FILE_BYTES = 4 * 1024 * 1024;

export function normalizeHealthFilename(filename: string) {
  const normalized = filename
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/-+\./g, ".")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 120);
  return normalized || "health-material";
}

function startsWithBytes(buffer: Buffer, signature: number[]) {
  return signature.every((byte, index) => buffer[index] === byte);
}

export function assertSafeHealthUpload(mimeType: string, bytes: Buffer) {
  if (!ALLOWED_HEALTH_MIME_TYPES.includes(mimeType as HealthMimeType)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Only PDF, JPG, PNG, and WEBP health materials are accepted." });
  }
  if (bytes.length === 0 || bytes.length > MAX_HEALTH_FILE_BYTES) {
    throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Each health material must be between 1 byte and 4 MB." });
  }

  const validSignature =
    (mimeType === "application/pdf" && bytes.subarray(0, 5).toString("utf8") === "%PDF-") ||
    (mimeType === "image/jpeg" && startsWithBytes(bytes, [0xff, 0xd8, 0xff])) ||
    (mimeType === "image/png" && startsWithBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) ||
    (mimeType === "image/webp" && bytes.subarray(0, 4).toString("utf8") === "RIFF" && bytes.subarray(8, 12).toString("utf8") === "WEBP");

  if (!validSignature) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "The uploaded bytes do not match the selected file type." });
  }
}
