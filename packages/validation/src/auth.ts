import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Enter your phone number or email."),

  password: z.string().min(8, "Password must contain at least 8 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),

    lastName: z.string().trim().min(1, "Last name is required"),

    phone: z.string().trim().min(1, "Phone number is required"),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .or(z.literal("")),

    password: z.string().min(8, "Password must contain at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  identifier: z.string().trim().min(3, "Enter your phone number or email."),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must contain at least 8 characters."),

    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const mfaSchema = z.object({
  code: z.string().trim().min(6, "Enter your verification code."),
});

export type MfaFormValues = z.infer<typeof mfaSchema>;
