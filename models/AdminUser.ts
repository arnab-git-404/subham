import mongoose, { Schema, Document } from "mongoose";

export interface IAdminUserDoc extends Document {
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}

const AdminUserSchema = new Schema<IAdminUserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin", enum: ["admin"] },
  },
  { timestamps: true }
);

export const AdminUser =
  mongoose.models.AdminUser ??
  mongoose.model<IAdminUserDoc>("AdminUser", AdminUserSchema);
