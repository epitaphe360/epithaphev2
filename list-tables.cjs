const https = require("https");
const svc = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkcWVodWFncHl0d3F6YXdxb3loIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAzMDM5MCwiZXhwIjoyMDgzNjA2MzkwfQ.-mu5WiGBbsMS6zDFwe9WxFfboqz-kJtEmXr85LrzqpA";

const opts = {
  host: "cdqehuagpytwqzawqoyh.supabase.co",
  path: "/rest/v1/",
  headers: { apikey: svc, Authorization: "Bearer " + svc, Accept: "application/openapi+json" }
};

https.get(opts, function(res) {
  let body = "";
  res.on("data", function(c) { body += c; });
  res.on("end", function() {
    try {
      const j = JSON.parse(body);
      const tables = Object.keys(j.definitions || {}).sort();
      console.log("TOTAL TABLES:", tables.length);
      console.log("---");
      tables.forEach(function(t) { console.log(t); });
    } catch(e) { console.log("PARSE ERR:", e.message, body.substring(0, 500)); }
  });
}).on("error", function(e) { console.log("REQ ERR:", e.message); });
