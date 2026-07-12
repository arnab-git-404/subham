import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AdminUser } from "@/models/AdminUser";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { comparePassword, createToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/schemas/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten());
    }

    await connectDB();

    const user = await AdminUser.findOne({ email: parsed.data.email });
    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    const isValid = await comparePassword(
      parsed.data.password,
      user.passwordHash
    );
    if (!isValid) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return successResponse({
      message: "Login successful",
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return errorResponse("Login failed");
  }
}
