import { z } from 'zod';

export const phoneOtpSchema = z.object({
  phoneOTP: z.string().min(6, "Code must be 6 digits").max(6, "Code must be 6 digits"),
});

export type PhoneOtpType = z.infer<typeof phoneOtpSchema>;