// src/pages/api/boards/index.ts
import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { boards } from "../../../schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  try {
    const workspaceId = url.searchParams.get("workspace_id");

    const query = db.query.boards.findMany({
      where: workspaceId ? eq(boards.workspace_id, workspaceId) : undefined,
      with: {
        columns: {
          with: {
            tasks: {
              with: {
                assignee: true,
              },
            },
          },
        },
        workspace: true,
        creator: true,
      },
      orderBy: boards.created_at,
    });

    const results = await query;

    return new Response(JSON.stringify(results), {
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
      .insert(boards)
      .values({
        workspace_id: body.workspace_id,
        name: body.name,
        description: body.description,
        created_by: body.created_by,
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
