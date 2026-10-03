import {
  z,
} from "zod";

export const identifierVerificationSchema =
  z.object({
    code: z
      .string()
      .trim()
      .min(
        1,
        "Verification code is required.",
      )
      .regex(
        /^\d{6}$/,
        "Enter the 6-digit verification code.",
      ),
  });

export type IdentifierVerificationFormValues =
  z.infer<
    typeof identifierVerificationSchema
  >;