"use server"

import { db } from "@/lib/db"
import { incomeEntries } from "@/lib/db/schema"
import { eq, desc, sum } from "drizzle-orm"
import { InsertIncome, insertIncomeSchema } from "@/lib/validations/income"
import { revalidatePath } from "next/cache"
import { IncomeStatus } from "@/types"

export async function getIncomeByProject(projectId: string) {
  try {
    return await db.query.incomeEntries.findMany({
      where: eq(incomeEntries.projectId, projectId),
      orderBy: [desc(incomeEntries.dueDate), desc(incomeEntries.createdAt)],
    });
  } catch (error) {
    console.error(`Failed to get income for project ${projectId}:`, error);
    throw new Error("Failed to fetch income entries");
  }
}

export async function getAllIncome() {
  try {
    return await db.query.incomeEntries.findMany({
      orderBy: [desc(incomeEntries.dueDate), desc(incomeEntries.createdAt)],
      with: {
        project: true
      }
    });
  } catch (error) {
    console.error("Failed to get all income:", error);
    throw new Error("Failed to fetch all income");
  }
}

export async function getIncomeStats() {
  try {
    const allIncome = await db.query.incomeEntries.findMany();
    
    let totalPending = 0;
    let totalReceived = 0;
    let totalOverdue = 0;
    
    for (const entry of allIncome) {
      const amount = Number(entry.amount);
      if (entry.status === "received") {
        totalReceived += amount;
      } else if (entry.status === "overdue" || (entry.status === "pending" && entry.dueDate && new Date(entry.dueDate) < new Date())) {
        totalOverdue += amount;
      } else {
        totalPending += amount;
      }
    }
    
    return {
      totalReceived,
      totalPending,
      totalOverdue,
      totalExpected: totalReceived + totalPending + totalOverdue
    };
  } catch (error) {
    console.error("Failed to get income stats:", error);
    throw new Error("Failed to fetch income statistics");
  }
}

export async function createIncomeEntry(data: InsertIncome) {
  try {
    const validatedData = insertIncomeSchema.parse(data);
    
    const [newEntry] = await db.insert(incomeEntries).values({
      ...validatedData,
      amount: validatedData.amount.toString()
    }).returning();
    
    revalidatePath(`/projects/${validatedData.projectId}`);
    revalidatePath("/income");
    revalidatePath("/");
    
    return { success: true, data: newEntry };
  } catch (error) {
    console.error("Failed to create income entry:", error);
    return { success: false, error: "Failed to create income entry" };
  }
}

export async function markIncomeReceived(id: string, projectId: string) {
  try {
    const [updatedEntry] = await db.update(incomeEntries)
      .set({ 
        status: "received", 
        receivedAt: new Date() 
      })
      .where(eq(incomeEntries.id, id))
      .returning();
      
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/income");
    revalidatePath("/");
    
    return { success: true, data: updatedEntry };
  } catch (error) {
    console.error(`Failed to mark income received ${id}:`, error);
    return { success: false, error: "Failed to update income status" };
  }
}

export async function deleteIncomeEntry(id: string, projectId: string) {
  try {
    await db.delete(incomeEntries).where(eq(incomeEntries.id, id));
    
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/income");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete income entry ${id}:`, error);
    return { success: false, error: "Failed to delete income entry" };
  }
}
