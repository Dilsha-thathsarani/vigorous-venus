// src/pages/api/move-task.ts
import type { APIRoute } from "astro";
import { db } from "../../lib/db";
import { tasks } from "../../schema";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { taskId, columnId } = await request.json();

    console.log("Moving task:", { taskId, columnId }); // Debug log

    // Get all tasks in the target column to calculate new order_index
    const columnTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.column_id, columnId))
      .orderBy(tasks.order_index);

    // Calculate new order_index
    const newOrderIndex =
      columnTasks.length > 0
        ? Math.max(...columnTasks.map((t) => t.order_index)) + 1
        : 0;

    // Update the task
    const result = await db
      .update(tasks)
      .set({
        column_id: columnId,
        order_index: newOrderIndex,
        updated_at: new Date(),
      })
      .where(eq(tasks.id, taskId))
      .returning();

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error moving task:", error);
    return new Response(JSON.stringify({ error: "Failed to move task" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
