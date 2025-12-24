"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { z } from "zod";

const createIssueSchema = z.object({
  volume: z.number().int().positive(),
  number: z.number().int().positive(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  title: z.string().optional(),
});

export async function createIssue(data: {
  volume: number;
  number: number;
  year: number;
  title?: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const { volume, number, year, title } = createIssueSchema.parse(data);

  // Check uniqueness
  const existing = await prisma.issue.findUnique({
    where: {
      volume_number: {
        volume: data.volume,
        number: data.number,
      },
    },
  });

  if (existing) {
    throw new Error("Issue already exists");
  }

  await prisma.issue.create({
    data: {
      volume: data.volume,
      number: data.number,
      year: data.year,
      title: data.title,
    },
  });

  revalidatePath("/dashboard/editor/issues");
}

export async function publishIssue(issueId: string) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  await prisma.issue.update({
    where: { id: issueId },
    data: { isPublished: true },
  });

  revalidatePath("/dashboard/editor/issues");
  revalidatePath("/archives");
}

export async function publishArticle(submissionId: string, issueId: string) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission || submission.status !== "ACCEPTED") {
    throw new Error("Submission must be accepted before publishing");
  }

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: "PUBLISHED",
      issueId: issueId,
      history: {
        create: {
          status: "PUBLISHED",
          changedBy: session.user.id,
          comment: "Published to issue",
        },
      },
    },
  });

  revalidatePath(`/dashboard/editor/issues/${issueId}`);
  revalidatePath(`/dashboard/editor/submission/${submissionId}`);
}
