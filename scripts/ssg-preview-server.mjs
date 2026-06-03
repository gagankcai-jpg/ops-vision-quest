// Local preview that mirrors the production WordPress path layout, to verify SSG hydration:
//   /market-intelligence/<route>      → dist/<route>/index.html  (prerendered page)
//   /market-intelligence/             → dist/index.html
//   /wp-content/plugins/autonomous-it-insights/app/<x> → dist/<x>  (hashed assets)
import { createServer } from "http";
import { readFile, stat } from "fs/promises";
import { join, extname } from "path";

const DIST = join(process.cwd(), "dist");
const ASSET_PREFIX = "/wp-content/plugins/autonomous-it-insights/app/";
const ROUTE_PREFIX = "/market-intelligence/";
const PORT = 8099;

const MIME = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".html": "text/html", ".woff2": "font/woff2", ".map": "application/json" };

async function tryFile(p) { try { const s = await stat(p); return s.isFile() ? p : null; } catch { return null; } }

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url || "/").split("?")[0]);
    let file = null;

    if (url.startsWith(ASSET_PREFIX)) {
      file = await tryFile(join(DIST, url.slice(ASSET_PREFIX.length)));
    } else if (url.startsWith(ROUTE_PREFIX) || url === "/market-intelligence") {
      const route = url.replace(/^\/market-intelligence\/?/, "").replace(/\/$/, "");
      file = (await tryFile(join(DIST, route, "index.html")))
          ?? (route === "" ? await tryFile(join(DIST, "index.html")) : null);
    }

    if (!file) { res.writeHead(404, { "content-type": "text/plain" }); res.end("404: " + url); return; }
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch (e) { res.writeHead(500); res.end(String(e)); }
}).listen(PORT, () => console.log(`SSG preview on http://localhost:${PORT}/market-intelligence/overview`));
