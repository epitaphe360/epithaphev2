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

// ========================================
// SERVICES (Hubs métiers)
// ========================================

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  hub: varchar("hub", { length: 100 }).notNull().default('evenements'),
  // hub values: evenements | architecture-de-marque | la-fabrique | qhse
  accroche: text("accroche"),
  heroImage: text("hero_image"),
  heroVideo: text("hero_video"),
  body: text("body"),                      // HTML/Markdown content
  serviceBlocks: json("service_blocks"),   // [{ icon, title, description }]
  advantageFabrique: json("advantage_fabrique"), // { text, link }
  status: varchar("status", { length: 20 }).notNull().default('DRAFT'),
  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  openGraphImage: text("open_graph_image"),
  featured: boolean("featured").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// ========================================
// CLIENT REFERENCES
// ========================================

export const clientReferences = pgTable("client_references", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),                       // URL de l'image logo
  sectors: text("sectors").array(),         // ['Industrie', 'Santé', ...]
  description: text("description"),
  projectDescription: text("project_description"),
  caseStudyUrl: text("case_study_url"),
  website: text("website"),
  isFeatured: boolean("is_featured").default(false),
  order: integer("order").default(0),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertClientReferenceSchema = createInsertSchema(clientReferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertClientReference = z.infer<typeof insertClientReferenceSchema>;
export type ClientReference = typeof clientReferences.$inferSelect;

// ========================================
// CASE STUDIES (Études de cas)
// ========================================

export const caseStudies = pgTable("case_studies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  clientId: varchar("client_id").references(() => clientReferences.id),
  clientName: text("client_name"),   // Dénormalisé pour performance
  problem: text("problem"),          // Problématique
  solution: text("solution"),        // Solution Epitaphe
  results: text("results"),          // Résultats obtenus
  kpis: json("kpis"),               // [{ value: '+32%', label: 'NPS', icon: 'trending-up' }]
  gallery: json("gallery"),          // [{ image, caption }]
  relatedServiceSlugs: text("related_service_slugs").array(),
  featuredImage: text("featured_image"),
  status: varchar("status", { length: 20 }).notNull().default('DRAFT'),
  isFeatured: boolean("is_featured").default(false),
  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  openGraphImage: text("open_graph_image"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCaseStudySchema = createInsertSchema(caseStudies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type CaseStudy = typeof caseStudies.$inferSelect;

// ========================================
// TESTIMONIALS (Témoignages)
// ========================================

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quote: text("quote").notNull(),
  authorName: text("author_name").notNull(),
  authorTitle: text("author_title"),
  companyName: text("company_name"),
  companyLogo: text("company_logo"),
  rating: integer("rating").default(5),          // 1-5
  serviceSlug: text("service_slug"),              // Témoignage lié à un service
  caseStudyId: varchar("case_study_id").references(() => caseStudies.id),
  isPublished: boolean("is_published").default(false),
  isFeatured: boolean("is_featured").default(false),
  date: timestamp("date"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// ========================================
// TEAM MEMBERS (Équipe Agence)
// ========================================

export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  bio: text("bio"),
  photo: text("photo"),                          // URL de la photo
  email: text("email"),
  socialLinks: json("social_links"),             // [{ platform: 'LinkedIn', url: '...' }]
  isPublished: boolean("is_published").default(true),
  order: integer("order").default(0),
  department: varchar("department", { length: 100 }),
  // Possible values: Direction | Création | Production | Commercial | QHSE
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

// ========================================
// ESPACE CLIENT — Comptes clients
// ========================================

export const clientAccounts = pgTable("client_accounts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  company: text("company"),
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertClientAccountSchema = createInsertSchema(clientAccounts).omit({
  id: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertClientAccount = z.infer<typeof insertClientAccountSchema>;
export type ClientAccount = typeof clientAccounts.$inferSelect;

// ========================================
// ESPACE CLIENT — Projets clients
// ========================================

export const clientProjects = pgTable("client_projects", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clientAccounts.id).notNull(),
  title: text("title").notNull(),
  type: text("type").default("Projet"), // Événement corporate, Signalétique, etc.
  status: varchar("status", { length: 30 }).default("en_cours"), // en_cours | en_attente | termine | en_pause
  progress: integer("progress").default(0),      // 0-100
  managerName: text("manager_name"),
  managerEmail: text("manager_email"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertClientProjectSchema = createInsertSchema(clientProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertClientProject = z.infer<typeof insertClientProjectSchema>;
export type ClientProject = typeof clientProjects.$inferSelect;

// ========================================
// ESPACE CLIENT — Jalons / Milestones
// ========================================

export const clientMilestones = pgTable("client_milestones", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => clientProjects.id).notNull(),
  label: text("label").notNull(),
  dueDate: text("due_date"),          // Label texte affiché ex: "15 Mar"
  status: varchar("status", { length: 20 }).default("pending"), // done | active | pending
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClientMilestoneSchema = createInsertSchema(clientMilestones).omit({
  id: true,
  createdAt: true,
});
export type InsertClientMilestone = z.infer<typeof insertClientMilestoneSchema>;
export type ClientMilestone = typeof clientMilestones.$inferSelect;

// ========================================
// ESPACE CLIENT — Documents / livrables
// ========================================

export const clientDocuments = pgTable("client_documents", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => clientProjects.id).notNull(),
  name: text("name").notNull(),
  fileType: varchar("file_type", { length: 20 }).default("PDF"),
  fileSize: text("file_size"),         // "1.2 Mo"
  url: text("url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const insertClientDocumentSchema = createInsertSchema(clientDocuments).omit({
  id: true,
  uploadedAt: true,
});
export type InsertClientDocument = z.infer<typeof insertClientDocumentSchema>;
export type ClientDocument = typeof clientDocuments.$inferSelect;

// ========================================
// ESPACE CLIENT — Messages client ↔ agence
// ========================================

export const clientMessages = pgTable("client_messages", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => clientProjects.id).notNull(),
  clientId: integer("client_id").references(() => clientAccounts.id).notNull(),
  senderRole: varchar("sender_role", { length: 20 }).default("client"), // client | agency
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClientMessageSchema = createInsertSchema(clientMessages).omit({
  id: true,
  createdAt: true,
});
export type InsertClientMessage = z.infer<typeof insertClientMessageSchema>;
export type ClientMessage = typeof clientMessages.$inferSelect;

// ============================================================
// PHASE 2 — PUSH NOTIFICATIONS
// ============================================================

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: serial("id").primaryKey(),
  clientAccountId: integer("client_account_id").references(() => clientAccounts.id),
  endpoint: text("endpoint").notNull().unique(),
  keysP256dh: text("keys_p256dh").notNull(),
  keysAuth: text("keys_auth").notNull(),
  // Catégories activées : project_update | new_case_study | event_invitation | report_ready | newsletter
  categories: json("categories").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).omit({
  id: true,
  createdAt: true,
});
export type InsertPushSubscription = z.infer<typeof insertPushSubscriptionSchema>;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;

// ============================================================
// PHASE 2 — WEBAUTHN / FIDO2 CREDENTIALS
// ============================================================

export const webauthnCredentials = pgTable("webauthn_credentials", {
  id: serial("id").primaryKey(),
  clientAccountId: integer("client_account_id").references(() => clientAccounts.id).notNull(),
  credentialId: text("credential_id").notNull().unique(),          // base64url
  publicKey: text("public_key").notNull(),                         // base64url encoded COSE key
  counter: integer("counter").notNull().default(0),               // replay protection
  deviceName: text("device_name").default("Appareil inconnu"),    // ex: "iPhone Face ID"
  aaguid: text("aaguid"),                                         // authenticator AAGUID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at"),
});

export const insertWebauthnCredentialSchema = createInsertSchema(webauthnCredentials).omit({
  id: true,
  createdAt: true,
  lastUsedAt: true,
});
export type InsertWebauthnCredential = z.infer<typeof insertWebauthnCredentialSchema>;
export type WebauthnCredential = typeof webauthnCredentials.$inferSelect;

// ============================================================
// PHASE 2 — QR CODES avec UTM Deep Linking
// ============================================================

export const qrCodes = pgTable("qr_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  label: text("label").notNull(),                                  // ex: "Salon Gitex 2025 - Stand B12"
  targetPath: text("target_path").notNull(),                       // ex: "/evenements/salons"
  utmSource: varchar("utm_source", { length: 100 }).notNull(),    // ex: "qrcode"
  utmMedium: varchar("utm_medium", { length: 100 }).notNull(),    // ex: "print"
  utmCampaign: varchar("utm_campaign", { length: 200 }).notNull(),// ex: "gitex-2025"
  utmContent: varchar("utm_content", { length: 200 }),            // ex: "stand-b12"
  svgData: text("svg_data"),                                       // SVG string généré
  isActive: boolean("is_active").default(true),
  scanCount: integer("scan_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQrCodeSchema = createInsertSchema(qrCodes).omit({
  id: true,
  svgData: true,
  scanCount: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertQrCode = z.infer<typeof insertQrCodeSchema>;
export type QrCode = typeof qrCodes.$inferSelect;

// ============================================================
// PHASE 2 — WEBAUTHN CHALLENGES (sessions temporaires)
// ============================================================

export const webauthnChallenges = pgTable("webauthn_challenges", {
  id: serial("id").primaryKey(),
  clientAccountId: integer("client_account_id").references(() => clientAccounts.id).notNull(),
  challenge: text("challenge").notNull(),
  type: varchar("type", { length: 20 }).default("register"), // register | authenticate
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWebauthnChallengeSchema = createInsertSchema(webauthnChallenges).omit({
  id: true,
  createdAt: true,
});
export type InsertWebauthnChallenge = z.infer<typeof insertWebauthnChallengeSchema>;
export type WebauthnChallenge = typeof webauthnChallenges.$inferSelect;

// ============================================================
// PHASE 2 — RESSOURCES CLIENTS (CDC 6.5)
// Base de connaissances : guides, modèles, études de cas
// ============================================================

export const resources = pgTable("resources", {
  id:          serial("id").primaryKey(),
  title:       text("title").notNull(),
  description: text("description"),
  category:    varchar("category", { length: 80 }).notNull().default("guide"),
  // guide | modele | etude_de_cas | fiche_technique | video | webinaire
  format:      varchar("format", { length: 30 }).default("PDF"),
  // PDF | DOCX | XLS | VIDEO | LINK
  fileSize:    varchar("file_size", { length: 20 }),
  downloadUrl: text("download_url"),
  thumbnailUrl:text("thumbnail_url"),
  accessLevel: varchar("access_level", { length: 20 }).default("client"),
  // public | lead | client
  tags:        json("tags").$type<string[]>().default([]),
  isNew:       boolean("is_new").default(false),
  isPublished: boolean("is_published").default(true),
  sortOrder:   integer("sort_order").default(0),
  downloadCount: integer("download_count").default(0),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
  updatedAt:   timestamp("updated_at").defaultNow().notNull(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  downloadCount: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
