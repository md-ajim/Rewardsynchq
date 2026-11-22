// lib/validators.ts
import { z } from 'zod';

export const supportFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.enum(
    ['cashback_issue', 'withdraw_issue', 'account_issue', 'general_question'],
    {
      required_error: 'You must select a subject',
    }
  ),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be under 1000 characters'),
});


export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false).optional(),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;