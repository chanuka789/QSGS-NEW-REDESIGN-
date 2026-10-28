// Tell IndexNow search engines (Bing, Yandex, Seznam, Naver…) about every URL in the
// live sitemap. Google does not use IndexNow — use Search Console for Google.
// Run after a deploy on the real domain:  node scripts/indexnow.mjs https://qs-global-solutions.com
const KEY = "7b9cb198ea7dd8b8227c722712358b7f"; // public by design: the same key is served at /7b9cb198ea7dd8b8227c722712358b7f.txt
const site = (process.argv[2] || "https://qs-global-solutions.com").replace(/\/$/, "");
const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(site));
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key: KEY, keyLocation: `${site}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URLs → HTTP ${res.status}`);
