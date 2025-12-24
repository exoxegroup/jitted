"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { sendDecisionEmail, sendReviewerInvitationEmail, sendVettingRejectionEmail } from "@/lib/email";

import { z } from "zod";

const vetSubmissionSchema = z.object({
  submissionId: z.string().uuid(),
  action: z.enum(["APPROVE", "REJECT"]),
});

export async function vetSubmission(submissionId: string, action: "APPROVE" | "REJECT") {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  vetSubmissionSchema.parse({ submissionId, action });

  const newStatus = action === "APPROVE" ? "UNDER_REVIEW" : "REJECTED";

  const submission = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: newStatus,
      history: {
        create: {
          status: newStatus,
          changedBy: session.user.id,
          comment: action === "APPROVE" ? "Approved for review" : "Rejected during vetting",
        },
      },
    },
    include: { author: true }
  });

  if (newStatus === "REJECTED" && submission.author.email) {
      await sendVettingRejectionEmail(submission.author.email, submission.author.name || "Author", submission.title);
  }

  revalidatePath("/dashboard/editor");
  revalidatePath(`/dashboard/editor/submission/${submissionId}`);
}

const assignReviewerSchema = z.object({
  submissionId: z.string().uuid(),
  reviewerId: z.string().uuid(),
});

export async function assignReviewer(submissionId: string, reviewerId: string) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  assignReviewerSchema.parse({ submissionId, reviewerId });

  // Check if already assigned
  const existingReview = await prisma.review.findFirst({
    where: {
      submissionId,
      reviewerId,
    },
  });

  if (existingReview) {
    throw new Error("Reviewer already assigned");
  }

  await prisma.review.create({
    data: {
      submissionId,
      reviewerId,
    },
  });

  // Send email notification
  const reviewer = await prisma.user.findUnique({ where: { id: reviewerId } });
  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });

  if (reviewer?.email && submission) {
      await sendReviewerInvitationEmail(reviewer.email, reviewer.name || "Reviewer", submission.title, submission.abstract);
  }

  revalidatePath(`/dashboard/editor/submission/${submissionId}`);
}

const makeDecisionSchema = z.object({
  submissionId: z.string().uuid(),
  decision: z.enum(["ACCEPT", "REJECT", "REVISION"]),
  comment: z.string().optional(),
});

export async function makeDecision(submissionId: string, decision: "ACCEPT" | "REJECT" | "REVISION", comment?: string) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  makeDecisionSchema.parse({ submissionId, decision, comment });

  let newStatus: "ACCEPTED" | "REJECTED" | "REVISION_REQUESTED";

  switch (decision) {
    case "ACCEPT":
      newStatus = "ACCEPTED";
      break;
    case "REJECT":
      newStatus = "REJECTED";
      break;
    case "REVISION":
      newStatus = "REVISION_REQUESTED";
      break;
  }

  const submission = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: newStatus,
      history: {
        create: {
          status: newStatus,
          changedBy: session.user.id,
          comment: comment || `Decision: ${decision}`,
        },
      },
    },
    include: { author: true }
  });

  if (submission.author.email) {
      await sendDecisionEmail(submission.author.email, submission.author.name || "Author", submission.title, decision, comment);
  }

  revalidatePath("/dashboard/editor");
  revalidatePath(`/dashboard/editor/submission/${submissionId}`);
}

export async function removeReviewer(reviewId: string) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
      throw new Error("Unauthorized");
    }

    await prisma.review.delete({
        where: { id: reviewId }
    });
}
