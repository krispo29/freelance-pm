"use server"

import { db } from "@/lib/db"
import { milestones } from "@/lib/db/schema"
import { eq, asc, and } from "drizzle-orm"
import { InsertMilestone, insertMilestoneSchema } from "@/lib/validations/milestone"
import { revalidatePath } from "next/cache"

export async function getMilestonesByProject(projectId: string) {
  try {
    return await db.query.milestones.findMany({
      where: eq(milestones.projectId, projectId),
      orderBy: [asc(milestones.sortOrder), asc(milestones.createdAt)],
    });
  } catch (error) {
    console.error(`Failed to get milestones for project ${projectId}:`, error);
    throw new Error("Failed to fetch milestones");
  }
}

export async function createMilestone(data: InsertMilestone) {
  try {
    const validatedData = insertMilestoneSchema.parse(data);
    
    // หาค่า sortOrder สูงสุด
    const existingMilestones = await getMilestonesByProject(validatedData.projectId);
    const maxSortOrder = existingMilestones.length > 0 ? Math.max(...existingMilestones.map(m => m.sortOrder ?? 0)) : -1;
    
    const [newMilestone] = await db.insert(milestones).values({
      ...validatedData,
      sortOrder: validatedData.sortOrder ?? maxSortOrder + 1
    }).returning();
    
    revalidatePath(`/projects/${validatedData.projectId}`);
    
    return { success: true, data: newMilestone };
  } catch (error) {
    console.error("Failed to create milestone:", error);
    return { success: false, error: "Failed to create milestone" };
  }
}

export async function toggleMilestone(id: string, projectId: string, isDone: boolean) {
  try {
    const [updatedMilestone] = await db.update(milestones)
      .set({ 
        isDone, 
        completedAt: isDone ? new Date() : null 
      })
      .where(eq(milestones.id, id))
      .returning();
      
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: updatedMilestone };
  } catch (error) {
    console.error(`Failed to toggle milestone ${id}:`, error);
    return { success: false, error: "Failed to update milestone status" };
  }
}

export async function deleteMilestone(id: string, projectId: string) {
  try {
    await db.delete(milestones).where(eq(milestones.id, id));
    
    revalidatePath(`/projects/${projectId}`);
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete milestone ${id}:`, error);
    return { success: false, error: "Failed to delete milestone" };
  }
}
