"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { z } from "zod";

const submitRevisionSchema = z.object({
  submissionId: z.string().uuid(),
  fileUrl: z.string().url(),
});

export async function submitRevision(submissionId: string, fileUrl: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Input validation
  try {
    submitRevisionSchema.parse({ submissionId, fileUrl });
  } catch (error) {
    throw new Error("Invalid input data");
  }

  // Verify ownership
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission || submission.authorId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  if (submission.status !== "REVISION_REQUESTED") {
    throw new Error("Submission is not awaiting revision");
  }

  // Update submission
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      fileUrl: fileUrl,
      status: "UNDER_REVIEW", // Send back to review loop
      history: {
        create: {
          status: "UNDER_REVIEW",
          changedBy: session.user.id,
          comment: "Revision uploaded by author",
        },
      },
    },
  });

  revalidatePath("/dashboard/author");
  revalidatePath(`/dashboard/author/submission/${submissionId}`);
  revalidatePath(`/dashboard/editor/submission/${submissionId}`);
}
