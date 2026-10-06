import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createHealthMaterial, createOrUpdatePatientProfile, createPatientAssessment, deleteHealthMaterial, getPatientProfile, listHealthMaterials, listPatientAssessments } from "./db";
import { assertSafeHealthUpload, normalizeHealthFilename } from "./healthMaterialUpload";
import { storagePut } from "./storage";

const materialCategory = z.enum(["report", "medical_history", "patient_image"]);
const assessmentInput = z.object({
  patientName: z.string().trim().min(1).max(100),
  riskScore: z.number().int().min(0).max(100),
  riskLevel: z.string().trim().min(1).max(24),
  heartRate: z.number().int().min(1).max(300),
  systolicBP: z.number().int().min(40).max(300),
  diastolicBP: z.number().int().min(20).max(220),
  oxygenSaturation: z.number().int().min(0).max(100),
  temperature: z.number().min(25).max(45),
  assessmentPayload: z.string().min(2).max(50_000),
});

function toHealthMaterialListItem(material: Awaited<ReturnType<typeof listHealthMaterials>>[number]) {
  const { storageKey: _storageKey, storageUrl: _storageUrl, ...safeMaterial } = material;
  return { ...safeMaterial, viewUrl: `/api/health-materials/${material.id}/view` };
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  profile: router({
    mine: protectedProcedure.query(async ({ ctx }) => (await getPatientProfile(ctx.user.id)) ?? null),
    save: protectedProcedure.input(z.object({ displayName: z.string().trim().min(2).max(100) })).mutation(({ ctx, input }) => createOrUpdatePatientProfile(ctx.user.id, input.displayName)),
  }),
  assessments: router({
    list: protectedProcedure.query(({ ctx }) => listPatientAssessments(ctx.user.id)),
    create: protectedProcedure.input(assessmentInput).mutation(({ ctx, input }) => createPatientAssessment(ctx.user.id, { ...input, temperature: input.temperature.toFixed(1) })),
  }),
  healthMaterials: router({
    list: protectedProcedure.query(async ({ ctx }) => (await listHealthMaterials(ctx.user.id)).map(toHealthMaterialListItem)),
    upload: protectedProcedure.input(z.object({
      category: materialCategory,
      title: z.string().trim().min(2).max(160),
      originalFilename: z.string().trim().min(1).max(255),
      mimeType: z.enum(["application/pdf", "image/jpeg", "image/png", "image/webp"]),
      notes: z.string().trim().max(1000).optional(),
      materialDate: z.date().optional(),
      base64Data: z.string().min(4).max(5_600_000),
    })).mutation(async ({ ctx, input }) => {
      const bytes = Buffer.from(input.base64Data, "base64");
      assertSafeHealthUpload(input.mimeType, bytes);
      const safeName = normalizeHealthFilename(input.originalFilename);
      const { key } = await storagePut(`patient-health/${ctx.user.id}/${safeName}`, bytes, input.mimeType);
      const created = await createHealthMaterial(ctx.user.id, {
        category: input.category,
        title: input.title,
        originalFilename: input.originalFilename,
        mimeType: input.mimeType,
        sizeBytes: bytes.length,
        storageKey: key,
        storageUrl: "",
        notes: input.notes || null,
        materialDate: input.materialDate ?? null,
      });
      return toHealthMaterialListItem(created);
    }),
    remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const removed = await deleteHealthMaterial(ctx.user.id, input.id);
      if (!removed) throw new TRPCError({ code: "NOT_FOUND", message: "Health material not found." });
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
