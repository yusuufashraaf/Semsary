import { z } from 'zod';

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long."),
  password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"], 
});
type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
export {resetPasswordSchema, type ResetPasswordType}