import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, FileText } from "lucide-react";
import Link from "next/link";
import { VettingButtons } from "@/components/editor/vetting-buttons";
import { ReviewerAssignment } from "@/components/editor/reviewer-assignment";
import { DecisionButtons } from "@/components/editor/decision-buttons";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      author: true,
      reviews: {
        include: {
          reviewer: true,
        },
      },
      history: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!submission) {
    notFound();
  }

  // Fetch available reviewers
  const reviewers = await prisma.user.findMany({
    where: { role: "REVIEWER" },
    select: {
      id: true,
      name: true,
      email: true,
      affiliation: true,
    },
  });

  return (
    <div className="container py-8 space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4 pl-0 hover:pl-0">
          <Link href="/dashboard/editor">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{submission.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <span>By {submission.author.name}</span>
              <span>•</span>
              <span>{submission.author.affiliation}</span>
              <span>•</span>
              <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Badge className="text-base px-4 py-1">
            {submission.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Abstract Section */}
          <Card>
            <CardHeader>
              <CardTitle>Abstract</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7">{submission.abstract}</p>
              {submission.keywords && (
                <div className="mt-4">
                  <span className="font-semibold">Keywords: </span>
                  {submission.keywords}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manuscript File */}
          <Card>
            <CardHeader>
              <CardTitle>Manuscript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Full Paper PDF</p>
                    <p className="text-xs text-muted-foreground">Original Submission</p>
                  </div>
                </div>
                {submission.fileUrl ? (
                  <Button variant="outline" asChild>
                    <a href={`/api/download/${submission.id}`} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                ) : (
                  <span className="text-sm text-red-500">File missing</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section - Only show if Under Review or later */}
          {["UNDER_REVIEW", "REVISION_REQUESTED", "ACCEPTED", "REJECTED"].includes(
            submission.status
          ) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Peer Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {submission.reviews.length === 0 ? (
                  <p className="text-muted-foreground italic">No reviewers assigned yet.</p>
                ) : (
                  <div className="space-y-4">
                    {submission.reviews.map((review) => (
                      <div key={review.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{review.reviewer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {review.reviewer.affiliation}
                            </p>
                          </div>
                          <Badge variant={review.score ? "default" : "outline"}>
                            {review.score ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                        {review.recommendation && (
                            <div className="mt-2 text-sm">
                                <strong>Recommendation:</strong> {review.recommendation}
                            </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          {/* Actions Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Editorial Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vetting Stage */}
              {submission.status === "SUBMITTED" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Vetting
                  </h3>
                  <VettingButtons submissionId={submission.id} />
                  <p className="text-xs text-muted-foreground">
                    Accepting moves status to &quot;Under Review&quot;. Rejecting is final.
                  </p>
                </div>
              )}

              {/* Assignment Stage */}
              {submission.status === "UNDER_REVIEW" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Assign Reviewers
                  </h3>
                  <ReviewerAssignment
                    submissionId={submission.id}
                    reviewers={reviewers}
                  />
                  <Separator />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Final Decision
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Review submissions before making a decision.
                  </p>
                  <DecisionButtons submissionId={submission.id} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* History Log */}
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {submission.history.map((item) => (
                        <div key={item.id} className="flex flex-col space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">{item.status.replace("_", " ")}</span>
                                <span className="text-muted-foreground text-xs">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                            {item.comment && <p className="text-muted-foreground">{item.comment}</p>}
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
