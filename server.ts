import { serve } from "std/http/server.ts";
import { serveDir } from "std/http/file_server.ts";

const port = 8000;

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
