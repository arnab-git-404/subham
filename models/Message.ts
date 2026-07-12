import mongoose, { Schema, Document } from "mongoose";

export interface IMessageDoc extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessageDoc>(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 200 },
    subject: { type: String, maxlength: 200 },
    message: { type: String, required: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MessageSchema.index({ read: 1, createdAt: -1 });

export const Message =
  mongoose.models.Message ??
  mongoose.model<IMessageDoc>("Message", MessageSchema);
