import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", () => ({
  getPatientProfile: vi.fn(),
  createOrUpdatePatientProfile: vi.fn(),
  listPatientAssessments: vi.fn(),
  createPatientAssessment: vi.fn(),
  listHealthMaterials: vi.fn(),
  createHealthMaterial: vi.fn(),
  deleteHealthMaterial: vi.fn(),
}));

vi.mock("./storage", () => ({ storagePut: vi.fn() }));

import { appRouter } from "./routers";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(userId = 27): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    name: "Test Patient",
    email: "test@example.com",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

const material = {
  id: 81, userId: 27, title: "Cardiology report", category: "scan_report" as const, originalFilename: "report.pdf",
  storageKey: "users/27/materials/private-report.pdf", storageUrl: "", mimeType: "application/pdf", sizeBytes: 1200,
  materialDate: null, notes: null, createdAt: new Date(), updatedAt: new Date(),
};

describe("account-owned MediRisk procedures", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns explicit null for a newly signed-in patient without a profile", async () => {
    vi.mocked(db.getPatientProfile).mockResolvedValue(undefined);
    await expect(appRouter.createCaller(createContext()).profile.mine()).resolves.toBeNull();
    expect(db.getPatientProfile).toHaveBeenCalledWith(27);
  });

  it("projects health materials without a storage key or direct storage URL", async () => {
    vi.mocked(db.listHealthMaterials).mockResolvedValue([material]);
    const results = await appRouter.createCaller(createContext()).healthMaterials.list();
    expect(db.listHealthMaterials).toHaveBeenCalledWith(27);
    expect(results).toEqual([expect.objectContaining({ id: 81, viewUrl: "/api/health-materials/81/view" })]);
    expect(results[0]).not.toHaveProperty("storageKey");
    expect(results[0]).not.toHaveProperty("storageUrl");
  });

  it("deletes a health material only through the current user scope", async () => {
    vi.mocked(db.deleteHealthMaterial).mockResolvedValue(true);
    await expect(appRouter.createCaller(createContext(27)).healthMaterials.remove({ id: 81 })).resolves.toEqual({ success: true });
    expect(db.deleteHealthMaterial).toHaveBeenCalledWith(27, 81);
  });

  it("queries assessments using the current user scope", async () => {
    vi.mocked(db.listPatientAssessments).mockResolvedValue([]);
    await expect(appRouter.createCaller(createContext(27)).assessments.list()).resolves.toEqual([]);
    expect(db.listPatientAssessments).toHaveBeenCalledWith(27);
  });
});
