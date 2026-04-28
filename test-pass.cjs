require("dotenv").config();
const pg = require("postgres");
const ref = "cdqehuagpytwqzawqoyh";
const pass = "xheUMcplcbrmHQfr";

const tests = [
  { label: "pooler eu-west-3 :6543", url: "postgresql://postgres." + ref + ":" + pass + "@aws-0-eu-west-3.pooler.supabase.com:6543/postgres", sni: null },
  { label: "pooler eu-west-3 :5432", url: "postgresql://postgres." + ref + ":" + pass + "@aws-0-eu-west-3.pooler.supabase.com:5432/postgres", sni: null },
  { label: "pooler IP1 sni",         url: "postgresql://postgres." + ref + ":" + pass + "@15.188.134.6:6543/postgres", sni: "aws-0-eu-west-3.pooler.supabase.com" },
  { label: "pooler IP2 sni",         url: "postgresql://postgres." + ref + ":" + pass + "@13.39.9.193:6543/postgres", sni: "aws-0-eu-west-3.pooler.supabase.com" },
  { label: "supabase.co :6543",      url: "postgresql://postgres:" + pass + "@" + ref + ".supabase.co:6543/postgres", sni: null },
];

// Test IPv6 séparément (postgres.js via host/port options)
(function testIPv6() {
  try {
    var sql6 = pg({ host: "2a05:d012:42e:5701:4d4f:46e8:58ed:fd52", port: 5432, user: "postgres", password: pass, database: "postgres", ssl: { rejectUnauthorized: false }, connect_timeout: 10, max: 1, prepare: false });
    sql6`SELECT 1 as ok`.then(function() {
      console.log("OK: direct IPv6 :5432");
      sql6.end().catch(function(){});
    }).catch(function(e) {
      console.log("FAIL: direct IPv6 :5432 -> " + e.message.substring(0, 100));
      sql6.end().catch(function(){});
    });
  } catch(e) { console.log("FAIL: direct IPv6 init -> " + e.message); }
})();

var done = 0;
tests.forEach(function(t) {
  var ssl = t.sni ? { rejectUnauthorized: false, servername: t.sni } : { rejectUnauthorized: false };
  var sql = pg(t.url, { ssl: ssl, connect_timeout: 10, max: 1, prepare: false });
  sql`SELECT 1 as ok`.then(function() {
    console.log("OK: " + t.label + " -> " + t.url.replace(pass, "***"));
    sql.end().catch(function(){});
  }).catch(function(e) {
    console.log("FAIL: " + t.label + " -> " + e.message.substring(0, 100));
    sql.end().catch(function(){});
  }).finally(function() {
    done++;
    if (done >= tests.length) setTimeout(function() { process.exit(0); }, 2000);
  });
});

var done = 0;
tests.forEach(function(t) {
  var ssl = t.sni ? { rejectUnauthorized: false, servername: t.sni } : { rejectUnauthorized: false };
  var sql = pg(t.url, { ssl: ssl, connect_timeout: 10, max: 1, prepare: false });
  sql`SELECT 1 as ok`.then(function() {
    console.log("OK: " + t.label + " -> " + t.url.replace(pass, "***"));
    sql.end().catch(function(){});
  }).catch(function(e) {
    console.log("FAIL: " + t.label + " -> " + e.message.substring(0, 100));
    sql.end().catch(function(){});
  }).finally(function() {
    done++;
    if (done >= tests.length) setTimeout(function() { process.exit(0); }, 500);
  });
});
