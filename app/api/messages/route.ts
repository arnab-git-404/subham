import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const read = searchParams.get("read");
    const limit = parseInt(searchParams.get("limit") || "50");

    await connectDB();

    const query: Record<string, unknown> = {};
    if (read === "true") query.read = true;
    if (read === "false") query.read = false;

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return successResponse(messages);
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return errorResponse("Failed to fetch messages");
  }
}
