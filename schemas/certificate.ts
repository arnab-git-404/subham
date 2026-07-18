import { z } from "zod";

export const certificateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  category: z.enum(["Certificate", "Workshop", "Internship", "Award"]),
  issuer: z.string().min(1, "Issuer is required").max(200),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  fileUrl: z.string().url("Invalid file URL"),
  filePublicId: z.string().optional().nullable(),
  fileType: z.enum(["image", "pdf"]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().min(0, "Order must be 0 or greater"),
});

export const certificateCreateSchema = certificateSchema;
export const certificateUpdateSchema = certificateSchema.partial();

export type CertificateInput = z.infer<typeof certificateSchema>;
export type CertificateUpdateInput = z.infer<typeof certificateUpdateSchema>;
