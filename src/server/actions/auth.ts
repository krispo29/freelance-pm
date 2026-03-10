"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const parsedData = registerSchema.safeParse(Object.fromEntries(formData));
    
    if (!parsedData.success) {
      return parsedData.error.issues[0].message;
    }

    const { name, email, password } = parsedData.data;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return "User with this email already exists.";
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    await db.insert(users).values({
      name,
      email,
      passwordHash,
    });

    // Sign in the user immediately after registration
    await signIn("credentials", formData);
    
  } catch (error) {
     if (error instanceof AuthError) {
       return "Failed to sign in after registration.";
     }
     // Handle Next.js redirect errors correctly
     if ((error as Error).message.includes('NEXT_REDIRECT')) {
        throw error;
     }
     console.error(error);
     return "Failed to register user.";
  }
}

export async function logOut() {
  await signOut();
}
