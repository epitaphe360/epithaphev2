require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  // Migration 018
  try {
    const sql018 = fs.readFileSync('migrations/018_seed_hub_pages.sql', 'utf8');
    await pool.query(sql018);
    console.log('018 OK');
  } catch(e) { console.log('018 ERR:', e.message); }

  // Migration 020
  try {
    const sql020 = fs.readFileSync('migrations/020_seed_all_pages_full_seo.sql', 'utf8');
    await pool.query(sql020);
    console.log('020 OK');
  } catch(e) { console.log('020 ERR:', e.message); }

  // Verification
  const check = await pool.query(
    "SELECT slug, left(title,30) AS title, left(meta_title,45) AS meta_title, " +
    "CASE WHEN featured_image IS NOT NULL AND featured_image != '' THEN 'OUI' ELSE 'NON' END AS has_image, " +
    "template, status FROM pages WHERE status = 'PUBLISHED' ORDER BY \"order\" NULLS LAST, slug"
  );
  console.log('\n=== PAGES EN BASE ===');
  check.rows.forEach(r => console.log(
    r.slug.padEnd(45), '|', r.has_image, '|', r.template.padEnd(12), '|', (r.meta_title || '').substring(0, 40)
  ));
  console.log('Total:', check.rows.length, 'pages PUBLISHED');
  pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
