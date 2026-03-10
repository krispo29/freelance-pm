"use server"

import { db } from "@/lib/db"
import { tasks } from "@/lib/db/schema"
import { eq, desc, asc, and } from "drizzle-orm"
import { InsertTask, insertTaskSchema } from "@/lib/validations/task"
import { revalidatePath } from "next/cache"
import { TaskStatus } from "@/types"

export async function getTasksByProject(projectId: string) {
  try {
    return await db.query.tasks.findMany({
      where: eq(tasks.projectId, projectId),
      orderBy: [asc(tasks.sortOrder), desc(tasks.createdAt)],
    });
  } catch (error) {
    console.error(`Failed to get tasks for project ${projectId}:`, error);
    throw new Error("Failed to fetch tasks");
  }
}

export async function createTask(data: InsertTask) {
  try {
    const validatedData = insertTaskSchema.parse(data);
    
    // หาค่า sortOrder สูงสุดแล้วบวก 1
    const existingTasks = await getTasksByProject(validatedData.projectId);
    const maxSortOrder = existingTasks.length > 0 ? Math.max(...existingTasks.map(t => t.sortOrder ?? 0)) : -1;
    
    const [newTask] = await db.insert(tasks).values({
      ...validatedData,
      sortOrder: validatedData.sortOrder ?? maxSortOrder + 1
    }).returning();
    
    revalidatePath(`/projects/${validatedData.projectId}`);
    
    return { success: true, data: newTask };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTask(id: string, data: Partial<InsertTask>) {
  try {
    const [updatedTask] = await db.update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
      
    revalidatePath(`/projects/${updatedTask.projectId}`);
    
    return { success: true, data: updatedTask };
  } catch (error) {
    console.error(`Failed to update task ${id}:`, error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function updateTaskStatus(id: string, projectId: string, status: TaskStatus) {
  try {
    const [updatedTask] = await db.update(tasks)
      .set({ 
        status, 
        completedAt: status === "done" ? new Date() : null,
        updatedAt: new Date() 
      })
      .where(eq(tasks.id, id))
      .returning();
      
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: updatedTask };
  } catch (error) {
    console.error(`Failed to update task status ${id}:`, error);
    return { success: false, error: "Failed to update task status" };
  }
}

export async function reorderTasks(projectId: string, taskIds: string[]) {
  try {
    // อัปเดต sortOrder ให้กับแต่ละ Task ตามลำดับใน Array
    await db.transaction(async (tx) => {
      for (let i = 0; i < taskIds.length; i++) {
        await tx.update(tasks)
          .set({ sortOrder: i })
          .where(and(eq(tasks.id, taskIds[i]), eq(tasks.projectId, projectId)));
      }
    });

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to reorder tasks for project ${projectId}:`, error);
    return { success: false, error: "Failed to reorder tasks" };
  }
}

export async function deleteTask(id: string, projectId: string) {
  try {
    await db.delete(tasks).where(eq(tasks.id, id));
    
    revalidatePath(`/projects/${projectId}`);
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete task ${id}:`, error);
    return { success: false, error: "Failed to delete task" };
  }
}
