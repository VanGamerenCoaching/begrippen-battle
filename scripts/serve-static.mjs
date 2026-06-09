import { createServer } from "node:http";
import { existsSync, readFile } from "node:fs";
import { extname, resolve } from "node:path";

const root = resolve(process.cwd(), "out");
const port = 3000;
const host = "127.0.0.1";
const types = {
  ".css": "text/css",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".js": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
};

if (!existsSync(root)) {
  console.error("Geen out-map gevonden. Run eerst: npm run build");
  process.exit(1);
}

function resolveFile(urlPath) {
  const withoutQuery = urlPath.split("?")[0];
  const decodedPath = decodeURIComponent(withoutQuery);
  const cleanPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const candidates = [cleanPath, `${cleanPath}.html`, `${cleanPath}/index.html`];

  return candidates
    .map((candidate) => resolve(root, candidate.slice(1)))
    .find((candidate) => candidate.startsWith(root) && existsSync(candidate));
}

createServer((request, response) => {
  const filePath = resolveFile(request.url || "/");

  if (!filePath) {
    response.writeHead(404);
    response.end("Niet gevonden");
    return;
  }

  readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(500);
      response.end("Kan bestand niet lezen");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[extname(filePath)] || "application/octet-stream",
    });
    response.end(data);
  });
}).listen(port, host, () => {
  console.log(`Begrippen Battle draait op http://${host}:${port}`);
});
