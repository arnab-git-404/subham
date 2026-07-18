import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary once
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary environment variables are missing.");
}

export interface UploadResult {
  secure_url: string;
  public_id: string;
  resource_type: string;
}

export async function uploadFile(
  file: string,
  folder = "portfolio"
): Promise<UploadResult> {
  try {
    const result: UploadApiResponse = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
      overwrite: true,
      unique_filename: true,
      use_filename: false,
      invalidate: true,
      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "pdf",
      ],
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload file to Cloudinary.");
  }
}

export async function deleteFile(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("Failed to delete file from Cloudinary.");
  }
}

export default cloudinary;