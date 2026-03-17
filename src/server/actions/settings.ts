"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
});

export async function getUserSettings() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  return user;
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;

  const validatedFields = profileSchema.safeParse({
    name,
    bio,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db
      .update(users)
      .set({
        name: validatedFields.data.name,
        bio: validatedFields.data.bio,
        updatedAt: new Date(),
      })
      .where(eq(users.email, session.user.email));

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to update profile" };
  }
}
