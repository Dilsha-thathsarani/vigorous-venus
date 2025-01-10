// src/pages/api/users.ts
import type { APIRoute } from "astro";
import { db } from "../../lib/db";
import { users } from "../../schema";

export const GET: APIRoute = async () => {
  try {
    const result = await db
      .select({
        id: users.id,
        full_name: users.full_name,
      })
      .from(users);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
