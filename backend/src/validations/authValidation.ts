import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, "Full Name is required").min(3, "Name must be at least 3 characters long"),
  
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  
  password: z.string().min(1, "Password is required")
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number"),
  
  role: z.string().refine(val => ['donor', 'patient'].includes(val), {
    message: "Role must be either donor or patient"
  }),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  
  password: z.string().min(1, "Password is required"),
});
