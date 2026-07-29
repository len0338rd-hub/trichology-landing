import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const host = "127.0.0.1";
const port = 4173;
const referenceHtmlPath = path.resolve("reference/index.html");

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${host}:${port}`);

  if (requestUrl.pathname !== "/" && requestUrl.pathname !== "/index.html") {
    response.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end("Not found");
    return;
  }

  try {
    const metadata = await stat(referenceHtmlPath);

    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": metadata.size,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(referenceHtmlPath).pipe(response);
  } catch (error) {
    console.error("Не удалось отдать reference/index.html:", error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Reference HTML is unavailable");
  }
});

server.listen(port, host, () => {
  console.log(`Reference server: http://${host}:${port}/`);
});

function shutdown(signal) {
  console.log(`\n${signal}: останавливаем reference server`);
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
