// src/lib/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema";

const connectionString = import.meta.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable");
}

// Create a Postgres client for Drizzle
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// // Test function to query organizations table
// async function testQuery() {
//   try {
//     console.log("Testing database connection...");
//     const orgs = await db.select().from(organizations);
//     console.log("Organizations found:", orgs);
//   } catch (error) {
//     console.error("Database query failed:", error);
//   }
// }

// // Run the test
// testQuery();

// // Export both db and test function
// export { testQuery };
