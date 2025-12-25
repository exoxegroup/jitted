import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  // Verify Cloudinary configuration
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("Cloudinary configuration missing");
    return NextResponse.json({ message: "Server configuration error: Cloudinary credentials missing" }, { status: 500 });
  }

  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine resource type based on MIME type
    // Use 'raw' for PDFs to ensure they are downloadable and not treated as images (which can cause 404s if processing fails)
    const isPdf = file.type === "application/pdf";
    const resourceType = isPdf ? "raw" : "auto";

    // Upload to Cloudinary using a stream
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "jitted-submissions", // Optional folder
          resource_type: resourceType,
          // For raw files, we might want to preserve the filename, but random ID is safer for uniqueness
          use_filename: true, 
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Write buffer to stream
      uploadStream.end(buffer);
    });

    // Return the Secure URL
    return NextResponse.json({ 
        url: result.secure_url, 
        success: true 
    });

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
