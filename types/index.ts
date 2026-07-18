// Shared types for Subham Das Portfolio

export interface ICertificate {
  _id: string;
  title: string;
  category: "Certificate" | "Workshop" | "Internship" | "Award";
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  description?: string;
  fileUrl: string;
  filePublicId?: string;
  fileType: "image" | "pdf";
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IWorkshop {
  _id: string;
  title: string;
  organizer: string;
  date: string;
  location?: string;
  description?: string;
  certificateFileUrl?: string;
  skillsGained: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface IAdminUser {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface IProfile {
  _id: string;
  fullName: string;
  tagline: string;
  bio: string;
  year: string;
  institution: string;
  avatarUrl?: string;
  skills: string[];
  resumeUrl?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    facebook?: string;
    email?: string;
  };
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface CertificateQuery {
  category?: string;
  featured?: boolean;
  limit?: number;
}

export interface WorkshopQuery {
  year?: number;
  search?: string;
}
