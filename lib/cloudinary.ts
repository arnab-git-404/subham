import { v2 as cloudinary } from "cloudinary";

export interface UploadResult {
  secure_url: string;
  public_id: string;
  resource_type: string;
}

function ensureConfigured() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadFile(
  file: string,
  folder = "portfolio"
): Promise<UploadResult> {
  ensureConfigured();
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "auto",
    max_bytes: 5 * 1024 * 1024,
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "pdf"],
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
    resource_type: result.resource_type,
  };
}

export async function deleteFile(publicId: string): Promise<void> {
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
