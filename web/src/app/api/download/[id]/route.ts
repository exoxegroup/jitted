import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const submission = await prisma.submission.findUnique({
      where: { id },
      select: { fileUrl: true },
    });

    if (!submission || !submission.fileUrl) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileUrl = submission.fileUrl;

    // Check if it's a Cloudinary URL
    if (fileUrl.includes("cloudinary.com")) {
      // Extract details from URL
      // Format: https://res.cloudinary.com/<cloud>/<resource_type>/<type>/v<ver>/<public_id>.<ext>
      // Or: https://res.cloudinary.com/<cloud>/<resource_type>/<type>/<public_id>.<ext>
      
      // Regex to capture: resource_type, type, and the rest (public_id + ext)
      // Example match: .../raw/upload/v12345/folder/file.pdf
      const matches = fileUrl.match(/cloudinary\.com\/[^/]+\/([^/]+)\/([^/]+)\/(?:v\d+\/)?(.+)$/);

      if (matches) {
        const [_, resourceType, type, publicIdWithExt] = matches;
        
        // Determine public_id (remove extension if not raw)
        let publicId = publicIdWithExt;
        if (resourceType !== "raw") {
            const lastDotIndex = publicId.lastIndexOf(".");
            if (lastDotIndex !== -1) {
                publicId = publicId.substring(0, lastDotIndex);
            }
        }

        // Generate signed URL
        // We use type 'authenticated' to force a signature check, or 'upload' with sign_url.
        // If the original file is 'upload' (public) but restricted, a signed URL usually bypasses restrictions.
        // However, we must match the original 'type' (e.g. 'upload') for the signature to be valid for that resource.
        
        const signedUrl = cloudinary.url(publicId, {
          resource_type: resourceType,
          type: type, 
          sign_url: true,
          expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
          secure: true,
        });

        return NextResponse.redirect(signedUrl);
      }
    }

    // Fallback for non-Cloudinary or unparseable URLs
    return NextResponse.redirect(fileUrl);
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
