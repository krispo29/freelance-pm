import { relations } from "drizzle-orm"
import { projects, clients, tasks, incomeEntries, milestones } from "./schema"

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, { fields: [projects.clientId], references: [clients.id] }),
  tasks: many(tasks),
  incomeEntries: many(incomeEntries),
  milestones: many(milestones),
}))

export const clientsRelations = relations(clients, ({ many }) => ({
  projects: many(projects),
}))

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
}))

export const incomeRelations = relations(incomeEntries, ({ one }) => ({
  project: one(projects, { fields: [incomeEntries.projectId], references: [projects.id] }),
}))

export const milestonesRelations = relations(milestones, ({ one }) => ({
  project: one(projects, { fields: [milestones.projectId], references: [projects.id] }),
}))
