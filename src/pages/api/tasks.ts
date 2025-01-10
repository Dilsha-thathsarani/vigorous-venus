// src/pages/api/tasks.ts (move out of the folder)
import type { APIRoute } from "astro";
import { db } from "../../lib/db";
import { tasks } from "../../schema";

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const result = await db.select().from(tasks);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch tasks" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
