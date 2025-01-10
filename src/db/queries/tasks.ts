import { supabase } from "../../lib/supabase";
import type { Task } from "@/types";

export const taskQueries = {
  async getAllByBoard(boardId: string) {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        assignee:users!tasks_assignee_id_fkey(id, full_name),
        column:columns!tasks_column_id_fkey(id, title, order_index)
      `
      )
      .eq("column.board_id", boardId)
      .order("order_index");

    if (error) throw error;
    console.log(data);
  },

  async getByColumn(columnId: string) {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        assignee:users!tasks_assignee_id_fkey(id, full_name)
      `
      )
      .eq("column_id", columnId)
      .order("order_index");

    if (error) throw error;
    return data;
  },

  async create(newTask: Omit<Task, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("tasks")
      .insert([newTask])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateColumn(
    taskId: string,
    columnId: string,
    newOrderIndex: number,
    userId: string
  ) {
    // Start a Supabase transaction using RPC
    const { data, error } = await supabase.rpc("move_task", {
      p_task_id: taskId,
      p_column_id: columnId,
      p_order_index: newOrderIndex,
      p_user_id: userId,
    });

    if (error) throw error;
    return data;
  },

  async updateTask(taskId: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
