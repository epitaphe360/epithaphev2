// ========================================
// Script de Seed - Importer les pages publiques
// ========================================

import "dotenv/config";
import { db } from "../server/db";
import { pages } from "../shared/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const seedPages = async () => {
  try {
    console.log("🌱 Démarrage du seed des pages publiques...");

    const pagesData = [
      {
        title: "Accueil",
        slug: "home",
        content: "<h1>Bienvenue sur Epitaphe</h1><p>Votre solution complète de gestion de contenu</p>",
        status: "PUBLISHED",
        show_in_menu: true,
        order: 1,
      },
      {
        title: "Blog",
        slug: "blog",
        content: "<h1>Blog</h1><p>Découvrez nos derniers articles et actualités</p>",
        status: "PUBLISHED",
        show_in_menu: true,
        order: 2,
      },
      {
        title: "Nos Réalisations",
        slug: "nos-references",
        content: "<h1>Nos Réalisations</h1><p>Découvrez les projets que nous avons menés avec succès</p>",
        status: "PUBLISHED",
        show_in_menu: true,
        order: 3,
      },
      {
        title: "Services",
        slug: "services",
        content: "<h1>Nos Services</h1><p>Une gamme complète de services pour votre succès</p>",
        status: "PUBLISHED",
        show_in_menu: true,
        order: 4,
      },
      {
        title: "À Propos",
        slug: "about",
        content: "<h1>À Propos de Nous</h1><p>Découvrez notre histoire et nos valeurs</p>",
        status: "PUBLISHED",
        show_in_menu: true,
        order: 5,
      },
      {
        title: "Contact",
        slug: "contact",
        content: "<h1>Nous Contacter</h1><p>Envoyez-nous vos demandes et questions</p>",
        status: "PUBLISHED",
        show_in_menu: true,
        order: 6,
      },
    ];

    for (const pageData of pagesData) {
      try {
        // Vérifier si la page existe déjà
        const existing = await db.select().from(pages).where(
          eq(pages.slug, pageData.slug)
        ).limit(1);

        if (existing.length === 0) {
          await db.insert(pages).values({
            id: randomUUID(),
            ...pageData,
            created_at: new Date(),
            updated_at: new Date(),
          });
          console.log(`✅ Page créée: ${pageData.title}`);
        } else {
          console.log(`⏭️  Page existe déjà: ${pageData.title}`);
        }
      } catch (err) {
        console.error(`❌ Erreur pour ${pageData.title}:`, err);
      }
    }

    console.log("✨ Seed complété!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
};

seedPages();
