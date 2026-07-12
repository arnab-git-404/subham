import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();

    await connectDB();

    const message = await Message.findByIdAndUpdate(
      id,
      { read: body.read ?? true },
      { new: true }
    ).lean();

    if (!message) return notFoundResponse("Message");

    return successResponse(message);
  } catch (error) {
    console.error("PATCH /api/messages/[id] error:", error);
    return errorResponse("Failed to update message");
  }
}
