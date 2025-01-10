import { useEffect, useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";
import TaskDetailModal from "./TaskDetailModal";
import type { Task } from "@/types";
import AddTaskModal from "./AddTaskModal";

const KanbanBoard = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { columns, loading, error, updateTaskColumn, refreshBoard } =
    useKanbanBoard();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");

  // Log initial columns data
  useEffect(() => {
    console.log("Columns data:", columns);
  }, [columns]);

  const handleDragStart = (
    e: React.DragEvent,
    taskId: string,
    sourceColumnId: string
  ) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumnId", sourceColumnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    if (sourceColumnId === targetColumnId) return;
    await updateTaskColumn(taskId, targetColumnId);

    console.log("Task dropped:", taskId, sourceColumnId, targetColumnId);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = async (taskData: Partial<Task>) => {
    try {
      console.log("Sending update data:", {
        id: selectedTask?.id,
        ...taskData,
      });

      const updateData = {
        id: selectedTask?.id,
        title: taskData.title,
        description: taskData.description || null,
        assignee_id: taskData.assignee_id || null,
        priority: taskData.priority || null,
        task_window_start: taskData.task_window_start
          ? new Date(taskData.task_window_start).toISOString()
          : null,
        task_window_deadline: taskData.task_window_deadline
          ? new Date(taskData.task_window_deadline).toISOString()
          : null,
      };

      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update task");
      }

      await refreshBoard();
      setSelectedTask(null); // Close the modal
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });

      if (!response.ok) throw new Error("Failed to delete task");
      await refreshBoard();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Add new task handler
  const handleAddTask = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskData,
          order_index: 0, // or calculate based on existing tasks
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create task");
      }

      await refreshBoard();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div className="h-full overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}

          <div className="flex justify-between items-center p-4 border-b bg-white">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">Tasks</h1>
              <div className="text-sm text-blue-600">1 sort rule</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedColumnId(columns[0]?.id || ""); // Default to first column
                  setIsAddModalOpen(true);
                }}
                className="p-2 hover:bg-gray-200 rounded"
                aria-label="Add new task"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
              <button
                className="p-2 hover:bg-gray-200 rounded"
                aria-label="Close"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Board Content */}
          <div className="flex-1 overflow-x-auto p-4">
            <div className="flex gap-6 h-full min-w-max">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className="flex-shrink-0 w-80 bg-gray-50 rounded-lg shadow-sm"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  {/* Column Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="font-semibold">{column.title}</h2>
                      <span className="text-sm text-gray-500">
                        {column.items.length} items
                      </span>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
                    {column.items.length === 0 ? (
                      <div className="text-center text-gray-400">
                        No tasks in this column
                      </div>
                    ) : (
                      column.items.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleTaskClick(task)}
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, task.id, column.id)
                          }
                        >
                          <h3 className="font-medium mb-2">{task.title}</h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-4">
                              {task.description}
                            </p>
                          )}

                          {task.assignee && (
                            <div className="text-sm text-gray-500 mb-2">
                              <span className="font-medium">Assignee:</span>{" "}
                              {task.assignee.full_name}
                            </div>
                          )}

                          {task.task_window_start &&
                            task.task_window_deadline && (
                              <div className="text-sm text-gray-500">
                                <div>
                                  <span className="font-medium">Start:</span>{" "}
                                  {new Date(
                                    task.task_window_start
                                  ).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Deadline:</span>{" "}
                                  {new Date(
                                    task.task_window_deadline
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTask}
        columnId={selectedColumnId}
      />
      <TaskDetailModal
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onSave={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </>
  );
};

export default KanbanBoard;
