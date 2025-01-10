// src/hooks/useKanbanBoard.ts
import { useState, useEffect } from "react";
import type { Column, Task } from "@/types";

export const useKanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColumns = async () => {
    try {
      setLoading(true);
      setError(null);

      const columnsResponse = await fetch("/api/columns");
      if (!columnsResponse.ok) throw new Error("Failed to fetch columns");
      const columnsData = await columnsResponse.json();

      const tasksResponse = await fetch("/api/tasks");
      if (!tasksResponse.ok) throw new Error("Failed to fetch tasks");
      const tasksData = await tasksResponse.json();

      const columnsWithTasks = columnsData.map((column: { id: any }) => ({
        ...column,
        items: tasksData.filter(
          (task: { column_id: any }) => task.column_id === column.id
        ),
      }));

      setColumns(columnsWithTasks);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskColumn = async (taskId: string, newColumnId: string) => {
    try {
      const response = await fetch("/api/move-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          columnId: newColumnId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to move task");
      }

      await fetchColumns();
    } catch (err: any) {
      console.error("Error moving task:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchColumns();
  }, []);

  return {
    columns,
    loading,
    error,
    updateTaskColumn,
    refreshBoard: fetchColumns,
  };
};
