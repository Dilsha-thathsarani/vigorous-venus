// src/pages/api/organizations/index.ts
import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { organizations } from "../../../schema";

export const GET: APIRoute = async () => {
  try {
    const result = await db
      .select()
      .from(organizations)
      .orderBy(organizations.name);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch organizations" }),
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
      .insert(organizations)
      .values({
        name: body.name,
        description: body.description,
      })
      .returning();

    return new Response(JSON.stringify(result[0]), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create organization" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
