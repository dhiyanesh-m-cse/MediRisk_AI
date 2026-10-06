import { describe, expect, it } from "vitest";
import { assertSafeHealthUpload, normalizeHealthFilename } from "./healthMaterialUpload";

describe("health material upload guards", () => {
  it("keeps object-store filenames path safe", () => {
    expect(normalizeHealthFilename("../../CT report (final).pdf")).toBe("CT-report-final.pdf");
  });

  it("accepts a minimal PDF signature and rejects masqueraded files", () => {
    expect(() => assertSafeHealthUpload("application/pdf", Buffer.from("%PDF-1.7"))).not.toThrow();
    expect(() => assertSafeHealthUpload("image/png", Buffer.from("%PDF-1.7"))).toThrow("do not match");
  });

  it("rejects unsupported content types", () => {
    expect(() => assertSafeHealthUpload("application/zip", Buffer.from("PK"))).toThrow("Only PDF");
  });
});
