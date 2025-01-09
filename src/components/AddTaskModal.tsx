import React, { useState } from "react";
import { X } from "lucide-react";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: any) => void;
}

const AddTaskModal = ({ isOpen, onClose, onSave }: AddTaskModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    project: "",
    feature_requirement: "",
    assignee: "",
    task_window_deadline: "",
    task_window_start: "",
    status: "",
    priority: "",
    predicted_workload: "",
    task_role: "",
    acceptance_criteria: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 px-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-semibold">Add New Row</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full px-3 py-2 border rounded-md"
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
                placeholder="Enter description"
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select project</option>
                <option value="project1">Project 1</option>
                <option value="project2">Project 2</option>
              </select>
            </div>

            {/* Feature Requirement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feature Requirement
              </label>
              <select
                name="feature_requirement"
                value={formData.feature_requirement}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select feature requirements</option>
                <option value="feature1">Feature 1</option>
                <option value="feature2">Feature 2</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <select
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select profiles</option>
                <option value="user1">User 1</option>
                <option value="user2">User 2</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Window Start
                </label>
                <input
                  type="date"
                  name="task_window_start"
                  value={formData.task_window_start}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Window Deadline
                </label>
                <input
                  type="date"
                  name="task_window_deadline"
                  value={formData.task_window_deadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="reviewing">Reviewing</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Predicted Workload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Predicted Workload
              </label>
              <input
                type="text"
                name="predicted_workload"
                value={formData.predicted_workload}
                onChange={handleChange}
                placeholder="Enter predicted workload"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Task Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Role
              </label>
              <input
                type="text"
                name="task_role"
                value={formData.task_role}
                onChange={handleChange}
                placeholder="Enter task role"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Acceptance Criteria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Acceptance Criteria
              </label>
              <textarea
                name="acceptance_criteria"
                value={formData.acceptance_criteria}
                onChange={handleChange}
                placeholder="Enter acceptance criteria"
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
