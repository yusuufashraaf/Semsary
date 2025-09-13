import z from "zod";

const imageSchema = z.object({
  id_image: z
    .any()
    .refine((files) => files?.length === 1, "An image of your ID is required.")
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

type ImageFormType = z.infer<typeof imageSchema>;

export {imageSchema,type ImageFormType};