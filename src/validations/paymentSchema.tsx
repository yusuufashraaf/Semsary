import { z } from 'zod';

// Zod schema for validation
const paymentSchema = z.object({
  amount_cents: z.string()
    .min(1, "Amount is required")
    .regex(/^\d+$/, "Amount must be a valid number")
    .refine((val) => parseInt(val) > 0, "Amount must be greater than 0"),
  currency: z.string()
    .min(1, "Currency is required")
    .length(3, "Currency must be 3 characters (e.g., EGP, USD)"),
  shipping_data: z.object({
    first_name: z.string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    last_name: z.string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    phone_number: z.string()
      .min(1, "Phone number is required")
      .regex(/^\d{11}$/, "Phone number must be 11 digits"),
    email: z.string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
  })
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export{paymentSchema,type PaymentFormData}