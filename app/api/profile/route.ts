import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/models/Profile";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { profileSchema } from "@/schemas/profile";

export async function GET() {
  try {
    await connectDB();
    const profile = await Profile.findOne().lean();

    if (!profile) {
      // Return default profile if none exists
      return successResponse({
        fullName: "Subham Das",
        tagline: "BMLT Student | Future Medical Lab Technologist",
        bio: "",
        year: "3rd Year BMLT",
        institution: "",
        skills: [],
        socialLinks: {},
      });
    }

    return successResponse(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return errorResponse("Failed to fetch profile");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const parsed = profileSchema.parse(body);

    await connectDB();

    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: parsed },
      { upsert: true, new: true }
    ).lean();

    return successResponse(profile);
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validation failed: " + error.message);
    }
    return errorResponse("Failed to update profile");
  }
}
