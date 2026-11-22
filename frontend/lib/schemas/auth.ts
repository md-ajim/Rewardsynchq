// lib/schemas/auth.ts
import * as z from 'zod';

// Schema for the initial login step (email + password)
export const LoginSchema = z.object({
  username: z.string().min(3,'Please enter a valid username or email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms & Conditions and Privacy Policy to continue',
  }),
});

// Schema for the 2FA (OTP) step
// export const OtpSchema = z.object({
//   otp: z.string().min(6, 'Your one-time password must be 6 characters').max(6),
// });

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type OtpFormValues = z.infer<typeof OtpSchema>;


// Schema for Step 1: User Details
export const RegisterSchema = z
  .object({
    username: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    countryCode: z.string().min(1, 'Please select your country'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms & Conditions and Privacy Policy',
    }),
    referral_code: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Show error on the confirmPassword field
  });

// Schema for Step 2: OTP Verification
export const OtpSchema = z.object({
  otp: z.string().min(6, 'Your one-time password must be 6 characters').max(6),
});

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
// export type OtpFormValues = z.infer<typeof OtpSchema>;


export const EmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const ResetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type EmailFormValues = z.infer<typeof EmailSchema>;
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;