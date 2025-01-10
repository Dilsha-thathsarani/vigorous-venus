// src/pages/api/columns.ts (move out of the folder)
import type { APIRoute } from "astro";
import { db } from "../../lib/db";
import { columns } from "../../schema";

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const result = await db.select().from(columns);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching columns:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch columns" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
