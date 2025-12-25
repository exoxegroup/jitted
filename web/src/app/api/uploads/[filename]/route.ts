import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import mime from "mime";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Security: Prevent path traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), "uploads");
    const filepath = join(uploadDir, filename);

    if (!existsSync(filepath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = await readFile(filepath);
    const contentType = mime.getType(filepath) || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error("File serve error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
