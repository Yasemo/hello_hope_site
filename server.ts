import { serve } from "std/http/server.ts";
import { serveDir } from "std/http/file_server.ts";

// Use PORT environment variable for Cloud Run, fallback to 8000 for local development
const port = parseInt(Deno.env.get("PORT") || "8000");

serve(
  (req) => {
    return serveDir(req, {
      fsRoot: ".",
      urlRoot: "",
      showDirListing: false,
      enableCors: true,
    });
  },
  { port }
);

console.log(`Hello Hope Canada website running at http://localhost:${port}/`);
