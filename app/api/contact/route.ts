import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";
import { successResponse, errorResponse } from "@/lib/api-response";
import { contactMessageSchema } from "@/schemas/message";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactMessageSchema.parse(body);

    await connectDB();

    const message = await Message.create({
      name: parsed.name,
      email: parsed.email,
      subject: parsed.subject ?? undefined,
      message: parsed.message,
    });

    return successResponse(
      { id: message._id, message: "Message sent successfully" },
      201
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validation failed: " + error.message);
    }
    return errorResponse("Failed to send message");
  }
}
