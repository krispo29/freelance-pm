import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { projects, clients, tasks, incomeEntries, milestones } from "../lib/db/schema";

// Types จากฐานข้อมูล
export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;

export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;

export type IncomeEntry = InferSelectModel<typeof incomeEntries>;
export type NewIncomeEntry = InferInsertModel<typeof incomeEntries>;

export type Milestone = InferSelectModel<typeof milestones>;
export type NewMilestone = InferInsertModel<typeof milestones>;

// Status Types สำหรับ UI
export type ProjectStatus = "not_started" | "in_progress" | "near_done" | "completed" | "maintenance" | "cancelled";
export type PaymentType = "one_time" | "milestone" | "monthly";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type IncomeStatus = "pending" | "received" | "overdue";
