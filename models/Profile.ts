import mongoose, { Schema, Document } from "mongoose";

export interface IProfileDoc extends Document {
  fullName: string;
  tagline: string;
  bio: string;
  year: string;
  institution: string;
  skills: string[];
  resumeUrl?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    email?: string;
  };
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfileDoc>(
  {
    fullName: { type: String, default: "Subham Das" },
    tagline: { type: String, default: "BMLT Student | Future Medical Lab Technologist" },
    bio: { type: String, default: "" },
    year: { type: String, default: "3rd Year BMLT" },
    institution: { type: String, default: "" },
    skills: [{ type: String }],
    resumeUrl: { type: String },
    socialLinks: {
      linkedin: { type: String },
      github: { type: String },
      instagram: { type: String },
      email: { type: String },
    },
  },
  { timestamps: true }
);

export const Profile =
  mongoose.models.Profile ??
  mongoose.model<IProfileDoc>("Profile", ProfileSchema);
