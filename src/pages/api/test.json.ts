// src/pages/api/test.json.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      message: "Hello from API",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
