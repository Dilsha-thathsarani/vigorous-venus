// src/db/queries/organizations.ts
import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { organizations, workspaces } from "../../schema";
import type { Organization } from "@/types";

export const organizationQueries = {
  async getAll() {
    try {
      const result = await db
        .select()
        .from(organizations)
        .orderBy(organizations.name);

      // Transform DrizzleOrganization[] to Organization[]
      return result.map((org) => ({
        id: org.id,
        name: org.name,
        description: org.description || undefined,
        created_at: org.created_at?.toISOString() || new Date().toISOString(),
        updated_at: org.updated_at?.toISOString() || new Date().toISOString(),
      })) as Organization[];
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  },

  async getWorkspaces(organizationId: string) {
    try {
      return await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.organization_id, organizationId))
        .orderBy(workspaces.created_at);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      throw error;
    }
  },

  async create(data: { name: string; description?: string }) {
    try {
      const [result] = await db
        .insert(organizations)
        .values({
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();
      return result;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  },

  async createWorkspace(data: {
    name: string;
    description?: string;
    organization_id: string;
    icon?: string;
    created_by: string;
  }) {
    try {
      const [result] = await db
        .insert(workspaces)
        .values({
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();
      return result;
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw error;
    }
  },
};
