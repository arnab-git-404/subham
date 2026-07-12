import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Certificate } from "@/models/Certificate";
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

    const certificate = await Certificate.findById(id).lean();
    if (!certificate) return notFoundResponse("Certificate");

    return successResponse(certificate);
  } catch (error) {
    console.error("GET /api/certificates/[id] error:", error);
    return errorResponse("Failed to fetch certificate");
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

    const certificate = await Certificate.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!certificate) return notFoundResponse("Certificate");

    return successResponse(certificate);
  } catch (error) {
    console.error("PUT /api/certificates/[id] error:", error);
    return errorResponse("Failed to update certificate");
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

    const certificate = await Certificate.findByIdAndDelete(id).lean();
    if (!certificate) return notFoundResponse("Certificate");

    // TODO: Also delete file from Cloudinary using certificate.filePublicId

    return successResponse({ message: "Certificate deleted" });
  } catch (error) {
    console.error("DELETE /api/certificates/[id] error:", error);
    return errorResponse("Failed to delete certificate");
  }
}
