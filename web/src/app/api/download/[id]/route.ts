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
      
      // Case 1: Legacy PDF uploaded as "image" type
      // These often break without a signature or correct format handling
      if (fileUrl.includes("/image/upload/") && fileUrl.endsWith(".pdf")) {
        try {
            // Regex to extract version and public_id from: 
            // .../image/upload/v12345/folder/id.pdf OR .../image/upload/folder/id.pdf
            const matches = fileUrl.match(/\/image\/upload\/(?:v(\d+)\/)?(.+)\.pdf$/);
            
            if (matches) {
                const [_, version, publicId] = matches;
                
                // Generate a fresh signed URL for this specific resource
                const signedUrl = cloudinary.url(publicId, {
                    resource_type: "image", // It was stored as image
                    format: "pdf",          // Force PDF format
                    version: version,       // Keep version
                    sign_url: true,         // Sign it
                    expires_at: Math.floor(Date.now() / 1000) + 3600,
                    secure: true,
                    // "fl_attachment" forces download instead of view
                    flags: "attachment" 
                });

                console.log("Recovered legacy Cloudinary URL:", signedUrl);
                return NextResponse.redirect(signedUrl);
            }
        } catch (e) {
            console.error("Failed to sign legacy URL:", e);
        }
      }

      // Case 2: New "raw" uploads or standard images
      // We forced new uploads to be 'raw' and 'public', so they should just work.
      return NextResponse.redirect(fileUrl);
    }

    // Check if it's a local URL (starts with /api/uploads)
    if (fileUrl.startsWith("/api/uploads")) {
        return NextResponse.redirect(new URL(fileUrl, req.url));
    }

    // Fallback for non-Cloudinary or unparseable URLs
    return NextResponse.redirect(fileUrl);
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
