import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().max(100).optional(),
  tagline: z.string().max(200).optional(),
  bio: z.string().max(5000).optional(),
  year: z.string().max(50).optional(),
  institution: z.string().max(200).optional(),
  skills: z.array(z.string()).optional(),
  resumeUrl: z.string().url().optional().nullable(),
  socialLinks: z
    .object({
      linkedin: z.string().url().optional().nullable(),
      github: z.string().url().optional().nullable(),
      instagram: z.string().url().optional().nullable(),
      email: z.string().email().optional().nullable(),
    })
    .optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
