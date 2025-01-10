import React, { useState } from "react";
import "../styles/global.css";
import { X } from "lucide-react";
import type { WorkspaceFormData, OrganizationFormData } from "@/types";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import CreateOrganizationModal from "./CreateOrganizationModal";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useWorkspaces } from "@/hooks/useWorkspaces";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);

  // Use organizations hook
  const {
    organizations,
    loading: orgsLoading,
    error: orgsError,
    createOrganization,
  } = useOrganizations();

  // Use workspaces hook
  const {
    workspaces,
    loading: wsLoading,
    error: wsError,
    createWorkspace,
  } = useWorkspaces();

  // Group workspaces by organization
  const organizedMenuItems = organizations.map((org) => {
    const orgWorkspaces = workspaces.filter(
      (ws) => ws.organization_id === org.id
    );
    return {
      id: org.id,
      name: org.name,
      type: "header",
      items: orgWorkspaces.map((ws) => ({
        id: ws.id,
        name: ws.name,
        icon: ws.icon || "📁",
        subitems: [],
      })),
    };
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleItem = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleCreateWorkspace = async (workspaceData: WorkspaceFormData) => {
    const success = await createWorkspace(workspaceData);
    if (success) {
      setIsWorkspaceModalOpen(false);
    }
  };

  const handleCreateOrganization = async (
    organizationData: OrganizationFormData
  ) => {
    const success = await createOrganization(organizationData);
    if (success) {
      setIsOrganizationModalOpen(false);
    }
  };

  if (orgsLoading || wsLoading) {
    return <div>Loading...</div>;
  }

  if (orgsError || wsError) {
    return <div>Error: {orgsError || wsError}</div>;
  }

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-full bg-gray-50 shadow-lg transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            {isOpen && <h1 className="text-lg font-semibold">Organizations</h1>}
            <button
              onClick={toggleSidebar}
              className="rounded p-2 hover:bg-gray-200"
            >
              {isOpen ? "×" : "≡"}
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto">
            {organizedMenuItems.map((org, orgIndex) => (
              <div key={org.id}>
                <div className="p-4">
                  {isOpen && (
                    <h2 className="font-semibold text-gray-700">{org.name}</h2>
                  )}
                </div>
                {org.items.map((workspace, wsIndex) => (
                  <button
                    key={workspace.id}
                    onClick={() => toggleItem(wsIndex)}
                    className={`flex w-full items-center px-4 py-3 text-left hover:bg-gray-200
                      ${expandedItem === wsIndex ? "bg-gray-200" : ""}`}
                  >
                    <span className="mr-3">{workspace.icon}</span>
                    {isOpen && (
                      <span className="flex-1 text-sm">{workspace.name}</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            {isOpen && (
              <>
                <button
                  onClick={() => setIsWorkspaceModalOpen(true)}
                  className="mb-2 w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                >
                  Create Workspace
                </button>
                <button
                  onClick={() => setIsOrganizationModalOpen(true)}
                  className="w-full rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
                >
                  Create Organization
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <CreateWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onSave={handleCreateWorkspace}
      />

      <CreateOrganizationModal
        isOpen={isOrganizationModalOpen}
        onClose={() => setIsOrganizationModalOpen(false)}
        onSave={handleCreateOrganization}
      />
    </>
  );
};

export default Sidebar;
