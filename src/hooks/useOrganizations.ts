import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Organization, Workspace } from "@/types";

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("name");

      if (error) throw error;
      setOrganizations(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
  };
};

export const useWorkspacesByOrganization = (organizationId: string) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = async () => {
    try {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at");

      if (error) throw error;
      setWorkspaces(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizationId) {
      fetchWorkspaces();
    }
  }, [organizationId]);

  return { workspaces, loading, error, refreshWorkspaces: fetchWorkspaces };
};
