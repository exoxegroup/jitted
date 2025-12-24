"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { z } from "zod";

const submitReviewSchema = z.object({
  score: z.number().int().min(1).max(10), // Assuming 1-10 scale
  feedback: z.string().min(10),
  recommendation: z.string(),
});

export async function submitReview(
  reviewId: string,
  data: {
    score: number;
    feedback: string;
    recommendation: string;
  }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "REVIEWER") {
    throw new Error("Unauthorized");
  }

  const { score, feedback, recommendation } = submitReviewSchema.parse(data);

  // Verify ownership
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.reviewerId !== session.user.id) {
    throw new Error("Review not found or unauthorized");
  }

  // Update review
  await prisma.review.update({
    where: { id: reviewId },
    data: {
      score: data.score,
      feedback: data.feedback,
      recommendation: data.recommendation,
    },
  });

  revalidatePath("/dashboard/reviewer");
  revalidatePath(`/dashboard/reviewer/submission/${review.submissionId}`);
}
