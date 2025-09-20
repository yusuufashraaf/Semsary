import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{7,14}$/;

export const changePhoneSchema = z.object({
  phone_number: z
    .string()
    .min(1, "New phone number is required.") 
    .regex(phoneRegex, "Please enter a valid phone number."),
    
  password: z
    .string()
    .min(1, "Password is required to confirm this change."), 
});

export type ChangePhoneSchemaType = z.infer<typeof changePhoneSchema>;