-- 011_add_missing_indexes.sql
-- UP: Add missing indexes for foreign key columns to improve query performance
-- These indexes support WHERE/JOIN clauses used in admin and client portal routes.

CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_pages_author ON pages(author_id);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_project_briefs_assigned_to ON project_briefs(assigned_to);
CREATE INDEX IF NOT EXISTS idx_case_studies_client_id ON case_studies(client_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_case_study_id ON testimonials(case_study_id);
CREATE INDEX IF NOT EXISTS idx_client_subscriptions_client_id ON client_subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_client_subscriptions_plan_id ON client_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_devis_client_id ON devis(client_id);
CREATE INDEX IF NOT EXISTS idx_devis_reference ON devis(reference);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_devis_id ON payments(devis_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);

-- Indexes for common slug/status lookups
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_slug ON subscription_plans(slug);

-- ROLLBACK:
-- DROP INDEX IF EXISTS idx_events_organizer;
-- DROP INDEX IF EXISTS idx_events_category;
-- DROP INDEX IF EXISTS idx_pages_author;
-- DROP INDEX IF EXISTS idx_media_uploaded_by;
-- DROP INDEX IF EXISTS idx_project_briefs_assigned_to;
-- DROP INDEX IF EXISTS idx_case_studies_client_id;
-- DROP INDEX IF EXISTS idx_testimonials_case_study_id;
-- DROP INDEX IF EXISTS idx_client_subscriptions_client_id;
-- DROP INDEX IF EXISTS idx_client_subscriptions_plan_id;
-- DROP INDEX IF EXISTS idx_devis_client_id;
-- DROP INDEX IF EXISTS idx_devis_reference;
-- DROP INDEX IF EXISTS idx_payments_client_id;
-- DROP INDEX IF EXISTS idx_payments_devis_id;
-- DROP INDEX IF EXISTS idx_payments_subscription_id;
-- DROP INDEX IF EXISTS idx_pages_slug;
-- DROP INDEX IF EXISTS idx_articles_slug;
-- DROP INDEX IF EXISTS idx_services_slug;
-- DROP INDEX IF EXISTS idx_subscription_plans_slug;
