"use server"

import { db } from "@/lib/db"
import { clients } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { InsertClient, insertClientSchema } from "@/lib/validations/client"
import { revalidatePath } from "next/cache"

export async function getClients() {
  try {
    return await db.query.clients.findMany({
      orderBy: [desc(clients.createdAt)],
      with: {
        projects: {
          columns: {
            id: true,
            name: true,
            status: true
          }
        }
      }
    });
  } catch (error) {
    console.error("Failed to get clients:", error);
    throw new Error("Failed to fetch clients");
  }
}

export async function createClient(data: InsertClient) {
  try {
    const validatedData = insertClientSchema.parse(data);
    
    const [newClient] = await db.insert(clients).values(validatedData).returning();
    
    revalidatePath("/clients");
    revalidatePath("/projects");
    
    return { success: true, data: newClient };
  } catch (error) {
    console.error("Failed to create client:", error);
    return { success: false, error: "Failed to create client" };
  }
}

export async function updateClient(id: string, data: Partial<InsertClient>) {
  try {
    const [updatedClient] = await db.update(clients)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
      
    revalidatePath("/clients");
    revalidatePath("/projects");
    
    return { success: true, data: updatedClient };
  } catch (error) {
    console.error(`Failed to update client ${id}:`, error);
    return { success: false, error: "Failed to update client" };
  }
}

export async function deleteClient(id: string) {
  try {
    await db.delete(clients).where(eq(clients.id, id));
    
    revalidatePath("/clients");
    revalidatePath("/projects");
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete client ${id}:`, error);
    return { success: false, error: "Failed to delete client (might be in use)" };
  }
}
