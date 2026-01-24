-- ========================================
-- EPITAPHE v1 - MIGRATION INITIALE
-- Script SQL à exécuter manuellement dans Supabase Dashboard
-- ========================================

-- DROP existing tables if needed (WARNING: This will delete all data!)
-- Uncomment only if you want to start fresh
-- DROP TABLE IF EXISTS audit_logs CASCADE;
-- DROP TABLE IF EXISTS contact_messages CASCADE;
-- DROP TABLE IF EXISTS settings CASCADE;
-- DROP TABLE IF EXISTS navigation_menus CASCADE;
-- DROP TABLE IF EXISTS media CASCADE;
-- DROP TABLE IF EXISTS pages CASCADE;
-- DROP TABLE IF EXISTS events CASCADE;
-- DROP TABLE IF EXISTS articles CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ========================================
-- USERS & AUTHENTICATION
-- ========================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'USER',
  avatar TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ========================================
-- CATEGORIES
-- ========================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  icon TEXT,
  parent_id UUID,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- ========================================
-- ARTICLES
-- ========================================

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,

  -- Template support
  template VARCHAR(50) DEFAULT 'STANDARD',
  template_data JSONB,

  -- Publishing
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  published_at TIMESTAMP,

  -- Relationships
  author_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,

  -- Metadata
  tags TEXT[],
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);

-- ========================================
-- EVENTS
-- ========================================

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT,
  featured_image TEXT,

  -- Template support
  template VARCHAR(50) DEFAULT 'CONFERENCE',
  template_data JSONB,

  -- Event details
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  location TEXT,
  address TEXT,
  latitude TEXT,
  longitude TEXT,

  -- Registration
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  price INTEGER,
  registration_url TEXT,

  -- Publishing
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',

  -- Relationships
  organizer_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Metadata
  tags TEXT[],
  featured BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);

-- ========================================
-- PAGES
-- ========================================

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,

  -- Page-specific
  template VARCHAR(50) DEFAULT 'DEFAULT',
  sections JSONB,

  -- Publishing
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  published_at TIMESTAMP,

  -- Relationships
  author_id UUID REFERENCES users(id),
  parent_id UUID,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Metadata
  "order" INTEGER DEFAULT 0,
  show_in_menu BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_parent ON pages(parent_id);

-- ========================================
-- MEDIA
-- ========================================

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,

  -- Metadata
  alt TEXT,
  caption TEXT,
  title TEXT,
  description TEXT,

  -- Dimensions
  width INTEGER,
  height INTEGER,

  -- Relationships
  uploaded_by UUID REFERENCES users(id),

  -- Organization
  folder TEXT DEFAULT '/',
  tags TEXT[],

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_uploader ON media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);

-- ========================================
-- NAVIGATION MENUS
-- ========================================

CREATE TABLE IF NOT EXISTS navigation_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location VARCHAR(50),
  items JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nav_menus_slug ON navigation_menus(slug);
CREATE INDEX IF NOT EXISTS idx_nav_menus_location ON navigation_menus(location);

-- ========================================
-- SITE SETTINGS
-- ========================================

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  "group" VARCHAR(50),
  type VARCHAR(20) DEFAULT 'string',
  is_public BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_group ON settings("group");

-- ========================================
-- CONTACT MESSAGES
-- ========================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  function TEXT NOT NULL,
  company TEXT NOT NULL,
  country_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'NEW',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at);

-- ========================================
-- AUDIT LOGS
-- ========================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR NOT NULL,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- ========================================
-- SEED DATA - Admin User
-- ========================================

-- Create default admin user
-- Password is 'admin123' hashed with bcrypt (10 rounds)
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@epitaph.ma',
  '$2b$10$rVzqS8.gX9gZG8sMEqoGa.1Gfz7R5QzxY0K8HZOY2L4YQz9KHxGZK',
  'Administrateur',
  'ADMIN'
)
ON CONFLICT (email) DO NOTHING;

-- Create default categories
INSERT INTO categories (name, slug, description, color)
VALUES
  ('Actualités', 'actualites', 'Dernières nouvelles et actualités', '#3B82F6'),
  ('Tutoriels', 'tutoriels', 'Guides et tutoriels pratiques', '#10B981'),
  ('Événements', 'evenements', 'Événements et conférences', '#F59E0B'),
  ('Études de cas', 'etudes-de-cas', 'Études de cas clients', '#8B5CF6')
ON CONFLICT (slug) DO NOTHING;

-- Create default navigation menu
INSERT INTO navigation_menus (name, slug, location, items, is_active)
VALUES (
  'Navigation principale',
  'main-nav',
  'header',
  '[
    {"id": "1", "label": "Accueil", "href": "/", "order": 1},
    {"id": "2", "label": "Blog", "href": "/blog", "order": 2},
    {"id": "3", "label": "Événements", "href": "/evenements", "order": 3},
    {"id": "4", "label": "À propos", "href": "/a-propos", "order": 4},
    {"id": "5", "label": "Contact", "href": "/contact", "order": 5}
  ]'::jsonb,
  TRUE
)
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nav_menus_updated_at BEFORE UPDATE ON navigation_menus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration completed successfully!';
    RAISE NOTICE 'Default admin user created:';
    RAISE NOTICE '  Email: admin@epitaph.ma';
    RAISE NOTICE '  Password: admin123';
    RAISE NOTICE '  ⚠️  IMPORTANT: Change the admin password after first login!';
END $$;
