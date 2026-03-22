-- Migration: Espace Client tables
-- client_accounts, client_projects, client_milestones, client_documents, client_messages

CREATE TABLE IF NOT EXISTS client_accounts (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS client_projects (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'Projet',
  status VARCHAR(30) DEFAULT 'en_cours',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  manager_name TEXT,
  manager_email TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS client_milestones (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  due_date TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS client_documents (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_type VARCHAR(20) DEFAULT 'PDF',
  file_size TEXT,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS client_messages (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
  client_id INTEGER NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  sender_role VARCHAR(20) DEFAULT 'client',
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Index pour les lookups fréquents
CREATE INDEX IF NOT EXISTS idx_client_projects_client_id ON client_projects(client_id);
CREATE INDEX IF NOT EXISTS idx_client_milestones_project_id ON client_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_project_id ON client_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_project_id ON client_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_client_id ON client_messages(client_id);
