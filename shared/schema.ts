import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, json, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ========================================
// USERS & AUTHENTICATION
// ========================================

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: varchar("role", { length: 20 }).notNull().default('USER'), // ADMIN, EDITOR, AUTHOR, USER
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ========================================
// CATEGORIES
// ========================================

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 7 }), // HEX color
  icon: text("icon"),
  parentId: varchar("parent_id"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// ========================================
// ARTICLES
// ========================================

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  featuredImage: text("featured_image"),

  // Template support
  template: varchar("template", { length: 50 }).default('STANDARD'),
  templateData: json("template_data"), // Store template-specific data as JSON

  // Publishing
  status: varchar("status", { length: 20 }).notNull().default('DRAFT'), // DRAFT, PUBLISHED, ARCHIVED
  publishedAt: timestamp("published_at"),

  // Relationships
  authorId: varchar("author_id").references(() => users.id),
  categoryId: varchar("category_id").references(() => categories.id),

  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),

  // Metadata
  tags: text("tags").array(),
  views: integer("views").default(0),
  featured: boolean("featured").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// ========================================
// EVENTS
// ========================================

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  content: text("content"),
  featuredImage: text("featured_image"),

  // Template support
  template: varchar("template", { length: 50 }).default('CONFERENCE'),
  templateData: json("template_data"),

  // Event details
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location"),
  address: text("address"),
  latitude: text("latitude"),
  longitude: text("longitude"),

  // Registration
  capacity: integer("capacity"),
  registeredCount: integer("registered_count").default(0),
  price: integer("price"), // Price in cents (MAD)
  registrationUrl: text("registration_url"),

  // Publishing
  status: varchar("status", { length: 20 }).notNull().default('DRAFT'), // DRAFT, PUBLISHED, CANCELLED

  // Relationships
  organizerId: varchar("organizer_id").references(() => users.id),
  categoryId: varchar("category_id").references(() => categories.id),

  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),

  // Metadata
  tags: text("tags").array(),
  featured: boolean("featured").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  registeredCount: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// ========================================
// PAGES
// ========================================

export const pages = pgTable("pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),

  // Page-specific
  template: varchar("template", { length: 50 }).default('DEFAULT'),
  sections: json("sections"), // Store page sections/blocks as JSON

  // Publishing
  status: varchar("status", { length: 20 }).notNull().default('DRAFT'),
  publishedAt: timestamp("published_at"),

  // Relationships
  authorId: varchar("author_id").references(() => users.id),
  parentId: varchar("parent_id"), // For hierarchical pages

  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),

  // Metadata
  order: integer("order").default(0),
  showInMenu: boolean("show_in_menu").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;

// ========================================
// MEDIA
// ========================================

export const media = pgTable("media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(), // Size in bytes
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),

  // Metadata
  alt: text("alt"),
  caption: text("caption"),
  title: text("title"),
  description: text("description"),

  // Dimensions (for images)
  width: integer("width"),
  height: integer("height"),

  // Relationships
  uploadedBy: varchar("uploaded_by").references(() => users.id),

  // Organization
  folder: text("folder").default('/'),
  tags: text("tags").array(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

// ========================================
// NAVIGATION MENUS
// ========================================

export const navigationMenus = pgTable("navigation_menus", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  location: varchar("location", { length: 50 }), // header, footer, sidebar, etc.
  items: json("items").notNull(), // Store menu structure as JSON
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertNavigationMenuSchema = createInsertSchema(navigationMenus).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNavigationMenu = z.infer<typeof insertNavigationMenuSchema>;
export type NavigationMenu = typeof navigationMenus.$inferSelect;

// ========================================
// SITE SETTINGS
// ========================================

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: json("value"),
  group: varchar("group", { length: 50 }), // general, seo, social, integrations, etc.
  type: varchar("type", { length: 20 }).default('string'), // string, number, boolean, json
  isPublic: boolean("is_public").default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;

// ========================================
// CONTACT MESSAGES (Legacy - kept for compatibility)
// ========================================

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  function: text("function").notNull(),
  company: text("company").notNull(),
  countryCode: text("country_code").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).default('NEW'), // NEW, READ, REPLIED, ARCHIVED
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  status: true,
  createdAt: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// ========================================
// AUDIT LOGS (for tracking changes)
// ========================================

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: varchar("action", { length: 50 }).notNull(), // CREATE, UPDATE, DELETE
  entityType: varchar("entity_type", { length: 50 }).notNull(), // article, event, page, etc.
  entityId: varchar("entity_id").notNull(),
  changes: json("changes"), // Store what changed
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// ========================================
// NEWSLETTER SUBSCRIPTIONS
// ========================================

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  status: varchar("status", { length: 20 }).notNull().default('ACTIVE'), // ACTIVE, UNSUBSCRIBED, BOUNCED
  source: varchar("source", { length: 50 }).default('WEBSITE'), // WEBSITE, IMPORT, API
  tags: text("tags").array(),
  metadata: json("metadata"), // Additional custom data
  confirmedAt: timestamp("confirmed_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  status: true,
  confirmedAt: true,
  unsubscribedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;

// ========================================
// PROJECT BRIEFS (Configurateur)
// ========================================

export const projectBriefs = pgTable("project_briefs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // Contact Info
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  position: text("position"),

  // Project Details
  projectType: varchar("project_type", { length: 100 }), // Site vitrine, E-commerce, Application web, etc.
  projectName: text("project_name"),
  projectDescription: text("project_description"),

  // Budget & Timeline
  budget: varchar("budget", { length: 50 }), // Range: <5k, 5-10k, 10-25k, 25-50k, >50k
  timeline: varchar("timeline", { length: 50 }), // Range: <1 month, 1-3 months, 3-6 months, >6 months

  // Features & Requirements
  features: text("features").array(), // Array of selected features
  requirements: text("requirements"), // Additional requirements text

  // Design Preferences
  designStyle: varchar("design_style", { length: 50 }), // Modern, Classic, Minimal, Bold, etc.
  referenceUrls: text("reference_urls").array(), // Inspiration websites

  // Technical Requirements
  technologies: text("technologies").array(), // Preferred technologies
  integrations: text("integrations").array(), // Required integrations (CRM, ERP, etc.)

  // Additional Data
  metadata: json("metadata"), // Any additional JSON data from configurator

  // Status
  status: varchar("status", { length: 20 }).notNull().default('NEW'), // NEW, CONTACTED, IN_PROGRESS, QUOTED, WON, LOST
  priority: varchar("priority", { length: 20 }).default('MEDIUM'), // LOW, MEDIUM, HIGH, URGENT

  // Assignment
  assignedTo: varchar("assigned_to").references(() => users.id),

  // Notes
  internalNotes: text("internal_notes"),

  // Tracking
  source: varchar("source", { length: 50 }).default('CONFIGURATOR'), // CONFIGURATOR, WEBSITE, REFERRAL
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProjectBriefSchema = createInsertSchema(projectBriefs).omit({
  id: true,
  status: true,
  priority: true,
  assignedTo: true,
  internalNotes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProjectBrief = z.infer<typeof insertProjectBriefSchema>;
export type ProjectBrief = typeof projectBriefs.$inferSelect;
