require('dotenv').config();
const dns = require('dns');
const pg = require('postgres');
const pass = new URL(process.env.DATABASE_URL).password;
const ref = 'cdqehuagpytwqzawqoyh';

// Test 1: check if base hostname has A records (IPv4)
const hosts = [
  `${ref}.supabase.co`,
  `${ref}.pooler.supabase.com`,
  `db.${ref}.supabase.co`,
];
hosts.forEach(h => {
  dns.resolve4(h, (e, a) => {
    console.log(`A  ${h}: ${e ? 'NONE' : a.join(',')}`);
  });
  dns.resolve6(h, (e, a) => {
    console.log(`AAAA ${h}: ${e ? 'NONE' : a.join(',')}`);
  });
});

// Test 2: try pooler with port 5432 (session mode) on eu-west-1 (matches IPv6 prefix 2a05:d012)
setTimeout(() => {
  const urls = [
    { label: 'pooler-6543-session', url: `postgresql://postgres.${ref}:${pass}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres` },
    { label: 'pooler-5432-session', url: `postgresql://postgres.${ref}:${pass}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres` },
    { label: 'base-5432', url: `postgresql://postgres:${pass}@${ref}.supabase.co:5432/postgres` },
    { label: 'base-6543', url: `postgresql://postgres.${ref}:${pass}@${ref}.supabase.co:6543/postgres` },
  ];
  let done = 0;
  urls.forEach(({label, url}) => {
    const sql = pg(url, { ssl: { rejectUnauthorized: false }, connect_timeout: 10, max: 1, prepare: false });
    sql`SELECT 1 as ok`.then(res => {
      console.log(`${label}: OK!`, JSON.stringify(res));
      sql.end(); done++; if(done>=urls.length) process.exit(0);
    }).catch(e => {
      console.log(`${label}: FAIL`, e.message.substring(0, 120));
      sql.end().catch(()=>{}); done++; if(done>=urls.length) process.exit(0);
    });
  });
}, 3000);
