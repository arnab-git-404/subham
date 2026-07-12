import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export function successResponse<T>(data: T, status = 200) {
  const body: ApiResponse<T> = { success: true, data };
  return NextResponse.json(body, { status });
}

export function errorResponse(error: string, status = 500) {
  const body: ApiResponse = { success: false, error };
  return NextResponse.json(body, { status });
}

export function validationErrorResponse(errors: unknown) {
  const body: ApiResponse = {
    success: false,
    error: "Validation failed",
    data: errors,
  };
  return NextResponse.json(body, { status: 400 });
}

export function unauthorizedResponse() {
  return errorResponse("Unauthorized", 401);
}

export function notFoundResponse(resource = "Resource") {
  return errorResponse(`${resource} not found`, 404);
}
