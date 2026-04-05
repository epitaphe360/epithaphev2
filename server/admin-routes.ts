import type { Express } from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "./db";
import crypto from "crypto";
import {
  users, articles, events, pages, categories, media, navigationMenus, settings, auditLogs,
  services, clientReferences, caseStudies, testimonials, teamMembers,
  projectBriefs, newsletterSubscriptions, contactMessages, resources,
  passwordResetTokens, qrCodes,
  clientAccounts, clientProjects, clientMilestones, clientDocuments,
  clientMessages as clientMessagesTable, scoringResults,
  insertArticleSchema, insertEventSchema, insertPageSchema,
  insertServiceSchema, insertClientReferenceSchema, insertCaseStudySchema,
  insertTestimonialSchema, insertTeamMemberSchema, insertResourceSchema,
  insertClientProjectSchema, insertClientMilestoneSchema, insertClientDocumentSchema,
} from "@shared/schema";
import { eq, desc, and, or, like, sql } from "drizzle-orm";
import { requireAuth, requireAdmin, generateToken, hashPassword, verifyPassword, validatePassword, type AuthRequest } from "./lib/auth";
import { sendAdminPasswordReset, sendAgencyMessageNotification } from "./lib/email";
import { z } from "zod";

// ── Multer — stockage local des médias uploadés ───────────────────────────────
const UPLOAD_DIR = path.resolve(process.cwd(), "dist", "public", "uploads");

// S'assurer que le répertoire existe au démarrage
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

const ALLOWED_MIME = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
  "image/avif", "application/pdf",
  "video/mp4", "video/webm",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 Mo max
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Type de fichier non autorisé : ${file.mimetype}`));
    }
  },
});

/**
 * Sanitize a search string for use in SQL LIKE patterns
 * Escapes special SQL LIKE characters: %, _, \
 */
function sanitizeLikePattern(input: string): string {
  if (!input) return '';
  return input.replace(/[%_\\]/g, '\\$&');
}

/**
 * Safely parse and validate pagination parameters
 * Returns validated limit and offset values
 */
function validatePagination(limit: string | undefined, offset: string | undefined): { limit: number; offset: number } | { error: string } {
  const limitNum = limit ? parseInt(limit, 10) : 50;
  const offsetNum = offset ? parseInt(offset, 10) : 0;

  if (isNaN(limitNum) || limitNum < 0 || limitNum > 1000) {
    return { error: 'Invalid limit parameter. Must be a number between 0 and 1000.' };
  }

  if (isNaN(offsetNum) || offsetNum < 0 || offsetNum > 100000) {
    return { error: 'Invalid offset parameter. Must be between 0 and 100000.' };
  }

  return { limit: limitNum, offset: offsetNum };
}

// Rate limiter dédié au login — max 10 tentatives / 15 min
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export function registerAdminRoutes(app: Express) {

  // ========================================
  // AUTHENTICATION
  // ========================================

  // Login
  app.post('/api/admin/login', loginLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      // Find user by email
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (!user) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Return user data (without password)
      const { password: _, ...userData } = user;

      res.json({
        token,
        user: userData,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  });

  // ── Mot de passe oublié (admin) ─────────────────────────────────────────────
  app.post('/api/admin/forgot-password', async (req, res) => {
    try {
      const { email } = req.body as { email?: string };
      if (!email) return res.status(400).json({ error: 'Email requis' });

      const [user] = await db.select({ id: users.id, email: users.email })
        .from(users).where(eq(users.email, email.toLowerCase())).limit(1);

      // Toujours retourner 200 pour éviter l'énumération d'emails
      if (!user) return res.json({ message: 'Si ce compte existe, un lien de réinitialisation a été envoyé.' });

      const token = crypto.randomBytes(48).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

      // Invalider les anciens tokens
      await db.delete(passwordResetTokens)
        .where(and(eq(passwordResetTokens.email, user.email), eq(passwordResetTokens.accountType, 'admin')));

      await db.insert(passwordResetTokens).values({
        token, email: user.email, accountType: 'admin', expiresAt,
      });

      sendAdminPasswordReset(user.email, token)
        .catch(e => console.error("[EMAIL] Admin reset error:", e));

      res.json({ message: 'Si ce compte existe, un lien de réinitialisation a été envoyé.' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // ── Réinitialiser le mot de passe (admin) ────────────────────────────────────
  app.post('/api/admin/reset-password', async (req, res) => {
    try {
      const { token, password } = req.body as { token?: string; password?: string };
      if (!token || !password) return res.status(400).json({ error: 'Token et mot de passe requis' });

      const pwCheck = validatePassword(password);
      if (!pwCheck.valid) return res.status(422).json({ error: pwCheck.error });

      const [resetRecord] = await db.select().from(passwordResetTokens)
        .where(and(
          eq(passwordResetTokens.token, token),
          eq(passwordResetTokens.accountType, 'admin')
        )).limit(1);

      if (!resetRecord) return res.status(400).json({ error: 'Token invalide ou expiré' });
      if (resetRecord.usedAt) return res.status(400).json({ error: 'Ce lien a déjà été utilisé' });
      if (new Date() > resetRecord.expiresAt) return res.status(400).json({ error: 'Ce lien a expiré' });

      const hashedPassword = await hashPassword(password);

      await Promise.all([
        db.update(users).set({ password: hashedPassword }).where(eq(users.email, resetRecord.email)),
        db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.token, token)),
      ]);

      res.json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // ── Changer son propre mot de passe (admin authentifié) ─────────────────────
  app.post('/api/admin/change-password', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };
      if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis' });

      const pwCheck = validatePassword(newPassword);
      if (!pwCheck.valid) return res.status(422).json({ error: pwCheck.error });

      const [user] = await db.select().from(users).where(eq(users.id, req.user!.userId)).limit(1);
      if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

      const isValid = await verifyPassword(currentPassword, user.password);
      if (!isValid) return res.status(401).json({ error: 'Mot de passe actuel incorrect' });

      const hashedPassword = await hashPassword(newPassword);
      await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id));

      res.json({ message: 'Mot de passe changé avec succès' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Get current user
  app.get('/api/admin/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Non authentifié' });
      }

      const [user] = await db.select().from(users).where(eq(users.id, req.user.userId)).limit(1);

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const { password: _, ...userData } = user;
      res.json(userData);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
  });

  // ========================================
  // ARTICLES MANAGEMENT
  // ========================================

  // Get all articles
  app.get('/api/admin/articles', requireAuth, async (req, res) => {
    try {
      const { status, search, categoryId, limit, offset } = req.query;

      // Validate pagination parameters
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) {
        return res.status(400).json({ error: pagination.error });
      }

      const conditions: any[] = [];
      if (status && status !== 'all') {
        conditions.push(eq(articles.status, status as string));
      }
      if (search) {
        const sanitizedSearch = sanitizeLikePattern(search as string);
        conditions.push(
          or(
            like(articles.title, `%${sanitizedSearch}%`),
            like(articles.content, `%${sanitizedSearch}%`)
          )
        );
      }
      if (categoryId) {
        conditions.push(eq(articles.categoryId, categoryId as string));
      }

      let query = db.select().from(articles);
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }

      const result = await query
        .orderBy(desc(articles.createdAt))
        .limit(pagination.limit)
        .offset(pagination.offset);

      // Get total count for pagination
      const [{ count }] = await db.select({ count: sql`count(*)` }).from(articles);

      res.json({ data: result, total: Number(count) });
    } catch (error) {
      console.error('Get articles error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
    }
  });

  // Get article by ID
  app.get('/api/admin/articles/:id', requireAuth, async (req, res) => {
    try {
      const [article] = await db.select().from(articles).where(eq(articles.id, req.params.id)).limit(1);

      if (!article) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      res.json(article);
    } catch (error) {
      console.error('Get article error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' });
    }
  });

  // Create article
  app.post('/api/admin/articles', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
    try {
      // Validate input data with Zod schema
      const validatedData = insertArticleSchema.parse(req.body);

      const data = {
        ...validatedData,
        authorId: req.user?.userId,
        publishedAt: validatedData.status === 'PUBLISHED' ? new Date() : null,
      };

      const [newArticle] = await db.insert(articles).values(data).returning();

      // Log action
      await db.insert(auditLogs).values({
        userId: req.user?.userId,
        action: 'CREATE',
        entityType: 'article',
        entityId: newArticle.id,
        changes: JSON.stringify({ created: data }),
      });

      res.status(201).json(newArticle);
    } catch (error) {
      console.error('Create article error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
    }
  });

  // Update article
  app.put('/api/admin/articles/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const [existing] = await db.select().from(articles).where(eq(articles.id, req.params.id)).limit(1);

      if (!existing) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      // Validate input data with Zod schema (partial for updates)
      const validatedData = insertArticleSchema.partial().parse(req.body);

      const data = {
        ...validatedData,
        publishedAt: validatedData.status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt,
      };

      const [updated] = await db.update(articles)
        .set(data)
        .where(eq(articles.id, req.params.id))
        .returning();

      // Log action
      await db.insert(auditLogs).values({
        userId: req.user?.userId,
        action: 'UPDATE',
        entityType: 'article',
        entityId: req.params.id,
        changes: JSON.stringify({ before: existing, after: updated }),
      });

      res.json(updated);
    } catch (error) {
      console.error('Update article error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'article' });
    }
  });

  // Delete article
  app.delete('/api/admin/articles/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const [existing] = await db.select().from(articles).where(eq(articles.id, req.params.id)).limit(1);

      if (!existing) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      await db.delete(articles).where(eq(articles.id, req.params.id));

      // Log action
      await db.insert(auditLogs).values({
        userId: req.user?.userId,
        action: 'DELETE',
        entityType: 'article',
        entityId: req.params.id,
        changes: JSON.stringify({ deleted: existing }),
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Delete article error:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
    }
  });

  // ========================================
  // EVENTS MANAGEMENT
  // ========================================

  // Get all events
  app.get('/api/admin/events', requireAuth, async (req, res) => {
    try {
      const { status, upcoming, limit, offset } = req.query;

      // Validate pagination parameters
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) {
        return res.status(400).json({ error: pagination.error });
      }

      const conditions: any[] = [];
      if (status && status !== 'all') {
        conditions.push(eq(events.status, status as string));
      }
      if (upcoming === 'true') {
        conditions.push(sql`${events.startDate} >= NOW()`);
      }

      let query = db.select().from(events);
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }

      const result = await query
        .orderBy(desc(events.startDate))
        .limit(pagination.limit)
        .offset(pagination.offset);

      // Get total count for pagination
      const [{ count }] = await db.select({ count: sql`count(*)` }).from(events);

      res.json({ data: result, total: Number(count) });
    } catch (error) {
      console.error('Get events error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
    }
  });

  // Get event by ID
  app.get('/api/admin/events/:id', requireAuth, async (req, res) => {
    try {
      const [event] = await db.select().from(events).where(eq(events.id, req.params.id)).limit(1);

      if (!event) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }

      res.json(event);
    } catch (error) {
      console.error('Get event error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'événement' });
    }
  });

  // Create event
  app.post('/api/admin/events', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
    try {
      // Validate input data with Zod schema
      const validatedData = insertEventSchema.parse(req.body);

      const data = {
        ...validatedData,
        organizerId: req.user?.userId,
      };

      const [newEvent] = await db.insert(events).values(data).returning();

      await db.insert(auditLogs).values({
        userId: req.user?.userId,
        action: 'CREATE',
        entityType: 'event',
        entityId: newEvent.id,
        changes: JSON.stringify({ created: data }),
      });

      res.status(201).json(newEvent);
    } catch (error) {
      console.error('Create event error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      res.status(500).json({ error: 'Erreur lors de la création de l\'événement' });
    }
  });

  // Update event
  app.put('/api/admin/events/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const [existing] = await db.select().from(events).where(eq(events.id, req.params.id)).limit(1);

      if (!existing) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }

      // Validate input data with Zod schema (partial for updates)
      const validatedData = insertEventSchema.partial().parse(req.body);

      const [updated] = await db.update(events)
        .set(validatedData)
        .where(eq(events.id, req.params.id))
        .returning();

      await db.insert(auditLogs).values({
        userId: req.user?.userId,
        action: 'UPDATE',
        entityType: 'event',
        entityId: req.params.id,
        changes: JSON.stringify({ before: existing, after: updated }),
      });

      res.json(updated);
    } catch (error) {
      console.error('Update event error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'événement' });
    }
  });

  // Delete event
  app.delete('/api/admin/events/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const [existing] = await db.select().from(events).where(eq(events.id, req.params.id)).limit(1);

      if (!existing) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }

      await db.delete(events).where(eq(events.id, req.params.id));

      await db.insert(auditLogs).values({
        userId: req.user?.userId,
        action: 'DELETE',
        entityType: 'event',
        entityId: req.params.id,
        changes: JSON.stringify({ deleted: existing }),
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
    }
  });

  // ========================================
  // CATEGORIES MANAGEMENT
  // ========================================

  // Get all categories
  app.get('/api/admin/categories', requireAuth, async (req, res) => {
    try {
      const result = await db.select().from(categories).orderBy(categories.order, categories.name);
      res.json({ data: result, total: result.length });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    }
  });

  // Create category
  app.post('/api/admin/categories', requireAuth, requireAdmin, async (req, res) => {
    try {
      const schema = z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        color: z.string().max(20).optional(),
        icon: z.string().max(50).optional(),
        order: z.number().int().min(0).optional(),
        parentId: z.string().optional(),
      });
      const data = schema.parse(req.body);
      const [newCategory] = await db.insert(categories).values(data).returning();
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la catégorie' });
    }
  });

  // Update category
  app.put('/api/admin/categories/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id: _id, createdAt: _c, ...updateData } = req.body;
      const [updated] = await db.update(categories)
        .set(updateData)
        .where(eq(categories.id, req.params.id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Catégorie non trouvée' });
      }

      res.json(updated);
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la catégorie' });
    }
  });

  // Delete category
  app.delete('/api/admin/categories/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(categories).where(eq(categories.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie' });
    }
  });

  // ========================================
  // USERS MANAGEMENT (Admin only)
  // ========================================

  // Get all users
  app.get('/api/admin/users', requireAuth, requireAdmin, async (req, res) => {
    try {
      const result = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatar: users.avatar,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      }).from(users).orderBy(desc(users.createdAt));

      res.json({ data: result, total: result.length });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
  });

  // Create user
  app.post('/api/admin/users', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { email, password, name, role } = req.body;

      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.error });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      const [newUser] = await db.insert(users).values({
        email,
        password: hashedPassword,
        name,
        role: role || 'USER',
      }).returning();

      const { password: _, ...userData } = newUser;
      res.status(201).json(userData);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
  });

  // Update user
  app.put('/api/admin/users/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { password, ...updateData } = req.body;

      // If password is being updated, validate and hash it
      if (password) {
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
          return res.status(400).json({ error: passwordValidation.error });
        }
        updateData.password = await hashPassword(password);
      }

      const [updated] = await db.update(users)
        .set(updateData)
        .where(eq(users.id, req.params.id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const { password: _, ...userData } = updated;
      res.json(userData);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
  });

  // Delete user
  app.delete('/api/admin/users/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
    try {
      // Prevent admin from deleting their own account
      if (req.params.id === req.user?.userId) {
        return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
      }

      await db.delete(users).where(eq(users.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
  });

  // ========================================
  // MEDIA MANAGEMENT
  // ========================================

  // Get all media
  app.get('/api/admin/media', requireAuth, async (req, res) => {
    try {
      const { folder, search, limit, offset } = req.query;

      // Validate pagination parameters
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) {
        return res.status(400).json({ error: pagination.error });
      }

      const conditions: any[] = [];
      if (folder) {
        conditions.push(eq(media.folder, folder as string));
      }
      if (search) {
        const sanitizedSearch = sanitizeLikePattern(search as string);
        conditions.push(
          or(
            like(media.originalName, `%${sanitizedSearch}%`),
            like(media.alt, `%${sanitizedSearch}%`)
          )
        );
      }

      let query = db.select().from(media);
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }

      const result = await query
        .orderBy(desc(media.createdAt))
        .limit(pagination.limit)
        .offset(pagination.offset);

      // Get total count for pagination
      const [{ count }] = await db.select({ count: sql`count(*)` }).from(media);

      res.json({ data: result, total: Number(count) });
    } catch (error) {
      console.error('Get media error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des médias' });
    }
  });

  // Upload media file
  app.post('/api/admin/media', requireAuth, upload.single('file'), async (req: AuthRequest, res) => {
    try {
      const file = (req as any).file;
      if (!file) {
        return res.status(400).json({ error: 'Aucun fichier fourni' });
      }

      const { alt, caption, title, folder } = req.body as Record<string, string>;
      const url = `/uploads/${file.filename}`;

      const [newMedia] = await db.insert(media).values({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url,
        alt: alt || null,
        caption: caption || null,
        title: title || null,
        folder: folder || '/',
        uploadedBy: req.user?.userId,
      }).returning();

      res.status(201).json(newMedia);
    } catch (error: any) {
      console.error('Upload media error:', error);
      if (error.message?.includes('Type de fichier')) {
        return res.status(415).json({ error: error.message });
      }
      res.status(500).json({ error: "Erreur lors de l'upload du fichier" });
    }
  });

  // Update media metadata
  app.patch('/api/admin/media/:id', requireAuth, async (req, res) => {
    try {
      const { alt, caption, title, folder } = req.body as Record<string, string>;
      const [updated] = await db.update(media)
        .set({ alt, caption, title, folder, updatedAt: new Date() })
        .where(eq(media.id, req.params.id))
        .returning();
      if (!updated) return res.status(404).json({ error: 'Média non trouvé' });
      res.json(updated);
    } catch (error) {
      console.error('Update media error:', error);
      res.status(500).json({ error: 'Erreur mise à jour média' });
    }
  });

  // Delete media file
  app.delete('/api/admin/media/:id', requireAuth, async (req, res) => {
    try {
      const [existing] = await db.select().from(media).where(eq(media.id, req.params.id)).limit(1);
      if (!existing) return res.status(404).json({ error: 'Média non trouvé' });

      // Supprimer le fichier physique si stocké localement
      const filePath = path.join(UPLOAD_DIR, existing.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await db.delete(media).where(eq(media.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('Delete media error:', error);
      res.status(500).json({ error: 'Erreur suppression média' });
    }
  });

  // ========================================
  // PAGES MANAGEMENT
  // ========================================

  // Get all pages
  app.get('/api/admin/pages', requireAuth, async (req, res) => {
    try {
      const result = await db.select().from(pages).orderBy(pages.order, pages.title);
      res.json({ data: result, total: result.length });
    } catch (error) {
      console.error('Get pages error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des pages' });
    }
  });

  // Get page by ID
  app.get('/api/admin/pages/:id', requireAuth, async (req, res) => {
    try {
      const [page] = await db.select().from(pages).where(eq(pages.id, req.params.id)).limit(1);

      if (!page) {
        return res.status(404).json({ error: 'Page non trouvée' });
      }

      res.json(page);
    } catch (error) {
      console.error('Get page error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de la page' });
    }
  });

  // Create page
  app.post('/api/admin/pages', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
    try {
      // Validate input data with Zod schema
      const validatedData = insertPageSchema.parse(req.body);

      const data = {
        ...validatedData,
        authorId: req.user?.userId,
        publishedAt: validatedData.status === 'PUBLISHED' ? new Date() : null,
      };

      const [newPage] = await db.insert(pages).values(data).returning();
      res.status(201).json(newPage);
    } catch (error) {
      console.error('Create page error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      res.status(500).json({ error: 'Erreur lors de la création de la page' });
    }
  });

  // Update page
  app.put('/api/admin/pages/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      // Validate input data with Zod schema (partial for updates)
      const validatedData = insertPageSchema.partial().parse(req.body);

      const [updated] = await db.update(pages)
        .set(validatedData)
        .where(eq(pages.id, req.params.id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Page non trouvée' });
      }

      res.json(updated);
    } catch (error) {
      console.error('Update page error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la page' });
    }
  });

  // Delete page
  app.delete('/api/admin/pages/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(pages).where(eq(pages.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('Delete page error:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de la page' });
    }
  });

  // Toggle page publish/draft status
  app.put('/api/admin/pages/:id/status', requireAuth, async (req, res) => {
    try {
      const { status } = req.body as { status?: string };
      const normalized = status?.toUpperCase();
      if (!normalized || !['PUBLISHED', 'DRAFT'].includes(normalized)) {
        return res.status(400).json({ error: 'Status doit être "published" ou "draft"' });
      }
      const [updated] = await db.update(pages)
        .set({ status: normalized, updatedAt: new Date() })
        .where(eq(pages.id, req.params.id))
        .returning();
      if (!updated) return res.status(404).json({ error: 'Page non trouvée' });
      res.json(updated);
    } catch (error) {
      console.error('Toggle page status error:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
  });

  // ========================================
  // AUDIT LOGS (Admin only)
  // ========================================

  app.get('/api/admin/audit-logs', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { entityType, entityId, userId, action, limit, offset } = req.query;

      // Validate pagination parameters (default limit for audit logs is 100)
      const pagination = validatePagination(limit as string || '100', offset as string);
      if ('error' in pagination) {
        return res.status(400).json({ error: pagination.error });
      }

      const conditions: any[] = [];
      if (entityType) conditions.push(eq(auditLogs.entityType, entityType as string));
      if (entityId)   conditions.push(eq(auditLogs.entityId, entityId as string));
      if (userId)     conditions.push(eq(auditLogs.userId, userId as string));
      if (action && action !== 'all') conditions.push(eq(auditLogs.action, action as string));

      let query = db.select().from(auditLogs);
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }

      const [result, [{ count }]] = await Promise.all([
        query.orderBy(desc(auditLogs.createdAt)).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(auditLogs),
      ]);

      res.json({ data: result, total: Number(count) });
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des logs' });
    }
  });

  // ========================================
  // DASHBOARD STATS
  // ========================================

  app.get('/api/admin/stats', requireAuth, async (req, res) => {
    try {
      const [
        [articlesCount],
        [eventsCount],
        [pagesCount],
        [leadsCount],
        [newLeadsCount],
        [refsCount],
        [caseStudiesCount],
        [testimonialsCount],
        [teamMembersCount],
        [servicesCount],
        [newsletterCount],
        [contactsCount],
        recentLeads,
        recentArticles,
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)::int` }).from(articles),
        db.select({ count: sql<number>`count(*)::int` }).from(events),
        db.select({ count: sql<number>`count(*)::int` }).from(pages),
        db.select({ count: sql<number>`count(*)::int` }).from(projectBriefs),
        db.select({ count: sql<number>`count(*)::int` }).from(projectBriefs).where(eq(projectBriefs.status, 'NEW')),
        db.select({ count: sql<number>`count(*)::int` }).from(clientReferences),
        db.select({ count: sql<number>`count(*)::int` }).from(caseStudies),
        db.select({ count: sql<number>`count(*)::int` }).from(testimonials).where(eq(testimonials.isPublished, true)),
        db.select({ count: sql<number>`count(*)::int` }).from(teamMembers),
        db.select({ count: sql<number>`count(*)::int` }).from(services),
        db.select({ count: sql<number>`count(*)::int` }).from(newsletterSubscriptions).where(eq(newsletterSubscriptions.status, 'ACTIVE')),
        db.select({ count: sql<number>`count(*)::int` }).from(contactMessages),
        db.select().from(projectBriefs).orderBy(desc(projectBriefs.createdAt)).limit(5),
        db.select().from(articles).orderBy(desc(articles.createdAt)).limit(5),
      ]);

      res.json({
        articles:      articlesCount?.count    ?? 0,
        events:        eventsCount?.count       ?? 0,
        pages:         pagesCount?.count        ?? 0,
        leads:         leadsCount?.count        ?? 0,
        newLeads:      newLeadsCount?.count     ?? 0,
        references:    refsCount?.count         ?? 0,
        caseStudies:   caseStudiesCount?.count  ?? 0,
        testimonials:  testimonialsCount?.count ?? 0,
        teamMembers:   teamMembersCount?.count  ?? 0,
        services:      servicesCount?.count     ?? 0,
        newsletter:    newsletterCount?.count   ?? 0,
        contacts:      contactsCount?.count     ?? 0,
        recentLeads,
        recentArticles,
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
  });

  // ========================================
  // SERVICES CRUD
  // ========================================

  app.get('/api/admin/services', requireAuth, async (req, res) => {
    try {
      const { status, hub, search, limit, offset } = req.query;
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) return res.status(400).json({ error: pagination.error });

      const conditions: any[] = [];
      if (status && status !== 'all') conditions.push(eq(services.status, status as string));
      if (hub) conditions.push(eq(services.hub, hub as string));
      if (search) {
        const s = sanitizeLikePattern(search as string);
        conditions.push(or(like(services.title, `%${s}%`), like(services.accroche, `%${s}%`)));
      }

      let query = db.select().from(services);
      if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;

      const [result, [{ count }]] = await Promise.all([
        query.orderBy(services.order, desc(services.createdAt)).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(services),
      ]);
      res.json({ data: result, total: Number(count) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur services' });
    }
  });

  app.get('/api/admin/services/:id', requireAuth, async (req, res) => {
    try {
      const [service] = await db.select().from(services).where(eq(services.id, req.params.id)).limit(1);
      if (!service) return res.status(404).json({ error: 'Service non trouvé' });
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: 'Erreur service' });
    }
  });

  app.post('/api/admin/services', requireAuth, requireAdmin, async (req, res) => {
    try {
      const parsed = insertServiceSchema.safeParse(req.body);
      if (!parsed.success) return res.status(422).json({ error: parsed.error.flatten() });
      const [service] = await db.insert(services).values(parsed.data).returning();
      res.status(201).json(service);
    } catch (error) {
      res.status(500).json({ error: 'Erreur création service' });
    }
  });

  app.put('/api/admin/services/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const [service] = await db.update(services).set({ ...updateData, updatedAt: new Date() })
        .where(eq(services.id, req.params.id)).returning();
      if (!service) return res.status(404).json({ error: 'Service non trouvé' });
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour service' });
    }
  });

  app.delete('/api/admin/services/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(services).where(eq(services.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression service' });
    }
  });

  // ========================================
  // CLIENT REFERENCES CRUD
  // ========================================

  app.get('/api/admin/references', requireAuth, async (req, res) => {
    try {
      const { search, sector, featured, limit, offset } = req.query;
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) return res.status(400).json({ error: pagination.error });

      const conditions: any[] = [];
      if (search) {
        const s = sanitizeLikePattern(search as string);
        conditions.push(or(like(clientReferences.name, `%${s}%`), like(clientReferences.description, `%${s}%`)));
      }
      if (featured === 'true') conditions.push(eq(clientReferences.isFeatured, true));

      let query = db.select().from(clientReferences);
      if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;

      const [result, [{ count }]] = await Promise.all([
        query.orderBy(clientReferences.order, desc(clientReferences.createdAt)).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(clientReferences),
      ]);
      res.json({ data: result, total: Number(count) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur références' });
    }
  });

  app.get('/api/admin/references/:id', requireAuth, async (req, res) => {
    try {
      const [ref] = await db.select().from(clientReferences).where(eq(clientReferences.id, req.params.id)).limit(1);
      if (!ref) return res.status(404).json({ error: 'Référence non trouvée' });
      res.json(ref);
    } catch (error) {
      res.status(500).json({ error: 'Erreur référence' });
    }
  });

  app.post('/api/admin/references', requireAuth, requireAdmin, async (req, res) => {
    try {
      const parsed = insertClientReferenceSchema.safeParse(req.body);
      if (!parsed.success) return res.status(422).json({ error: parsed.error.flatten() });
      const [ref] = await db.insert(clientReferences).values(parsed.data).returning();
      res.status(201).json(ref);
    } catch (error) {
      res.status(500).json({ error: 'Erreur création référence' });
    }
  });

  app.put('/api/admin/references/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const [ref] = await db.update(clientReferences).set({ ...updateData, updatedAt: new Date() })
        .where(eq(clientReferences.id, req.params.id)).returning();
      if (!ref) return res.status(404).json({ error: 'Référence non trouvée' });
      res.json(ref);
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour référence' });
    }
  });

  app.delete('/api/admin/references/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(clientReferences).where(eq(clientReferences.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression référence' });
    }
  });

  // ========================================
  // CASE STUDIES CRUD
  // ========================================

  app.get('/api/admin/case-studies', requireAuth, async (req, res) => {
    try {
      const { status, search, featured, limit, offset } = req.query;
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) return res.status(400).json({ error: pagination.error });

      const conditions: any[] = [];
      if (status && status !== 'all') conditions.push(eq(caseStudies.status, status as string));
      if (search) {
        const s = sanitizeLikePattern(search as string);
        conditions.push(or(like(caseStudies.title, `%${s}%`), like(caseStudies.clientName, `%${s}%`)));
      }
      if (featured === 'true') conditions.push(eq(caseStudies.isFeatured, true));

      let query = db.select().from(caseStudies);
      if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;

      const [result, [{ count }]] = await Promise.all([
        query.orderBy(desc(caseStudies.publishedAt)).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(caseStudies),
      ]);
      res.json({ data: result, total: Number(count) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur études de cas' });
    }
  });

  app.get('/api/admin/case-studies/:id', requireAuth, async (req, res) => {
    try {
      const [cs] = await db.select().from(caseStudies).where(eq(caseStudies.id, req.params.id)).limit(1);
      if (!cs) return res.status(404).json({ error: 'Étude de cas non trouvée' });
      res.json(cs);
    } catch (error) {
      res.status(500).json({ error: 'Erreur étude de cas' });
    }
  });

  app.post('/api/admin/case-studies', requireAuth, requireAdmin, async (req, res) => {
    try {
      const parsed = insertCaseStudySchema.safeParse(req.body);
      if (!parsed.success) return res.status(422).json({ error: parsed.error.flatten() });
      const [cs] = await db.insert(caseStudies).values(parsed.data).returning();
      res.status(201).json(cs);
    } catch (error) {
      res.status(500).json({ error: 'Erreur création étude de cas' });
    }
  });

  app.put('/api/admin/case-studies/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const [cs] = await db.update(caseStudies).set({ ...updateData, updatedAt: new Date() })
        .where(eq(caseStudies.id, req.params.id)).returning();
      if (!cs) return res.status(404).json({ error: 'Étude de cas non trouvée' });
      res.json(cs);
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour étude de cas' });
    }
  });

  app.delete('/api/admin/case-studies/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(caseStudies).where(eq(caseStudies.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression étude de cas' });
    }
  });

  // ========================================
  // TESTIMONIALS CRUD
  // ========================================

  app.get('/api/admin/testimonials', requireAuth, async (req, res) => {
    try {
      const { search, published, featured, limit, offset } = req.query;
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) return res.status(400).json({ error: pagination.error });

      const conditions: any[] = [];
      if (published !== undefined) conditions.push(eq(testimonials.isPublished, published === 'true'));
      if (featured === 'true') conditions.push(eq(testimonials.isFeatured, true));
      if (search) {
        const s = sanitizeLikePattern(search as string);
        conditions.push(or(like(testimonials.quote, `%${s}%`), like(testimonials.authorName, `%${s}%`), like(testimonials.companyName, `%${s}%`)));
      }

      let query = db.select().from(testimonials);
      if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;

      const [result, [{ count }]] = await Promise.all([
        query.orderBy(testimonials.order, desc(testimonials.createdAt)).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(testimonials),
      ]);
      res.json({ data: result, total: Number(count) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur témoignages' });
    }
  });

  app.get('/api/admin/testimonials/:id', requireAuth, async (req, res) => {
    try {
      const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, req.params.id)).limit(1);
      if (!testimonial) return res.status(404).json({ error: 'Témoignage non trouvé' });
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ error: 'Erreur témoignage' });
    }
  });

  app.post('/api/admin/testimonials', requireAuth, requireAdmin, async (req, res) => {
    try {
      const parsed = insertTestimonialSchema.safeParse(req.body);
      if (!parsed.success) return res.status(422).json({ error: parsed.error.flatten() });
      const [testimonial] = await db.insert(testimonials).values(parsed.data).returning();
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(500).json({ error: 'Erreur création témoignage' });
    }
  });

  app.put('/api/admin/testimonials/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const [testimonial] = await db.update(testimonials).set({ ...updateData, updatedAt: new Date() })
        .where(eq(testimonials.id, req.params.id)).returning();
      if (!testimonial) return res.status(404).json({ error: 'Témoignage non trouvé' });
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour témoignage' });
    }
  });

  app.delete('/api/admin/testimonials/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(testimonials).where(eq(testimonials.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression témoignage' });
    }
  });

  // ========================================
  // TEAM MEMBERS CRUD
  // ========================================

  app.get('/api/admin/team', requireAuth, async (req, res) => {
    try {
      const { search, department, limit, offset } = req.query;
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) return res.status(400).json({ error: pagination.error });

      const conditions: any[] = [];
      if (department) conditions.push(eq(teamMembers.department, department as string));
      if (search) {
        const s = sanitizeLikePattern(search as string);
        conditions.push(or(like(teamMembers.name, `%${s}%`), like(teamMembers.position, `%${s}%`)));
      }

      let query = db.select().from(teamMembers);
      if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;

      const [result, [{ count }]] = await Promise.all([
        query.orderBy(teamMembers.order, teamMembers.name).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(teamMembers),
      ]);
      res.json({ data: result, total: Number(count) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur équipe' });
    }
  });

  app.get('/api/admin/team/:id', requireAuth, async (req, res) => {
    try {
      const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, req.params.id)).limit(1);
      if (!member) return res.status(404).json({ error: 'Membre non trouvé' });
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: 'Erreur membre équipe' });
    }
  });

  app.post('/api/admin/team', requireAuth, requireAdmin, async (req, res) => {
    try {
      const parsed = insertTeamMemberSchema.safeParse(req.body);
      if (!parsed.success) return res.status(422).json({ error: parsed.error.flatten() });
      const [member] = await db.insert(teamMembers).values(parsed.data).returning();
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ error: 'Erreur création membre' });
    }
  });

  app.put('/api/admin/team/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const [member] = await db.update(teamMembers).set({ ...updateData, updatedAt: new Date() })
        .where(eq(teamMembers.id, req.params.id)).returning();
      if (!member) return res.status(404).json({ error: 'Membre non trouvé' });
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour membre' });
    }
  });

  app.delete('/api/admin/team/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(teamMembers).where(eq(teamMembers.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression membre' });
    }
  });

  // ========================================
  // SETTINGS CRUD (clé/valeur par groupe)
  // ========================================

  app.get('/api/admin/settings', requireAuth, async (req, res) => {
    try {
      const { group } = req.query;
      let query = db.select().from(settings);
      if (group) query = query.where(eq(settings.group, group as string)) as typeof query;
      const result = await query;
      // Return as a key-value object for convenience
      const obj: Record<string, any> = {};
      for (const row of result) {
        obj[row.key] = row.value;
      }
      res.json({ data: result, object: obj });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lecture paramètres' });
    }
  });

  app.get('/api/admin/settings/:group', requireAuth, async (req, res) => {
    try {
      const result = await db.select().from(settings).where(eq(settings.group, req.params.group));
      const obj: Record<string, any> = {};
      for (const row of result) {
        obj[row.key] = row.value;
      }
      res.json({ data: obj });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lecture paramètres groupe' });
    }
  });

  app.put('/api/admin/settings', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { group, data: formData } = req.body;
      if (!group || !formData || typeof formData !== 'object') {
        return res.status(400).json({ error: 'group et data requis' });
      }
      const upserts = Object.entries(formData).map(([key, value]) =>
        db.insert(settings)
          .values({ key, value, group, isPublic: true })
          .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } })
      );
      await Promise.all(upserts);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour paramètres' });
    }
  });

  // Alias settings/general → groupe "general"
  app.get('/api/admin/settings/general', requireAuth, async (req, res) => {
    try {
      const result = await db.select().from(settings).where(eq(settings.group, 'general'));
      const obj: Record<string, any> = {};
      for (const row of result) { obj[row.key] = row.value; }
      res.json({ data: obj });
    } catch (error) {
      res.status(500).json({ error: 'Erreur paramètres généraux' });
    }
  });

  app.post('/api/admin/settings/general', requireAuth, requireAdmin, async (req, res) => {
    try {
      const formData = req.body;
      const upserts = Object.entries(formData).map(([key, value]) =>
        db.insert(settings)
          .values({ key, value, group: 'general', isPublic: key !== 'favicon' })
          .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } })
      );
      await Promise.all(upserts);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur sauvegarde paramètres généraux' });
    }
  });

  // ========================================
  // SOLUTIONS CRUD (alias → services table)
  // ========================================
  // SolutionManagement.tsx appelle /api/admin/solutions → on redirige vers services

  app.get('/api/admin/solutions', requireAuth, async (req, res) => {
    try {
      const { status, search, limit, offset } = req.query;
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) return res.status(400).json({ error: pagination.error });
      const conditions: any[] = [];
      if (status && status !== 'all') conditions.push(eq(services.status, status as string));
      if (search) {
        const s = sanitizeLikePattern(search as string);
        conditions.push(or(like(services.title, `%${s}%`), like(services.accroche, `%${s}%`)));
      }
      let query = db.select().from(services);
      if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;
      const [result, [{ count }]] = await Promise.all([
        query.orderBy(services.order, desc(services.createdAt)).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(services),
      ]);
      res.json({ data: result, total: Number(count) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur solutions' });
    }
  });

  app.get('/api/admin/solutions/categories', requireAuth, async (req, res) => {
    try {
      const result = await db.selectDistinctOn([services.hub], { hub: services.hub }).from(services);
      const cats = result.map(r => ({ slug: r.hub, label: r.hub }));
      res.json({ data: cats });
    } catch (error) {
      res.status(500).json({ error: 'Erreur catégories solutions' });
    }
  });

  app.get('/api/admin/solutions/:id', requireAuth, async (req, res) => {
    try {
      const [svc] = await db.select().from(services).where(eq(services.id, req.params.id)).limit(1);
      if (!svc) return res.status(404).json({ error: 'Solution non trouvée' });
      res.json(svc);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lecture solution' });
    }
  });

  app.post('/api/admin/solutions', requireAuth, requireAdmin, async (req, res) => {
    try {
      const schema = z.object({
        title: z.string().min(1).max(200),
        slug: z.string().min(1).max(200),
        description: z.string().optional(),
        shortDescription: z.string().max(500).optional(),
        icon: z.string().max(100).optional(),
        coverImage: z.string().max(500).optional(),
        category: z.string().max(100).optional(),
        status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
        order: z.number().int().min(0).optional(),
        features: z.any().optional(),
        benefits: z.any().optional(),
        cta: z.any().optional(),
      });
      const data = schema.parse(req.body);
      const [svc] = await db.insert(services).values(data).returning();
      res.status(201).json(svc);
    } catch (error) {
      res.status(500).json({ error: 'Erreur création solution' });
    }
  });

  app.put('/api/admin/solutions/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const [svc] = await db.update(services).set({ ...req.body, updatedAt: new Date() })
        .where(eq(services.id, req.params.id)).returning();
      if (!svc) return res.status(404).json({ error: 'Solution non trouvée' });
      res.json(svc);
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour solution' });
    }
  });

  app.put('/api/admin/solutions/:id/status', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { isActive } = req.body;
      const status = isActive ? 'PUBLISHED' : 'DRAFT';
      const [svc] = await db.update(services).set({ status, updatedAt: new Date() })
        .where(eq(services.id, req.params.id)).returning();
      if (!svc) return res.status(404).json({ error: 'Solution non trouvée' });
      res.json(svc);
    } catch (error) {
      res.status(500).json({ error: 'Erreur statut solution' });
    }
  });

  app.delete('/api/admin/solutions/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(services).where(eq(services.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression solution' });
    }
  });

  // ========================================
  // NAVIGATION MENUS CRUD
  // ========================================

  app.get('/api/admin/navigations', requireAuth, async (req, res) => {
    try {
      const menus = await db.select().from(navigationMenus).orderBy(navigationMenus.name);
      res.json(menus);
    } catch (error) {
      console.error('Erreur navigations:', error);
      res.status(500).json({ error: 'Erreur chargement navigations' });
    }
  });

  app.get('/api/admin/navigations/:id', requireAuth, async (req, res) => {
    try {
      const [menu] = await db.select().from(navigationMenus).where(eq(navigationMenus.id, req.params.id));
      if (!menu) return res.status(404).json({ error: 'Menu non trouvé' });
      res.json(menu);
    } catch (error) {
      res.status(500).json({ error: 'Erreur chargement menu' });
    }
  });

  app.post('/api/admin/navigations', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { name, slug, location, items, isActive } = req.body;
      const now = new Date();
      const [menu] = await db.insert(navigationMenus).values({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        location: location || 'header',
        items: items || [],
        isActive: isActive !== false,
        createdAt: now,
        updatedAt: now,
      }).returning();
      res.status(201).json(menu);
    } catch (error) {
      console.error('Erreur création navigation:', error);
      res.status(500).json({ error: 'Erreur création navigation' });
    }
  });

  app.put('/api/admin/navigations/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { name, slug, location, items, isActive } = req.body;
      const [menu] = await db.update(navigationMenus)
        .set({
          ...(name !== undefined && { name }),
          ...(slug !== undefined && { slug }),
          ...(location !== undefined && { location }),
          ...(items !== undefined && { items }),
          ...(isActive !== undefined && { isActive }),
          updatedAt: new Date(),
        })
        .where(eq(navigationMenus.id, req.params.id))
        .returning();
      if (!menu) return res.status(404).json({ error: 'Menu non trouvé' });
      res.json(menu);
    } catch (error) {
      console.error('Erreur mise à jour navigation:', error);
      res.status(500).json({ error: 'Erreur mise à jour navigation' });
    }
  });

  app.delete('/api/admin/navigations/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(navigationMenus).where(eq(navigationMenus.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression navigation' });
    }
  });

  // ========================================
  // PROJECT BRIEFS / LEADS CRUD
  // ========================================

  app.get('/api/admin/leads', requireAuth, async (req, res) => {
    try {
      const { status, priority, search, limit, offset } = req.query;
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) return res.status(400).json({ error: pagination.error });

      const conditions: any[] = [];
      if (status && status !== 'all') conditions.push(eq(projectBriefs.status, status as string));
      if (priority) conditions.push(eq(projectBriefs.priority, priority as string));
      if (search) {
        const s = sanitizeLikePattern(search as string);
        conditions.push(or(
          like(projectBriefs.firstName, `%${s}%`),
          like(projectBriefs.lastName, `%${s}%`),
          like(projectBriefs.email, `%${s}%`),
          like(projectBriefs.company, `%${s}%`)
        ));
      }

      let query = db.select().from(projectBriefs);
      if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;

      const [result, [{ count }]] = await Promise.all([
        query.orderBy(desc(projectBriefs.createdAt)).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(projectBriefs),
      ]);
      res.json({ data: result, total: Number(count) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur leads' });
    }
  });

  app.get('/api/admin/leads/:id', requireAuth, async (req, res) => {
    try {
      const [lead] = await db.select().from(projectBriefs).where(eq(projectBriefs.id, req.params.id)).limit(1);
      if (!lead) return res.status(404).json({ error: 'Lead non trouvé' });
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lead' });
    }
  });

  app.put('/api/admin/leads/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const [lead] = await db.update(projectBriefs)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(projectBriefs.id, req.params.id)).returning();
      if (!lead) return res.status(404).json({ error: 'Lead non trouvé' });
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour lead' });
    }
  });

  app.delete('/api/admin/leads/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(projectBriefs).where(eq(projectBriefs.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression lead' });
    }
  });

  // ========================================
  // NEWSLETTER SUBSCRIPTIONS
  // ========================================

  app.get('/api/admin/newsletter', requireAuth, async (req, res) => {
    try {
      const { status, search, limit, offset } = req.query;
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) return res.status(400).json({ error: pagination.error });

      const conditions: any[] = [];
      if (status && status !== 'all') conditions.push(eq(newsletterSubscriptions.status, status as string));
      if (search) {
        const s = sanitizeLikePattern(search as string);
        conditions.push(or(
          like(newsletterSubscriptions.email, `%${s}%`),
          like(newsletterSubscriptions.firstName, `%${s}%`),
          like(newsletterSubscriptions.lastName, `%${s}%`)
        ));
      }

      let query = db.select().from(newsletterSubscriptions);
      if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;

      const [result, [{ count }]] = await Promise.all([
        query.orderBy(desc(newsletterSubscriptions.createdAt)).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(newsletterSubscriptions),
      ]);
      res.json({ data: result, total: Number(count) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur newsletter' });
    }
  });

  app.put('/api/admin/newsletter/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const [sub] = await db.update(newsletterSubscriptions)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(newsletterSubscriptions.id, req.params.id)).returning();
      if (!sub) return res.status(404).json({ error: 'Abonnement non trouvé' });
      res.json(sub);
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour abonnement' });
    }
  });

  app.delete('/api/admin/newsletter/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(newsletterSubscriptions).where(eq(newsletterSubscriptions.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression abonnement' });
    }
  });

  // ========================================
  // CONTACT MESSAGES MANAGEMENT
  // ========================================

  app.get('/api/admin/contacts', requireAuth, async (req, res) => {
    try {
      const { status, search, limit, offset } = req.query;
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) return res.status(400).json({ error: pagination.error });

      const conditions: any[] = [];
      if (status && status !== 'all') conditions.push(eq(contactMessages.status, status as string));
      if (search) {
        const s = sanitizeLikePattern(search as string);
        conditions.push(or(
          like(contactMessages.email, `%${s}%`),
          like(contactMessages.firstName, `%${s}%`),
          like(contactMessages.company, `%${s}%`)
        ));
      }

      let query = db.select().from(contactMessages);
      if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;

      const [result, [{ count }]] = await Promise.all([
        query.orderBy(desc(contactMessages.createdAt)).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(contactMessages),
      ]);
      res.json({ data: result, total: Number(count) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur contacts' });
    }
  });

  app.put('/api/admin/contacts/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const [msg] = await db.update(contactMessages)
        .set({ status })
        .where(eq(contactMessages.id, req.params.id)).returning();
      if (!msg) return res.status(404).json({ error: 'Message non trouvé' });
      res.json(msg);
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour message' });
    }
  });

  app.delete('/api/admin/contacts/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(contactMessages).where(eq(contactMessages.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression message' });
    }
  });

  // ========================================
  // RESOURCES MANAGEMENT
  // ========================================

  app.get('/api/admin/resources', requireAuth, async (req, res) => {
    try {
      const result = await db.select().from(resources).orderBy(resources.sortOrder, desc(resources.createdAt));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erreur ressources' });
    }
  });

  app.get('/api/admin/resources/:id', requireAuth, async (req, res) => {
    try {
      const [r] = await db.select().from(resources).where(eq(resources.id, parseInt(req.params.id, 10))).limit(1);
      if (!r) return res.status(404).json({ error: 'Ressource non trouvée' });
      res.json(r);
    } catch (error) {
      res.status(500).json({ error: 'Erreur ressource' });
    }
  });

  app.post('/api/admin/resources', requireAuth, requireAdmin, async (req, res) => {
    try {
      const data = insertResourceSchema.parse(req.body);
      const [newR] = await db.insert(resources).values(data as any).returning();
      res.status(201).json(newR);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: 'Données invalides', details: error.errors });
      res.status(500).json({ error: 'Erreur création ressource' });
    }
  });

  app.put('/api/admin/resources/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const [updated] = await db.update(resources)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(resources.id, parseInt(req.params.id, 10)))
        .returning();
      if (!updated) return res.status(404).json({ error: 'Ressource non trouvée' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour ressource' });
    }
  });

  app.delete('/api/admin/resources/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(resources).where(eq(resources.id, parseInt(req.params.id, 10)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression ressource' });
    }
  });

  // Répondre par email à un message de contact
  app.post('/api/admin/contacts/:id/reply', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { replyBody } = req.body as { replyBody?: string };
      if (!replyBody?.trim()) return res.status(400).json({ error: 'Le message de réponse est requis' });

      const [contact] = await db.select().from(contactMessages).where(eq(contactMessages.id, req.params.id)).limit(1);
      if (!contact) return res.status(404).json({ error: 'Message introuvable' });

      const { sendMail } = await import('./lib/email');
      const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const ok = await sendMail({
        to: contact.email,
        subject: `Re: Message de ${esc(contact.firstName ?? '')} ${esc(contact.lastName ?? '')} — Epitaphe360`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <p style="color:#333;">${esc(replyBody.trim()).replace(/\n/g, '<br/>')}</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
            <blockquote style="color:#888;border-left:3px solid #E63946;padding-left:12px;margin:0;">
              <p><strong>Votre message original :</strong></p>
              <p>${esc(contact.message ?? '')}</p>
            </blockquote>
            <p style="color:#aaa;font-size:12px;margin-top:24px;">Epitaphe360 · <a href="${process.env.FRONTEND_URL ?? 'https://epitaphe360.com'}" style="color:#E63946;">epitaphe360.com</a></p>
          </div>
        `,
      });

      if (!ok) return res.status(500).json({ error: 'Échec envoi email' });

      // Marquer comme répondu
      await db.update(contactMessages).set({ status: 'replied' }).where(eq(contactMessages.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('Contact reply error:', error);
      res.status(500).json({ error: 'Erreur lors de l\'envoi de la réponse' });
    }
  });

  // ========================================
  // ESPACE CLIENT — Gestion des comptes clients (admin)
  // ========================================

  // Liste des comptes clients
  app.get('/api/admin/client-accounts', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { search, limit, offset } = req.query;
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) return res.status(400).json({ error: pagination.error });

      const conditions: any[] = [];
      if (search) {
        const s = sanitizeLikePattern(search as string);
        conditions.push(or(
          like(clientAccounts.name, `%${s}%`),
          like(clientAccounts.email, `%${s}%`),
          like(clientAccounts.company, `%${s}%`)
        ));
      }

      let query = db.select({
        id: clientAccounts.id,
        email: clientAccounts.email,
        name: clientAccounts.name,
        company: clientAccounts.company,
        phone: clientAccounts.phone,
        isActive: clientAccounts.isActive,
        lastLoginAt: clientAccounts.lastLoginAt,
        createdAt: clientAccounts.createdAt,
      }).from(clientAccounts);

      if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;

      const [result, [{ count }]] = await Promise.all([
        query.orderBy(desc(clientAccounts.createdAt)).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(clientAccounts),
      ]);
      res.json({ data: result, total: Number(count) });
    } catch (error) {
      console.error('Client accounts list error:', error);
      res.status(500).json({ error: 'Erreur récupération comptes clients' });
    }
  });

  // Créer un compte client
  app.post('/api/admin/client-accounts', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { email, name, company, phone, password } = req.body as Record<string, string>;
      if (!email || !name || !password) {
        return res.status(400).json({ error: 'email, name et password sont requis' });
      }
      const pwCheck = validatePassword(password);
      if (!pwCheck.valid) return res.status(422).json({ error: pwCheck.error });

      const passwordHash = await hashPassword(password);
      const [account] = await db.insert(clientAccounts).values({
        email, name, company: company || null, phone: phone || null, passwordHash, isActive: true,
      }).returning();

      const { passwordHash: _, ...safe } = account;
      res.status(201).json(safe);
    } catch (error: any) {
      console.error('Create client account error:', error);
      if (error.code === '23505') return res.status(409).json({ error: 'Email déjà utilisé' });
      res.status(500).json({ error: 'Erreur création compte client' });
    }
  });

  // Modifier un compte client
  app.put('/api/admin/client-accounts/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, company, phone, isActive, password } = req.body as Record<string, any>;

      const updateData: Record<string, any> = { name, company, phone, isActive, updatedAt: new Date() };

      if (password) {
        const pwCheck = validatePassword(password);
        if (!pwCheck.valid) return res.status(422).json({ error: pwCheck.error });
        updateData.passwordHash = await hashPassword(password);
      }

      const [updated] = await db.update(clientAccounts).set(updateData).where(eq(clientAccounts.id, id)).returning();
      if (!updated) return res.status(404).json({ error: 'Compte client non trouvé' });
      const { passwordHash: _, ...safe } = updated;
      res.json(safe);
    } catch (error) {
      console.error('Update client account error:', error);
      res.status(500).json({ error: 'Erreur mise à jour compte client' });
    }
  });

  // Supprimer un compte client
  app.delete('/api/admin/client-accounts/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await db.delete(clientAccounts).where(eq(clientAccounts.id, id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression compte client' });
    }
  });

  // ========================================
  // SCORING RESULTS (BMI 360™) — Admin
  // ========================================

  app.get('/api/admin/scoring', requireAuth, async (req, res) => {
    try {
      const { toolId, limit, offset } = req.query;
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) return res.status(400).json({ error: pagination.error });
      let query = db.select().from(scoringResults);
      if (toolId) query = query.where(eq(scoringResults.toolId, toolId as string)) as typeof query;
      const [result, [{ count }]] = await Promise.all([
        query.orderBy(desc(scoringResults.createdAt)).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(scoringResults),
      ]);
      res.json({ data: result, total: Number(count) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur récupération scoring' });
    }
  });

  app.get('/api/admin/scoring/stats', requireAuth, async (req, res) => {
    try {
      const stats = await db.select({
        toolId: scoringResults.toolId,
        count: sql<number>`count(*)::int`,
        avgScore: sql<number>`avg(${scoringResults.globalScore})::int`,
        avgMaturity: sql<number>`avg(${scoringResults.maturityLevel})::numeric(3,1)`,
      }).from(scoringResults)
        .groupBy(scoringResults.toolId)
        .orderBy(desc(sql`count(*)`));
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Erreur stats scoring' });
    }
  });

  app.delete('/api/admin/scoring/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(scoringResults).where(eq(scoringResults.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression résultat' });
    }
  });

  // ========================================
  // ESPACE CLIENT — Gestion des projets (admin)
  // ========================================

  // Liste des projets d'un client (ou tous)
  app.get('/api/admin/client-projects', requireAuth, async (req, res) => {
    try {
      const { clientId, status, limit, offset } = req.query;
      const pagination = validatePagination(limit as string, offset as string);
      if ('error' in pagination) return res.status(400).json({ error: pagination.error });

      const conditions: any[] = [];
      if (clientId) conditions.push(eq(clientProjects.clientId, parseInt(clientId as string, 10)));
      if (status && status !== 'all') conditions.push(eq(clientProjects.status, status as string));

      let query = db.select().from(clientProjects);
      if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;

      const [result, [{ count }]] = await Promise.all([
        query.orderBy(desc(clientProjects.createdAt)).limit(pagination.limit).offset(pagination.offset),
        db.select({ count: sql`count(*)` }).from(clientProjects),
      ]);
      res.json({ data: result, total: Number(count) });
    } catch (error) {
      console.error('Client projects list error:', error);
      res.status(500).json({ error: 'Erreur récupération projets clients' });
    }
  });

  app.get('/api/admin/client-projects/:id', requireAuth, async (req, res) => {
    try {
      const pid = parseInt(req.params.id, 10);
      const [project] = await db.select().from(clientProjects).where(eq(clientProjects.id, pid)).limit(1);
      if (!project) return res.status(404).json({ error: 'Projet non trouvé' });
      const [milestones, documents] = await Promise.all([
        db.select().from(clientMilestones).where(eq(clientMilestones.projectId, pid)).orderBy(clientMilestones.order),
        db.select().from(clientDocuments).where(eq(clientDocuments.projectId, pid)).orderBy(clientDocuments.uploadedAt),
      ]);
      res.json({ ...project, milestones, documents });
    } catch (error) {
      res.status(500).json({ error: 'Erreur projet' });
    }
  });

  // Créer un projet client
  app.post('/api/admin/client-projects', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { clientId, title, type, status, progress, managerName, managerEmail, startDate, endDate, description } = req.body;
      if (!clientId || !title) return res.status(400).json({ error: 'clientId et title sont requis' });

      const [project] = await db.insert(clientProjects).values({
        clientId: parseInt(clientId, 10),
        title, type: type || 'Projet',
        status: status || 'en_cours',
        progress: progress ?? 0,
        managerName: managerName || null,
        managerEmail: managerEmail || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description: description || null,
      }).returning();

      res.status(201).json(project);
    } catch (error) {
      console.error('Create client project error:', error);
      res.status(500).json({ error: 'Erreur création projet client' });
    }
  });

  // Modifier un projet client
  app.put('/api/admin/client-projects/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { title, type, status, progress, managerName, managerEmail, startDate, endDate, description } = req.body;

      const [updated] = await db.update(clientProjects).set({
        title, type, status, progress,
        managerName: managerName || null,
        managerEmail: managerEmail || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description: description || null,
        updatedAt: new Date(),
      }).where(eq(clientProjects.id, id)).returning();

      if (!updated) return res.status(404).json({ error: 'Projet non trouvé' });
      res.json(updated);
    } catch (error) {
      console.error('Update client project error:', error);
      res.status(500).json({ error: 'Erreur mise à jour projet client' });
    }
  });

  // Supprimer un projet client
  app.delete('/api/admin/client-projects/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const pid = parseInt(req.params.id, 10);
      await Promise.all([
        db.delete(clientMilestones).where(eq(clientMilestones.projectId, pid)),
        db.delete(clientDocuments).where(eq(clientDocuments.projectId, pid)),
      ]);
      await db.delete(clientProjects).where(eq(clientProjects.id, pid));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression projet client' });
    }
  });

  // ========================================
  // ESPACE CLIENT — Jalons (admin)
  // ========================================

  app.get('/api/admin/client-projects/:projectId/milestones', requireAuth, async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const milestones = await db.select().from(clientMilestones)
        .where(eq(clientMilestones.projectId, projectId))
        .orderBy(clientMilestones.order);
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ error: 'Erreur jalons' });
    }
  });

  app.post('/api/admin/client-projects/:projectId/milestones', requireAuth, requireAdmin, async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const { label, dueDate, status, order } = req.body;
      if (!label) return res.status(400).json({ error: 'label requis' });
      const [milestone] = await db.insert(clientMilestones).values({
        projectId, label, dueDate: dueDate || null,
        status: status || 'pending', order: order ?? 0,
      }).returning();
      res.status(201).json(milestone);
    } catch (error) {
      res.status(500).json({ error: 'Erreur création jalon' });
    }
  });

  app.put('/api/admin/client-milestones/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { label, dueDate, status, order } = req.body;
      const [updated] = await db.update(clientMilestones)
        .set({ label, dueDate, status, order })
        .where(eq(clientMilestones.id, id)).returning();
      if (!updated) return res.status(404).json({ error: 'Jalon non trouvé' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour jalon' });
    }
  });

  app.delete('/api/admin/client-milestones/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await db.delete(clientMilestones).where(eq(clientMilestones.id, id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression jalon' });
    }
  });

  // ========================================
  // ESPACE CLIENT — Documents livrables (admin)
  // ========================================

  app.get('/api/admin/client-projects/:projectId/documents', requireAuth, async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const docs = await db.select().from(clientDocuments)
        .where(eq(clientDocuments.projectId, projectId))
        .orderBy(desc(clientDocuments.uploadedAt));
      res.json(docs);
    } catch (error) {
      res.status(500).json({ error: 'Erreur documents' });
    }
  });

  app.post('/api/admin/client-projects/:projectId/documents', requireAuth, requireAdmin, async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const { name, fileType, fileSize, url } = req.body;
      if (!name || !url) return res.status(400).json({ error: 'name et url requis' });
      const [doc] = await db.insert(clientDocuments).values({
        projectId, name, fileType: fileType || 'PDF', fileSize: fileSize || null, url,
      }).returning();
      res.status(201).json(doc);
    } catch (error) {
      res.status(500).json({ error: 'Erreur ajout document' });
    }
  });

  app.delete('/api/admin/client-documents/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await db.delete(clientDocuments).where(eq(clientDocuments.id, id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression document' });
    }
  });

  // ========================================
  // ESPACE CLIENT — Messages (admin → client)
  // ========================================

  app.get('/api/admin/client-projects/:projectId/messages', requireAuth, async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const messages = await db.select().from(clientMessagesTable)
        .where(eq(clientMessagesTable.projectId, projectId))
        .orderBy(clientMessagesTable.createdAt);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Erreur messages' });
    }
  });

  app.post('/api/admin/client-projects/:projectId/messages', requireAuth, async (req: AuthRequest, res) => {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const { clientId, content } = req.body;
      if (!clientId || !content?.trim()) return res.status(400).json({ error: 'clientId et content requis' });
      const parsedClientId = parseInt(clientId, 10);
      const [msg] = await db.insert(clientMessagesTable).values({
        projectId, clientId: parsedClientId,
        senderRole: 'agency', content: content.trim(), isRead: false,
      }).returning();
      res.status(201).json(msg);

      // Send email notification to client (non-blocking)
      Promise.all([
        db.select({ email: clientAccounts.email, name: clientAccounts.name })
          .from(clientAccounts).where(eq(clientAccounts.id, parsedClientId)).limit(1),
        db.select({ title: clientProjects.title })
          .from(clientProjects).where(eq(clientProjects.id, projectId)).limit(1),
      ]).then(([[client], [project]]) => {
        if (client && project) {
          sendAgencyMessageNotification({
            to: client.email, clientName: client.name,
            projectTitle: project.title, message: content.trim(),
          }).catch(e => console.error('[EMAIL] Agency message notification error:', e));
        }
      }).catch(() => {});
    } catch (error) {
      res.status(500).json({ error: 'Erreur envoi message' });
    }
  });

  // ========================================
  // QR CODES
  // ========================================

  app.get('/api/admin/qr-codes', requireAuth, async (req, res) => {
    try {
      const list = await db.select().from(qrCodes).orderBy(desc(qrCodes.createdAt));
      res.json({ data: list, total: list.length });
    } catch (error) {
      res.status(500).json({ error: 'Erreur récupération QR codes' });
    }
  });

  app.post('/api/admin/qr-codes', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { label, targetPath, utmSource, utmMedium, utmCampaign, utmContent } = req.body;
      if (!label || !targetPath || !utmSource || !utmMedium || !utmCampaign) {
        return res.status(400).json({ error: 'Champs obligatoires manquants' });
      }
      // Generate QR code SVG
      const QRCode = await import('qrcode');
      const baseUrl = process.env.SITE_URL ?? process.env.FRONTEND_URL ?? 'https://epitaphe360.com';
      const params = new URLSearchParams({
        utm_source: utmSource, utm_medium: utmMedium,
        utm_campaign: utmCampaign, ...(utmContent ? { utm_content: utmContent } : {}),
      });
      const fullUrl = `${baseUrl}${targetPath}?${params.toString()}`;
      const svgData = await QRCode.toString(fullUrl, { type: 'svg' });
      const [created] = await db.insert(qrCodes).values({
        label, targetPath, utmSource, utmMedium, utmCampaign, utmContent: utmContent ?? null, svgData,
      }).returning();
      res.status(201).json(created);
    } catch (error) {
      console.error('QR code create error:', error);
      res.status(500).json({ error: 'Erreur création QR code' });
    }
  });

  app.delete('/api/admin/qr-codes/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(qrCodes).where(eq(qrCodes.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression QR code' });
    }
  });
}

