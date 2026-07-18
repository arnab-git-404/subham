import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Workshop } from "@/models/Workshop";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { workshopSchema } from "@/schemas/workshop";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const search = searchParams.get("search");

    await connectDB();

    const query: Record<string, unknown> = {};
    if (year) {
      const yearNum = parseInt(year);
      query.date = {
        $gte: new Date(`${yearNum}-01-01`),
        $lte: new Date(`${yearNum}-12-31`),
      };
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const workshops = await Workshop.find(query)
      .sort({ order: 1, date: -1 })
      .lean();

    return successResponse(workshops);
  } catch (error) {
    console.error("GET /api/workshops error:", error);
    return errorResponse("Failed to fetch workshops");
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const parsed = workshopSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten());
    }

    await connectDB();

    const workshop = await Workshop.create(parsed.data);

    return successResponse(workshop, 201);
  } catch (error) {
    console.error("POST /api/workshops error:", error);
    return errorResponse("Failed to create workshop");
  }
}
