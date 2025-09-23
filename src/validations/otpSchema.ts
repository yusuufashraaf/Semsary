import {z} from "zod";

const otpSchema = z.object({
  emailOTP: z.string().min(6, "OTP must be 6 characters").max(6, "OTP must be 6 characters"),
});

type OtpType = z.infer<typeof otpSchema>;

export { otpSchema, type OtpType };