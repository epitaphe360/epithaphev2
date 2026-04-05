import { Express } from "express";
import { db } from "./db";
import { users, scoringResults, clientAccounts, clientProjects } from "../shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { generateToken } from "./lib/auth";

export function registerDevRoutes(app: Express) {
  // Guard: routes dev désactivées sauf si ENABLE_DEV_ROUTES=true
  if (!process.env.ENABLE_DEV_ROUTES) return;

  app.get("/api/dev/seed", async (req, res) => {
    try {
      // 1. Ajouter un Admin
      const adminHash = await bcrypt.hash("Admin123!Test", 10);
      await db.insert(users).values({
        email: "admin@epitaphe360.test",
        password: adminHash,
        name: "Administrateur Test",
        role: "ADMIN",
      }).onConflictDoNothing({ target: users.email });

      // 2. Ajouter un Client Test
      const clientHash = await bcrypt.hash("Client123!Test", 10);
      await db.insert(users).values({
        email: "client@entreprise.test",
        password: clientHash,
        name: "Client Test B2B",
        role: "USER",
      }).onConflictDoNothing({ target: users.email });

      // 3. Ajouter des donn�es de Scoring (Leads & Rapports)
      await db.insert(scoringResults).values([
        {
          toolId: "commpulse",
          companyName: "Tech Solutions Mar",
          sector: "Technologie",
          companySize: "50-200",
          globalScore: 65,
          pillarScores: { general: 65, equipe: 70, feedback: 60 },
          maturityLevel: 3,
          sessionId: "test-session-1"
        },
        {
          toolId: "bmi360",
          companyName: "Finance Plus Agency",
          sector: "Finance",
          companySize: "200-500",
          globalScore: 82,
          pillarScores: { identite: 80, strategie: 85 },
          maturityLevel: 4,
          sessionId: "test-session-2"
        },
        {
          toolId: "talentprint",
          companyName: "Startup Innov.io",
          sector: "Startup",
          companySize: "1-50",
          globalScore: 45,
          pillarScores: { rh: 40, onboarding: 50 },
          maturityLevel: 2,
          sessionId: "test-session-3"
        }
      ]);

      res.json({ message: "Base de donnees peuplee avec succes ! Les utilisateurs tests et donnees d'audit sont prets." });
    } catch (error: any) {
      console.error("Erreur lors du peuplement :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });

  // Seed un compte client test pour l'espace client
  app.get("/api/dev/seed-test-client", async (req, res) => {
    try {
      const passwordHash = await bcrypt.hash("client123", 10);
      await db.insert(clientAccounts).values({
        email: "client@test.com",
        passwordHash,
        name: "Client Test",
        company: "Entreprise Demo",
        isActive: true,
      }).onConflictDoNothing({ target: clientAccounts.email });

      // Récupérer l'id du client
      const [client] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, "client@test.com")).limit(1);
      if (client) {
        await db.insert(clientProjects).values({
          clientId: client.id,
          title: "Projet Démo - Site Vitrine",
          type: "Site Web",
          status: "en_cours",
          progress: 45,
          description: "Création d'un site vitrine moderne pour Entreprise Demo.",
        }).onConflictDoNothing();
      }

      res.json({ message: "Compte client test créé : client@test.com / client123" });
    } catch (error: any) {
      console.error("Erreur seed client:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });

  // ─── Auto-login client test ─────────────────────────────────────────────
  app.post("/api/dev/auto-login-client", async (_req, res) => {
    try {
      const passwordHash = await bcrypt.hash("client123", 10);
      await db.insert(clientAccounts).values({
        email: "client@test.com",
        passwordHash,
        name: "Client Test",
        company: "Entreprise Demo",
        isActive: true,
      }).onConflictDoNothing({ target: clientAccounts.email });

      const [account] = await db.select().from(clientAccounts)
        .where(eq(clientAccounts.email, "client@test.com")).limit(1);

      if (!account) return res.status(500).json({ error: "Impossible de créer le compte test" });

      // Seed un projet demo si aucun n'existe
      const existing = await db.select().from(clientProjects)
        .where(eq(clientProjects.clientId, account.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(clientProjects).values({
          clientId: account.id,
          title: "Projet Démo - Site Vitrine",
          type: "Site Web",
          status: "en_cours",
          progress: 45,
          description: "Création d'un site vitrine moderne pour Entreprise Demo.",
        });
      }

      const CLIENT_JWT_SECRET = process.env.JWT_SECRET;
      if (!CLIENT_JWT_SECRET) {
        return res.status(500).json({ error: "JWT_SECRET non configuré" });
      }
      const token = jwt.sign(
        { clientId: account.id, email: account.email },
        CLIENT_JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.json({
        token,
        client: { id: account.id, name: account.name, company: account.company, email: account.email },
      });
    } catch (error: any) {
      console.error("Auto-login client error:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });

  // ─── Auto-login admin test ──────────────────────────────────────────────
  app.post("/api/dev/auto-login-admin", async (_req, res) => {
    try {
      const hashedPw = await bcrypt.hash("Admin123!", 10);
      await db.insert(users).values({
        email: "admin@epitaphe360.test",
        password: hashedPw,
        name: "Administrateur Test",
        role: "ADMIN",
      }).onConflictDoNothing({ target: users.email });

      const [user] = await db.select().from(users)
        .where(eq(users.email, "admin@epitaphe360.test")).limit(1);

      if (!user) return res.status(500).json({ error: "Impossible de créer l'admin test" });

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const { password: _, ...userData } = user;
      res.json({ token, user: userData });
    } catch (error: any) {
      console.error("Auto-login admin error:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });
}
