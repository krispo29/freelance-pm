"use server"

import { db } from "@/lib/db"
import { projects } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { InsertProject, insertProjectSchema } from "@/lib/validations/project"
import { revalidatePath } from "next/cache"
import { ProjectStatus } from "@/types"

export async function getProjects(status?: ProjectStatus | "all") {
  try {
    const query = db.query.projects.findMany({
      where: status && status !== "all" ? eq(projects.status, status) : undefined,
      orderBy: [desc(projects.createdAt)],
      with: {
        client: true,
        tasks: true,
        incomeEntries: true,
      }
    });
    
    return await query;
  } catch (error) {
    console.error("Failed to get projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        client: true,
        tasks: {
          orderBy: (tasks, { asc }) => [asc(tasks.sortOrder), desc(tasks.createdAt)]
        },
        incomeEntries: {
          orderBy: (incomeEntries, { desc }) => [desc(incomeEntries.dueDate)]
        },
        milestones: {
          orderBy: (milestones, { asc }) => [asc(milestones.sortOrder)]
        }
      }
    });
    return project;
  } catch (error) {
    console.error(`Failed to get project ${id}:`, error);
    throw new Error("Failed to fetch project details");
  }
}

export async function createProject(data: InsertProject) {
  try {
    const validatedData = insertProjectSchema.parse(data);
    
    const [newProject] = await db.insert(projects).values({
      ...validatedData,
      totalPrice: validatedData.totalPrice?.toString(),
      monthlyRate: validatedData.monthlyRate?.toString(),
    }).returning();
    
    revalidatePath("/projects");
    revalidatePath("/");
    
    return { success: true, data: newProject };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(id: string, data: Partial<InsertProject>) {
  try {
    const [updatedProject] = await db.update(projects)
      .set({ 
        ...data, 
        totalPrice: data.totalPrice?.toString(),
        monthlyRate: data.monthlyRate?.toString(),
        updatedAt: new Date() 
      })
      .where(eq(projects.id, id))
      .returning();
      
    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");
    revalidatePath("/");
    
    return { success: true, data: updatedProject };
  } catch (error) {
    console.error(`Failed to update project ${id}:`, error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  return updateProject(id, { status });
}

export async function deleteProject(id: string) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    
    revalidatePath("/projects");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete project ${id}:`, error);
    return { success: false, error: "Failed to delete project" };
  }
}
