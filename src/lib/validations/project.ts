import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { projects } from "../db/schema";
import { z } from "zod";

export const insertProjectSchema = createInsertSchema(projects, {
  name: z.string().min(1, "กรุณากรอกชื่อโปรเจค"),
  totalPrice: z.coerce.number().optional(),
  monthlyRate: z.coerce.number().optional(),
  progress: z.number().min(0).max(100).optional(),
});

export const selectProjectSchema = createSelectSchema(projects);

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = z.infer<typeof selectProjectSchema>;
