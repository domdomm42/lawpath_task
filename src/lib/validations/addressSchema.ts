import { z } from "zod";

export const addressSchema = z.object({
  postcode: z
    .string()
    .min(1, { message: "Postcode is required" })
    .length(4, { message: "Postcode must be exactly 4 digits" })
    .regex(/^[0-9]{4}$/, { message: "Postcode must contain only numbers" }),
  suburb: z.string().min(1, { message: "Suburb is required" }).trim(),
  state: z.string().min(1, { message: "State is required" }),
});

export type AddressFormData = z.infer<typeof addressSchema>;
