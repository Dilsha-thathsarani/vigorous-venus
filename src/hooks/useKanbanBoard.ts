import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Task {
  id: string;
  title: string;
  description: string;
  column_id: string; // Changed from status to column_id
  order_index: number;
  assignee?: {
    full_name: string;
  };
  task_window_start?: string;
  task_window_deadline?: string;
}

interface Column {
  id: string;
  title: string;
  items: Task[];
}

export const useKanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      // First fetch columns
      const { data: columnsData, error: columnsError } = await supabase
        .from("columns")
        .select("*")
        .order("order_index");

      if (columnsError) throw columnsError;

      // Then fetch tasks
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select(
          `
          *,
          assignee:users!tasks_assignee_id_fkey(full_name)
        `
        )
        .order("order_index");

      if (tasksError) throw tasksError;

      // Organize tasks into columns
      const organizedColumns = columnsData.map((column) => ({
        id: column.id,
        title: column.title,
        items: tasks?.filter((task) => task.column_id === column.id) || [],
      }));

      setColumns(organizedColumns);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskColumn = async (taskId: string, newColumnId: string) => {
    try {
      const { error: updateError } = await supabase
        .from("tasks")
        .update({
          column_id: newColumnId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId);

      if (updateError) throw updateError;
      await fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    columns,
    loading,
    error,
    updateTaskColumn,
    refreshBoard: fetchTasks,
  };
};
