// src/pages/api/tasks.ts (move out of the folder)
import type { APIRoute } from "astro";
import { db } from "../../lib/db";
import { tasks } from "../../schema";
import { eq } from "drizzle-orm";

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

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("Received update request body:", body);

    if (!body.id) {
      throw new Error("Task ID is required");
    }

    // Clean the update data to match the schema
    const updateData: any = {
      title: body.title,
      description: body.description || null,
      assignee_id: body.assignee_id || null,
      priority: body.priority || null,
      updated_at: new Date(),
    };

    // Handle dates
    if (body.task_window_start) {
      updateData.task_window_start = new Date(body.task_window_start);
    } else {
      updateData.task_window_start = null;
    }

    if (body.task_window_deadline) {
      updateData.task_window_deadline = new Date(body.task_window_deadline);
    } else {
      updateData.task_window_deadline = null;
    }

    console.log("Cleaned update data:", updateData);

    const result = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, body.id))
      .returning();

    console.log("Update result:", result);

    if (!result.length) {
      throw new Error("Task not found");
    }

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Detailed error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to update task",
        details: error,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();

    if (!id) {
      throw new Error("Task ID is required");
    }

    await db.delete(tasks).where(eq(tasks.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to delete task",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const result = await db
      .insert(tasks)
      .values({
        title: body.title,
        description: body.description,
        column_id: body.column_id,
        order_index: body.order_index,
        assignee_id: body.assignee_id || null,
        task_window_start: body.task_window_start
          ? new Date(body.task_window_start)
          : null,
        task_window_deadline: body.task_window_deadline
          ? new Date(body.task_window_deadline)
          : null,
        priority: body.priority || null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return new Response(JSON.stringify(result[0]), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return new Response(JSON.stringify({ error: "Failed to create task" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
