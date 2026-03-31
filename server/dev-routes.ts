import { Express } from "express";
import { db } from "./db";
import { users, scoringResults, clientAccounts, clientProjects } from "../shared/schema";
import bcrypt from "bcrypt";

export function registerDevRoutes(app: Express) {
  // Guard: dev routes only in non-production
  if (process.env.NODE_ENV === "production") return;

  app.get("/api/dev/seed", async (req, res) => {
    try {
      // 1. Ajouter un Admin
      await db.insert(users).values({
        email: "admin@epitaphe360.test",
        password: "admin123", // Attention: En prod ce doit �tre hash�
        name: "Administrateur Test",
        role: "ADMIN",
      }).onConflictDoNothing({ target: users.email });

      // 2. Ajouter un Client Test
      await db.insert(users).values({
        email: "client@entreprise.test",
        password: "client123", 
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
      const { eq } = await import("drizzle-orm");
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
}
