import { z } from "zod";

export const organizationServiceSchema = z.enum([
  "WATER_PROVIDER",
  "WASTE_PRODUCER",
  "RECYCLER",
  "PROCESSOR",
  "TRANSPORTER",
]);

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2, "Organization name is required."),

  registrationNumber: z.string().trim(),

  countryId: z
  .string()
  .trim()
  .min(
    1,
    "Choose a country.",
  ),

  services: z
    .array(organizationServiceSchema)
    .min(1, "Select at least one service."),
});

export type OrganizationService = z.infer<typeof organizationServiceSchema>;

export type CreateOrganizationFormValues = z.infer<
  typeof createOrganizationSchema
>;
