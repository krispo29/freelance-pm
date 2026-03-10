import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tasks } from "../db/schema";
import { z } from "zod";

export const insertTaskSchema = createInsertSchema(tasks, {
  title: z.string().min(1, "กรุณากรอกชื่องาน"),
  sortOrder: z.number().optional(),
});

export const selectTaskSchema = createSelectSchema(tasks);

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = z.infer<typeof selectTaskSchema>;
