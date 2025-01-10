// src/pages/api/workspaces/index.ts
import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { workspaces } from "../../../schema";

export const GET: APIRoute = async () => {
  try {
    const result = await db.select().from(workspaces).orderBy(workspaces.name);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = await db
      .insert(workspaces)
      .values({
        name: body.name,
        description: body.description,
        organization_id: body.organization_id,
        icon: body.icon,
      })
      .returning();

    return new Response(JSON.stringify(result[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
