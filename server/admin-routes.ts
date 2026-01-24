import type { Express } from "express";
import { db } from "./db";
import {
  users, articles, events, pages, categories, media, navigationMenus, settings, auditLogs,
  insertArticleSchema, insertEventSchema, insertPageSchema
} from "@shared/schema";
import { eq, desc, and, or, like, sql } from "drizzle-orm";
import { requireAuth, requireAdmin, generateToken, hashPassword, verifyPassword, type AuthRequest } from "./lib/auth";
import { z } from "zod";

/**
 * Sanitize a search string for use in SQL LIKE patterns
 * Escapes special SQL LIKE characters: %, _, \
 */
function sanitizeLikePattern(input: string): string {
  if (!input) return '';
  return input.replace(/[%_\\]/g, '\\$&');
}

/**
 * Validate password strength
 * Requirements:
 * - At least 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Le mot de passe est requis' };
  }

  if (password.length < 12) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins 12 caractères' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins une lettre majuscule' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins une lettre minuscule' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins un chiffre' };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins un caractère spécial' };
  }

  return { valid: true };
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

  if (isNaN(offsetNum) || offsetNum < 0) {
    return { error: 'Invalid offset parameter. Must be a non-negative number.' };
  }

  return { limit: limitNum, offset: offsetNum };
}

export function registerAdminRoutes(app: Express) {

  // ========================================
  // AUTHENTICATION
  // ========================================

  // Login
  app.post('/api/admin/login', async (req, res) => {
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
  app.post('/api/admin/articles', requireAuth, async (req: AuthRequest, res) => {
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
  app.put('/api/admin/articles/:id', requireAuth, async (req: AuthRequest, res) => {
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
  app.delete('/api/admin/articles/:id', requireAuth, async (req: AuthRequest, res) => {
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
  app.post('/api/admin/events', requireAuth, async (req: AuthRequest, res) => {
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
  app.put('/api/admin/events/:id', requireAuth, async (req: AuthRequest, res) => {
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
  app.delete('/api/admin/events/:id', requireAuth, async (req: AuthRequest, res) => {
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
  app.post('/api/admin/categories', requireAuth, async (req, res) => {
    try {
      const [newCategory] = await db.insert(categories).values(req.body).returning();
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la catégorie' });
    }
  });

  // Update category
  app.put('/api/admin/categories/:id', requireAuth, async (req, res) => {
    try {
      const [updated] = await db.update(categories)
        .set(req.body)
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
  app.delete('/api/admin/categories/:id', requireAuth, async (req, res) => {
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
  app.post('/api/admin/pages', requireAuth, async (req: AuthRequest, res) => {
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
  app.put('/api/admin/pages/:id', requireAuth, async (req, res) => {
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
  app.delete('/api/admin/pages/:id', requireAuth, async (req, res) => {
    try {
      await db.delete(pages).where(eq(pages.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('Delete page error:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de la page' });
    }
  });

  // ========================================
  // AUDIT LOGS (Admin only)
  // ========================================

  app.get('/api/admin/audit-logs', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { entityType, entityId, userId, limit, offset } = req.query;

      // Validate pagination parameters (default limit for audit logs is 100)
      const pagination = validatePagination(limit as string || '100', offset as string);
      if ('error' in pagination) {
        return res.status(400).json({ error: pagination.error });
      }

      const conditions: any[] = [];
      if (entityType) {
        conditions.push(eq(auditLogs.entityType, entityType as string));
      }
      if (entityId) {
        conditions.push(eq(auditLogs.entityId, entityId as string));
      }
      if (userId) {
        conditions.push(eq(auditLogs.userId, userId as string));
      }

      let query = db.select().from(auditLogs);
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }

      const result = await query
        .orderBy(desc(auditLogs.createdAt))
        .limit(pagination.limit)
        .offset(pagination.offset);

      res.json(result);
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des logs' });
    }
  });
}
