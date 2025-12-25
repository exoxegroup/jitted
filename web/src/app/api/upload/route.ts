import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    // In production (Render), this should be a mounted disk path if persistence is needed across deploys
    // For now, we use a local 'uploads' directory relative to the project root
    const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), "uploads");
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, ""); // Sanitize
    const filename = `${uniqueSuffix}-${originalName}`;
    const filepath = join(uploadDir, filename);

    // Write file to disk
    await writeFile(filepath, buffer);

    // Return the URL
    // We'll serve this via a new API route: /api/uploads/[filename]
    const url = `/api/uploads/${filename}`;

    return NextResponse.json({ 
        url, 
        success: true 
    });

  } catch (error) {
    console.error("Local upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
