import {
  z,
} from "zod";

export const profileSchema =
  z.object({
    firstName:
      z
        .string()
        .trim()
        .min(
          1,
          "First name is required.",
        ),

    lastName:
      z
        .string()
        .trim()
        .min(
          1,
          "Last name is required.",
        ),

    phone:
      z
        .string()
        .trim()
        .min(
          3,
          "Enter a valid phone number.",
        ),

    email:
      z
        .string()
        .trim()
        .email(
          "Enter a valid email address.",
        )
        .or(
          z.literal(""),
        ),
  });

export type ProfileFormValues =
  z.infer<
    typeof profileSchema
  >;