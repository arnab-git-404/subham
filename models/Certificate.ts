import mongoose, { Schema, Document } from "mongoose";

export interface ICertificateDoc extends Document {
  title: string;
  category: "Certificate" | "Workshop" | "Internship" | "Award";
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  description?: string;
  fileUrl: string;
  filePublicId?: string;
  fileType: "image" | "pdf";
  tags: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificateDoc>(
  {
    title: { type: String, required: true, maxlength: 200 },
    category: {
      type: String,
      required: true,
      enum: ["Certificate", "Workshop", "Internship", "Award"],
    },
    issuer: { type: String, required: true, maxlength: 200 },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date },
    description: { type: String, maxlength: 2000 },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String },
    fileType: { type: String, enum: ["image", "pdf"], required: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CertificateSchema.index({ category: 1, featured: -1 });
CertificateSchema.index({ createdAt: -1 });

export const Certificate =
  mongoose.models.Certificate ??
  mongoose.model<ICertificateDoc>("Certificate", CertificateSchema);
