// src/hooks/useOrganizations.ts
import { useState, useEffect } from "react";
import type { Organization, OrganizationFormData } from "@/types";

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/organizations");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch organizations");
      }
      const data = await response.json();
      setOrganizations(data);
    } catch (err: any) {
      console.error("Error fetching organizations:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async (organizationData: OrganizationFormData) => {
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create organization");
      }

      await fetchOrganizations(); // Refresh the list after creating
      return true;
    } catch (err: any) {
      console.error("Error creating organization:", err);
      setError(err.message);
      return false;
    }
  };

  const updateOrganization = async (
    id: string,
    organizationData: Partial<OrganizationFormData>
  ) => {
    try {
      const response = await fetch(`/api/organizations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update organization");
      }

      await fetchOrganizations(); // Refresh the list after updating
      return true;
    } catch (err: any) {
      console.error("Error updating organization:", err);
      setError(err.message);
      return false;
    }
  };

  const deleteOrganization = async (id: string) => {
    try {
      const response = await fetch(`/api/organizations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete organization");
      }

      await fetchOrganizations(); // Refresh the list after deleting
      return true;
    } catch (err: any) {
      console.error("Error deleting organization:", err);
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return {
    organizations,
    loading,
    error,
    refreshOrganizations: fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
};
