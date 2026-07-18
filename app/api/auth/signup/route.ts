import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AdminUser } from "@/models/AdminUser";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import { signupSchema } from "@/schemas/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten());
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await AdminUser.findOne({ email: parsed.data.email });
    if (existingUser) {
      return errorResponse("An admin with this email already exists", 409);
    }

    // Hash password and create user
    const passwordHash = await hashPassword(parsed.data.password);
    const user = await AdminUser.create({
      email: parsed.data.email,
      passwordHash,
      role: "admin",
    });

    // Create token and set auth cookie
    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return successResponse(
      {
        message: "Signup successful",
        user: {
          email: user.email,
          role: user.role,
        },
      },
      201
    );
  } catch (error) {
    console.error("POST /api/auth/signup error:", error);
    return errorResponse("Signup failed");
  }
}
