import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.string().trim().email("البريد غير صالح.").max(320),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل.")
    .max(128, "كلمة المرور طويلة جدًا."),
  displayName: z.string().trim().max(200).optional(),
});

export const loginBodySchema = z.object({
  email: z.string().trim().email("البريد غير صالح.").max(320),
  password: z.string().min(1, "أدخل كلمة المرور.").max(128),
});
