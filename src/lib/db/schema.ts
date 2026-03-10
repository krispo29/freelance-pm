import { pgTable, text, integer, timestamp, boolean, pgEnum, decimal } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

// ============================================
// ENUMS
// ============================================

export const projectStatusEnum = pgEnum("project_status", [
  "not_started",   // ยังไม่เริ่ม
  "in_progress",   // กำลังทำ (เพิ่งเริ่ม / กลางทาง)
  "near_done",     // ใกล้เสร็จ
  "completed",     // เสร็จแล้ว
  "maintenance",   // ดูแลต่อ (retainer)
  "cancelled",     // ยกเลิก
])

export const paymentTypeEnum = pgEnum("payment_type", [
  "one_time",      // จ่ายครั้งเดียว
  "milestone",     // จ่ายตาม milestone
  "monthly",       // รายเดือน (retainer)
])

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "done",
])

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium", 
  "high",
])

export const incomeStatusEnum = pgEnum("income_status", [
  "pending",       // รอรับเงิน
  "received",      // รับแล้ว
  "overdue",       // เลยกำหนด
])

// ============================================
// USERS
// ============================================

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================
// CLIENTS
// ============================================

export const clients = pgTable("clients", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================
// PROJECTS
// ============================================

export const projects = pgTable("projects", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").references(() => users.id),
  clientId: text("client_id").references(() => clients.id),

  name: text("name").notNull(),
  description: text("description"),
  status: projectStatusEnum("status").default("not_started").notNull(),
  paymentType: paymentTypeEnum("payment_type").default("one_time").notNull(),

  totalPrice: decimal("total_price", { precision: 12, scale: 2 }),
  monthlyRate: decimal("monthly_rate", { precision: 12, scale: 2 }),

  startDate: timestamp("start_date"),
  deadline: timestamp("deadline"),
  completedAt: timestamp("completed_at"),
  maintenanceEndDate: timestamp("maintenance_end_date"),

  color: text("color").default("#6366f1"),
  emoji: text("emoji"),

  progress: integer("progress").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================
// TASKS
// ============================================

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),

  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("todo").notNull(),
  priority: taskPriorityEnum("priority").default("medium").notNull(),

  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),

  sortOrder: integer("sort_order").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================
// INCOME
// ============================================

export const incomeEntries = pgTable("income_entries", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => users.id),

  label: text("label").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: incomeStatusEnum("status").default("pending").notNull(),

  dueDate: timestamp("due_date"),
  receivedAt: timestamp("received_at"),

  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ============================================
// MILESTONES
// ============================================

export const milestones = pgTable("milestones", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),

  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  isDone: boolean("is_done").default(false).notNull(),

  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
