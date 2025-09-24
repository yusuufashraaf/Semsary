import {z} from 'zod'

const signUpSchema =z.object({
    first_name:z.string().min(1,{message:"first name is required"}),
    last_name:z.string().min(1,{message:"last name is required"}),
    email: z.string().min(1, { message: "Email address is required" }).email(),
    phone_number: z
    .string()
    .min(8, { message: "Phone number must be at least 8 digits" })
    .max(15, { message: "Phone number must be at most 15 digits" })
    .regex(/^\+?[0-9]{8,15}$/, { message: "Invalid phone number" }),
    password:z
    .string()
    .min(8,{ message: "Password must be at least 8 characters longs" })
    .regex(/.*[!@#$%^&*()_+{}|[\]\\:";'<>?,./].*/, {
    message: "Password should contain at least 1 special character",
    }),
    password_confirmation: z
    .string()
    .min(1, { message: "Confirm Password is required" }),
    }).refine((input) => input.password === input.password_confirmation, {
        message: "Password and Confirm Password does not match",
        path: ["confirmPassword"],
    })

type signUpType =z.infer<typeof signUpSchema>

export { signUpSchema, type signUpType };
