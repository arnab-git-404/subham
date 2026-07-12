import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Workshop } from "@/models/Workshop";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const workshop = await Workshop.findById(id).lean();
    if (!workshop) return notFoundResponse("Workshop");

    return successResponse(workshop);
  } catch (error) {
    console.error("GET /api/workshops/[id] error:", error);
    return errorResponse("Failed to fetch workshop");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();

    await connectDB();

    const workshop = await Workshop.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!workshop) return notFoundResponse("Workshop");

    return successResponse(workshop);
  } catch (error) {
    console.error("PUT /api/workshops/[id] error:", error);
    return errorResponse("Failed to update workshop");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;
    await connectDB();

    const workshop = await Workshop.findByIdAndDelete(id).lean();
    if (!workshop) return notFoundResponse("Workshop");

    return successResponse({ message: "Workshop deleted" });
  } catch (error) {
    console.error("DELETE /api/workshops/[id] error:", error);
    return errorResponse("Failed to delete workshop");
  }
}
