import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Certificate } from "@/models/Certificate";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { certificateSchema } from "@/schemas/certificate";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    await connectDB();

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (featured === "true") query.featured = true;

    const certs = await Certificate.find(query)
      .sort({ featured: -1, issueDate: -1 })
      .limit(limit ? parseInt(limit) : 50)
      .lean();

    return successResponse(certs);
  } catch (error) {
    console.error("GET /api/certificates error:", error);
    return errorResponse("Failed to fetch certificates");
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const parsed = certificateSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten());
    }

    await connectDB();

    const certificate = await Certificate.create(parsed.data);

    return successResponse(certificate, 201);
  } catch (error) {
    console.error("POST /api/certificates error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return validationErrorResponse(error);
    }
    return errorResponse("Failed to create certificate");
  }
}
