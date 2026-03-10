import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { clients } from "../db/schema";
import { z } from "zod";

export const insertClientSchema = createInsertSchema(clients, {
  name: z.string().min(1, "กรุณากรอกชื่อลูกค้า"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง").optional().or(z.literal("")),
});

export const selectClientSchema = createSelectSchema(clients);

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = z.infer<typeof selectClientSchema>;
