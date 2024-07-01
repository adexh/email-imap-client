import { z } from "zod";

export const userSchema = z.object({
    name: z.string(),
    password: z.string().min(4).max(100),
    email: z.string().email(),
});

export const loginSchema = z.object({
    password: z.string(),
    email: z.string().email()
})

export type UserParams = z.infer<typeof userSchema>;
export type LoginParams = z.infer<typeof loginSchema>;