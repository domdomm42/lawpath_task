import { z } from "zod";

export const addressSchema = z.object({
  postcode: z
    .string()
    .trim()
    .min(1, { message: "Postcode is required" })
    .length(4, { message: "Postcode must be exactly 4 digits" })
    .regex(/^[0-9]{4}$/, { message: "Postcode must contain only numbers" }),
  suburb: z
    .string()
    .trim()
    .min(1, { message: "Suburb is required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Suburb must contain only letters and spaces",
    }),
  state: z.string().trim().min(1, { message: "State is required" }),
});

export type AddressFormData = z.infer<typeof addressSchema>;
