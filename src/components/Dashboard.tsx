import { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";

const KanbanBoard = () => {
  const { columns, loading, error, updateTaskColumn } = useKanbanBoard();

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
                        className="bg-white p-4 rounded-lg shadow cursor-move hover:shadow-md transition-shadow"
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
  );
};

export default KanbanBoard;
