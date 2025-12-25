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
      // Capture version if present
      const matches = fileUrl.match(/cloudinary\.com\/[^/]+\/([^/]+)\/([^/]+)\/(?:v(\d+)\/)?(.+)$/);

      if (matches) {
        const [_, resourceType, type, version, publicIdWithExt] = matches;
        
        console.log("Download processing:", { resourceType, type, version, publicIdWithExt });

        let publicId = publicIdWithExt;
        let format = undefined;

        // For image types (which PDFs often are), we need to separate ID and format
        if (resourceType === "image") {
            const lastDotIndex = publicIdWithExt.lastIndexOf(".");
            if (lastDotIndex !== -1) {
                publicId = publicIdWithExt.substring(0, lastDotIndex);
                format = publicIdWithExt.substring(lastDotIndex + 1);
            }
        }

        try {
            const signedUrl = cloudinary.url(publicId, {
                resource_type: resourceType,
                type: type,
                format: format,
                version: version, // Include version if found
                sign_url: true,
                expires_at: Math.floor(Date.now() / 1000) + 3600,
                secure: true,
            });
            
            console.log("Generated signed URL:", signedUrl);
            return NextResponse.redirect(signedUrl);

        } catch (e) {
            console.error("Error generating signed URL:", e);
        }
      }
    }

    // Fallback for non-Cloudinary or unparseable URLs
    return NextResponse.redirect(fileUrl);
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
