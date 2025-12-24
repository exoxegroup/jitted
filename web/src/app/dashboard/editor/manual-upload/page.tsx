import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ManualUploadForm } from "./form";

export default async function ManualUploadPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Manual Publication Upload</h1>
      <ManualUploadForm issues={issues} />
    </div>
  );
}
