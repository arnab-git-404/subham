import mongoose, { Schema, Document } from "mongoose";

export interface IWorkshopDoc extends Document {
  title: string;
  organizer: string;
  date: Date;
  location?: string;
  description?: string;
  certificateFileUrl?: string;
  skillsGained: string[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkshopSchema = new Schema<IWorkshopDoc>(
  {
    title: { type: String, required: true, maxlength: 200 },
    organizer: { type: String, required: true, maxlength: 200 },
    date: { type: Date, required: true },
    location: { type: String, maxlength: 200 },
    description: { type: String, maxlength: 5000 },
    certificateFileUrl: { type: String },
    skillsGained: [{ type: String }],
  },
  { timestamps: true }
);

WorkshopSchema.index({ date: -1 });

export const Workshop =
  mongoose.models.Workshop ??
  mongoose.model<IWorkshopDoc>("Workshop", WorkshopSchema);
