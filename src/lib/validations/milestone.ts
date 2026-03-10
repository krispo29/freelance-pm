import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { milestones } from "../db/schema";
import { z } from "zod";

export const insertMilestoneSchema = createInsertSchema(milestones, {
  title: z.string().min(1, "กรุณากรอกชื่อเป้าหมาย (Milestone)"),
  sortOrder: z.number().optional(),
});

export const selectMilestoneSchema = createSelectSchema(milestones);

export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = z.infer<typeof selectMilestoneSchema>;
