'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const OtherAuthorSchema = z.object({
  name: z.string(),
  affiliation: z.string(),
});

const ManualUploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  fileUrl: z.string().min(1, "File is required"),
  issueId: z.string().optional(),
  manualIssueText: z.string().min(5, "Issue details must be at least 5 characters").max(200, "Issue details cannot exceed 200 characters").optional(),
  displayAuthor: z.string().min(1, "Author name is required"),
  displayAffiliation: z.string().optional(),
  publishedAt: z.string().optional(), // ISO date string
  otherAuthors: z.array(OtherAuthorSchema).optional(),
  references: z.string().optional(),
  manualKeywords: z.array(z.string()).optional(),
});

export async function manualUploadAction(data: z.infer<typeof ManualUploadSchema>) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    return { error: "Unauthorized" };
  }

  const result = ManualUploadSchema.safeParse(data);
  if (!result.success) {
    return { error: "Invalid data", issues: result.error.issues };
  }

  const { 
    title, 
    abstract, 
    fileUrl, 
    issueId, 
    manualIssueText,
    displayAuthor, 
    displayAffiliation, 
    publishedAt,
    otherAuthors,
    references,
    manualKeywords
  } = result.data;

  // Validation: Must have either issueId or manualIssueText
  if (!issueId && !manualIssueText) {
    return { error: "Please specify an Issue (select existing or enter details)." };
  }

  try {
    await prisma.submission.create({
      data: {
        title,
        abstract,
        fileUrl,
        issueId: issueId || null,
        manualIssueText,
        authorId: session.user.id, // Assigned to current user (editor) as placeholder
        displayAuthor,
        displayAffiliation,
        otherAuthors: otherAuthors ?? undefined,
        references,
        manualKeywords: manualKeywords || [],
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        status: "PUBLISHED",
      },
    });

    revalidatePath("/archives");
    if (issueId) revalidatePath(`/archives/${issueId}`);
    revalidatePath("/dashboard/editor");
    return { success: true };
  } catch (error) {
    console.error("Manual upload error:", error);
    // Return detailed error for debugging
    return { error: `Failed to create submission: ${error instanceof Error ? error.message : "Unknown DB error"}` };
  }
}
