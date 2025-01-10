import React, { useState } from "react";
import { X } from "lucide-react";
import type { OrganizationFormData } from "@/types";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (organizationData: OrganizationFormData) => void;
}

const CreateOrganizationModal = ({
  isOpen,
  onClose,
  onSave,
}: CreateOrganizationModalProps) => {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ name: "", description: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create New Organization</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter organization name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
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
                placeholder="Enter organization description"
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Create Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Create Organization
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;
