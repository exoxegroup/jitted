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
      const matches = fileUrl.match(/cloudinary\.com\/[^/]+\/([^/]+)\/([^/]+)\/(?:v\d+\/)?(.+)$/);

      if (matches) {
        const [_, resourceType, type, publicIdWithExt] = matches;
        
        // Strategy: Try to resolve the resource using Cloudinary Admin API to get the exact public_id and type
        // This handles cases where the URL format might be ambiguous (e.g. PDF as image vs raw)
        
        let validPublicId = publicIdWithExt;
        let validResourceType = resourceType;
        let validFormat = "";

        // Try to strip extension for the API check if it looks like an image/pdf
        const lastDotIndex = publicIdWithExt.lastIndexOf(".");
        const publicIdNoExt = lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
        const ext = lastDotIndex !== -1 ? publicIdWithExt.substring(lastDotIndex + 1) : "";

        try {
            // Attempt 1: Check as is (or without extension for image types)
            // If resourceType is 'image', public_id usually doesn't have extension in the DB
            let searchId = resourceType === 'raw' ? publicIdWithExt : publicIdNoExt;
            
            // We can't easily use the Admin API in high-traffic (rate limits), but for a download link it's acceptable fallback
            // However, to be faster, let's try to generate a signed URL that works for "Authenticated" resources.
            
            // If the original URL was "image/upload", it's likely an image-type resource.
            // For PDFs stored as images, we often need to append .pdf to the public_id in the URL, but NOT in the signature if it's not part of the ID.
            
            // Let's generate a signed URL using the Cloudinary SDK's standard method
            // The SDK handles the intricacies of signature generation if we provide the correct public_id.
            
            // If it's an image/pdf, we usually want the extension in the final URL.
            const format = (resourceType === 'image' && ext) ? ext : undefined;
            
            const signedUrl = cloudinary.url(publicIdNoExt, {
                resource_type: resourceType,
                type: type,
                format: format,
                sign_url: true,
                expires_at: Math.floor(Date.now() / 1000) + 3600,
                secure: true,
            });

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
