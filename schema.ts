import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  progress: integer("progress").notNull(),
});
