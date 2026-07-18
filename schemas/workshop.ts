import { z } from "zod";

export const workshopSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  organizer: z.string().min(1, "Organizer is required").max(200),
  date: z.string().min(1, "Date is required"),
  location: z.string().max(200).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  certificateFileUrl: z.string().url().optional().nullable(),
  skillsGained: z.array(z.string()).default([]),
  order: z.number().int().min(0, "Order must be 0 or greater"),
});

export const workshopCreateSchema = workshopSchema;
export const workshopUpdateSchema = workshopSchema.partial();

export type WorkshopInput = z.infer<typeof workshopSchema>;
export type WorkshopUpdateInput = z.infer<typeof workshopUpdateSchema>;
