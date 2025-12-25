import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { ReviewForm } from "@/components/reviewer/review-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ReviewerSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "REVIEWER") {
    redirect("/dashboard");
  }

  // 1. Verify Assignment & Fetch Review Data
  const review = await prisma.review.findFirst({
    where: {
      submissionId: id,
      reviewerId: session.user.id,
    },
  });

  if (!review) {
    // Not assigned to this reviewer
    return notFound();
  }

  // 2. Fetch Submission Details (BLIND: No author info)
  const submission = await prisma.submission.findUnique({
    where: { id },
  });

  if (!submission) {
    return notFound();
  }

  return (
    <div className="container py-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Review Assignment
        </h1>
        <p className="text-muted-foreground">
          Please review the manuscript below and submit your evaluation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {/* Manuscript Details */}
          <Card>
            <CardHeader>
              <CardTitle>Manuscript Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Title</h3>
                <p className="text-lg">{submission.title}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-1">Abstract</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {submission.abstract}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Files</h3>
                <div className="space-y-2">
                  {submission.fileUrl ? (
                    <div
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Manuscript PDF</p>
                          <p className="text-xs text-muted-foreground">
                            Original Submission
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/api/download/${submission.id}`} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No file available.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Assigned:</span>
                  <span className="text-sm font-medium">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Review Status:</span>
                  <Badge variant={review.score ? "default" : "secondary"}>
                    {review.score ? "Completed" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Form */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50/50">
              <CardTitle>Evaluation</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ReviewForm 
                reviewId={review.id} 
                existingReview={{
                  score: review.score,
                  feedback: review.feedback,
                  recommendation: review.recommendation
                }} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
