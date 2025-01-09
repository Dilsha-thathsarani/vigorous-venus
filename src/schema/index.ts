import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  full_name: varchar("full_name", { length: 255 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Workspaces table

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  organization_id: uuid("organization_id").references(() => organizations.id),
  icon: text("icon"),
  created_by: uuid("created_by").references(() => users.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Boards table
export const boards = pgTable("boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspace_id: uuid("workspace_id").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  created_by: uuid("created_by").references(() => users.id),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Columns table
export const columns = pgTable("columns", {
  id: uuid("id").primaryKey().defaultRandom(),
  board_id: uuid("board_id").references(() => boards.id, {
    onDelete: "cascade",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  order_index: integer("order_index").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  column_id: uuid("column_id").references(() => columns.id, {
    onDelete: "cascade",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  order_index: integer("order_index").notNull(),
  assignee_id: uuid("assignee_id").references(() => users.id),
  task_window_start: timestamp("task_window_start", { withTimezone: true }),
  task_window_deadline: timestamp("task_window_deadline", {
    withTimezone: true,
  }),
  priority: varchar("priority", { length: 50 }),
  created_by: uuid("created_by").references(() => users.id),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Labels table
export const labels = pgTable("labels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  workspace_id: uuid("workspace_id").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Task-Label relationship table
export const task_labels = pgTable("task_labels", {
  task_id: uuid("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  label_id: uuid("label_id").references(() => labels.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Task Comments table
export const task_comments = pgTable("task_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  task_id: uuid("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  user_id: uuid("user_id").references(() => users.id),
  comment: text("comment").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Task History table
export const task_history = pgTable("task_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  task_id: uuid("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  user_id: uuid("user_id").references(() => users.id),
  action_type: varchar("action_type", { length: 50 }).notNull(),
  old_value: jsonb("old_value"),
  new_value: jsonb("new_value"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  assignedTasks: many(tasks, { relationName: "assignee" }),
  createdTasks: many(tasks, { relationName: "creator" }),
  taskComments: many(task_comments),
  taskHistory: many(task_history),
}));

export const boardsRelations = relations(boards, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [boards.workspace_id],
    references: [workspaces.id],
  }),
  creator: one(users, { fields: [boards.created_by], references: [users.id] }),
  columns: many(columns),
}));

export const columnsRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, { fields: [columns.board_id], references: [boards.id] }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  column: one(columns, { fields: [tasks.column_id], references: [columns.id] }),
  assignee: one(users, { fields: [tasks.assignee_id], references: [users.id] }),
  creator: one(users, { fields: [tasks.created_by], references: [users.id] }),
  labels: many(task_labels),
  comments: many(task_comments),
  history: many(task_history),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  workspaces: many(workspaces),
}));

export const workspacesRelations = relations(workspaces, ({ one }) => ({
  organization: one(organizations, {
    fields: [workspaces.organization_id],
    references: [organizations.id],
  }),
}));
