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
      // Direct redirect for all Cloudinary URLs.
      // We are now forcing 'raw' resource type and 'public' access for new uploads, 
      // which simplifies retrieval and avoids the signature/format issues of 'image' type PDFs.
      return NextResponse.redirect(fileUrl);
    }

    // Check if it's a local URL (starts with /api/uploads)
    if (fileUrl.startsWith("/api/uploads")) {
        // Construct full URL for redirect, or just let Next.js handle it if relative
        // Actually, we can just redirect to the relative path
        return NextResponse.redirect(new URL(fileUrl, req.url));
    }

    // Fallback for non-Cloudinary or unparseable URLs
    return NextResponse.redirect(fileUrl);
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
