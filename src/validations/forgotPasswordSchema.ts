import { z } from 'zod';
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;
export {forgotPasswordSchema, type ForgotPasswordType}