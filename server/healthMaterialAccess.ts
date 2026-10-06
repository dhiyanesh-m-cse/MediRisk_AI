/** Protected owner-scoped file redirect for MediRisk health materials. */
import type { Express, Request, Response } from "express";
import { getHealthMaterialForUser } from "./db";
import { sdk } from "./_core/sdk";
import { storageGetSignedUrl } from "./storage";

export function registerHealthMaterialAccess(app: Express) {
  app.get("/api/health-materials/:id/view", async (req: Request, res: Response) => {
    const materialId = Number(req.params.id);
    if (!Number.isSafeInteger(materialId) || materialId < 1) return res.status(404).json({ error: "Not found" });
    try {
      const user = await sdk.authenticateRequest(req);
      const material = await getHealthMaterialForUser(user.id, materialId);
      if (!material) return res.status(404).json({ error: "Not found" });
      const signedUrl = await storageGetSignedUrl(material.storageKey);
      res.setHeader("Cache-Control", "private, no-store");
      return res.redirect(302, signedUrl);
    } catch (error) {
      console.warn("[HealthMaterialAccess] denied", error instanceof Error ? error.message : "unknown error");
      return res.status(401).json({ error: "Authentication required" });
    }
  });
}
