-- ========================================
-- EPITAPHE v1 - CORRECTION COLONNES MANQUANTES
-- ========================================

-- Ajouter les colonnes manquantes aux tables existantes

-- Pour la table articles
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id),
ADD COLUMN IF NOT EXISTS template VARCHAR(50) DEFAULT 'STANDARD',
ADD COLUMN IF NOT EXISTS template_data JSONB,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Créer les index manquants pour articles
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);

-- Pour la table events
ALTER TABLE events
ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id),
ADD COLUMN IF NOT EXISTS template VARCHAR(50) DEFAULT 'CONFERENCE',
ADD COLUMN IF NOT EXISTS template_data JSONB,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS latitude TEXT,
ADD COLUMN IF NOT EXISTS longitude TEXT,
ADD COLUMN IF NOT EXISTS capacity INTEGER,
ADD COLUMN IF NOT EXISTS registered_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS price INTEGER,
ADD COLUMN IF NOT EXISTS registration_url TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Créer les index manquants pour events
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);

-- Pour la table pages
ALTER TABLE pages
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS template VARCHAR(50) DEFAULT 'DEFAULT',
ADD COLUMN IF NOT EXISTS sections JSONB,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS show_in_menu BOOLEAN DEFAULT TRUE;

-- Pour la table categories
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS color VARCHAR(7),
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS parent_id UUID,
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Créer les index manquants pour categories
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- Pour la table users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Créer les index manquants pour users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Créer les triggers s'ils n'existent pas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer les triggers s'ils n'existent pas
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer l'utilisateur admin s'il n'existe pas
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@epitaph.ma',
  '$2b$10$rVzqS8.gX9gZG8sMEqoGa.1Gfz7R5QzxY0K8HZOY2L4YQz9KHxGZK',
  'Administrateur',
  'ADMIN'
)
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- SUCCESS
-- ========================================

SELECT '✅ Correction complétée - Colonnes manquantes ajoutées avec succès!' as status;
