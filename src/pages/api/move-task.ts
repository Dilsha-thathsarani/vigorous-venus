// src/pages/api/move-task.ts (simplified name)
import type { APIRoute } from "astro";
import { db } from "../../lib/db";
import { tasks } from "../../schema";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { taskId, columnId } = await request.json();

    const result = await db
      .update(tasks)
      .set({ column_id: columnId })
      .where(eq(tasks.id, taskId))
      .returning();

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error moving task:", error);
    return new Response(JSON.stringify({ error: "Failed to move task" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
