import { successResponse, errorResponse } from "@/lib/api-response";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearAuthCookie();
    return successResponse({ message: "Logged out successfully" });
  } catch (error) {
    console.error("POST /api/auth/logout error:", error);
    return errorResponse("Logout failed");
  }
}
