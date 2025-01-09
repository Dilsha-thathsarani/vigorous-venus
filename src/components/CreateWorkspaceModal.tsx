import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { WorkspaceFormData } from "@/types";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workspaceData: WorkspaceFormData) => void;
}

// interface WorkspaceFormData {
//   organization: string;
//   workspaceName: string;
//   description: string;
//   icon: string;
// }

interface Organization {
  id: string;
  name: string;
}

const WORKSPACE_ICONS = [
  "📊",
  "📈",
  "📉",
  "📋",
  "📁",
  "📂",
  "📝",
  "✏️",
  "📌",
  "📍",
  "💼",
  "🗂️",
  "📅",
  "⚙️",
  "🔧",
  "🛠️",
  "👥",
  "🤝",
  "💡",
  "🎯",
  "📦",
  "🔍",
  "📱",
  "💻",
  "🖥️",
  "⌨️",
  "🖱️",
  "🎨",
  "🎬",
  "📷",
];

const CreateWorkspaceModal = ({
  isOpen,
  onClose,
  onSave,
}: CreateWorkspaceModalProps) => {
  const [formData, setFormData] = useState<WorkspaceFormData>({
    organization_id: "",

    name: "",
    description: "",
    icon: "📁", // Default icon
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const { data, error } = await supabase
          .from("organizations")
          .select("id, name")
          .order("name");

        if (error) throw error;
        setOrganizations(data || []);
        console.log("Organizations 2:", data);
      } catch (err) {
        console.error("Error fetching organizations:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchOrganizations();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIconSelect = (icon: string) => {
    setFormData((prev) => ({
      ...prev,
      icon,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      organization_id: "",

      name: "",
      description: "",
      icon: "📁",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create New Workspace</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization
              </label>
              <select
                name="organization_id"
                value={formData.organization_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              >
                <option value="">Select an organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <div className="grid grid-cols-8 gap-2 p-2 border rounded-lg max-h-32 overflow-y-auto">
                {WORKSPACE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleIconSelect(icon)}
                    className={`p-2 text-xl rounded hover:bg-gray-100 ${
                      formData.icon === icon
                        ? "bg-purple-100 ring-2 ring-purple-500"
                        : ""
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Workspace Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workspace Name
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xl">{formData.icon}</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter workspace name"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter workspace description"
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Create Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Create Workspace
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
