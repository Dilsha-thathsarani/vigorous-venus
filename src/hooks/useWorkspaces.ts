// src/hooks/useWorkspaces.ts
import { useState, useEffect } from "react";
import type { Workspace, WorkspaceFormData } from "@/types";

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/workspaces");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch workspaces");
      }
      const data = await response.json();
      setWorkspaces(data);
    } catch (err: any) {
      console.error("Error fetching workspaces:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (workspaceData: WorkspaceFormData) => {
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workspaceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create workspace");
      }

      await fetchWorkspaces(); // Refresh the list after creating
      return true;
    } catch (err: any) {
      console.error("Error creating workspace:", err);
      setError(err.message);
      return false;
    }
  };

  const updateWorkspace = async (
    id: string,
    workspaceData: Partial<WorkspaceFormData>
  ) => {
    try {
      const response = await fetch(`/api/workspaces/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workspaceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update workspace");
      }

      await fetchWorkspaces(); // Refresh the list after updating
      return true;
    } catch (err: any) {
      console.error("Error updating workspace:", err);
      setError(err.message);
      return false;
    }
  };

  const deleteWorkspace = async (id: string) => {
    try {
      const response = await fetch(`/api/workspaces/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete workspace");
      }

      await fetchWorkspaces(); // Refresh the list after deleting
      return true;
    } catch (err: any) {
      console.error("Error deleting workspace:", err);
      setError(err.message);
      return false;
    }
  };

  // Optional: Add a function to fetch workspaces by organization
  const fetchWorkspacesByOrganization = async (organizationId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/workspaces?organization_id=${organizationId}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch workspaces");
      }
      const data = await response.json();
      setWorkspaces(data);
    } catch (err: any) {
      console.error("Error fetching workspaces:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return {
    workspaces,
    loading,
    error,
    refreshWorkspaces: fetchWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    fetchWorkspacesByOrganization,
  };
};
