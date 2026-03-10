import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { incomeEntries } from "../db/schema";
import { z } from "zod";

export const insertIncomeSchema = createInsertSchema(incomeEntries, {
  label: z.string().min(1, "กรุณากรอกรายละเอียดรายได้"),
  amount: z.coerce.number().min(0.01, "จำนวนเงินต้องมากกว่า 0"),
});

export const selectIncomeSchema = createSelectSchema(incomeEntries);

export type InsertIncome = z.infer<typeof insertIncomeSchema>;
export type IncomeEntry = z.infer<typeof selectIncomeSchema>;
