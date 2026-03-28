import { z } from 'zod';

export const createCaseSchema = z.object({
  patientName: z.string().min(2, "Patient Name is required").max(100),
  age: z.coerce.number().int().min(1, "Please enter a valid age").max(120, "Age must be realistic"),
  location: z.string().min(2, "Location is required"),
  disease: z.string().min(2, "Disease/Condition is required"),
  category: z.enum(['Cancer', 'Accident', 'Pediatric', 'Transplant', 'Cardiac', 'Other']),
  hospitalName: z.string().min(2, "Hospital Name is required"),
  treatmentNeeded: z.string().min(5, "Treatment details are required"),
  description: z.string().min(20, "Please provide a more detailed description"),
  headline: z.string().min(10, "A catchy headline is required").max(100),
  targetAmount: z.coerce.number().optional(),
  helpType: z.array(z.enum(['fund', 'blood', 'marrow', 'other'])).min(1, "Select at least one help type"),
  otherHelpDetail: z.string().optional(),
  isUrgent: z.boolean().default(false),
  documents: z.array(z.any()).optional(),
  patientImage: z.any().optional(),
  coverImage: z.any().optional(),
}).superRefine((data, ctx) => {
  if (data.helpType.includes('fund') && (!data.targetAmount || data.targetAmount <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Target amount is required when requesting funds",
      path: ["targetAmount"],
    });
  }
  
  if (data.helpType.includes('other') && (!data.otherHelpDetail || data.otherHelpDetail.length < 5)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please describe what other help you need",
      path: ["otherHelpDetail"],
    });
  }
});

export type CreateCaseFormData = z.infer<typeof createCaseSchema>;
