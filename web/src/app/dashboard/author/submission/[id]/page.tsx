import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, ArrowLeft, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { RevisionUploadForm } from "@/components/author/revision-upload-form";

export default async function AuthorSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      history: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!submission) {
    notFound();
  }

  // Verify ownership
  if (submission.authorId !== session.user.id) {
    return notFound();
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4 pl-0 hover:pl-0">
          <Link href="/dashboard/author">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{submission.title}</h1>
            <p className="text-muted-foreground mt-1">
              Submitted on {new Date(submission.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge className="text-base px-4 py-1">
            {submission.status.replace("_", " ")}
          </Badge>
        </div>
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
                <h3 className="font-semibold mb-1">Abstract</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {submission.abstract}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Current File</h3>
                {submission.fileUrl ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <Download className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Manuscript PDF</p>
                        <p className="text-xs text-muted-foreground">
                          Latest Version
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/api/download/${submission.id}`} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-red-500">File missing</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Revision Request Section */}
          {submission.status === "REVISION_REQUESTED" && (
            <Card className="border-orange-200 bg-orange-50/30">
              <CardHeader>
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="h-5 w-5" />
                  <CardTitle>Revision Requested</CardTitle>
                </div>
                <CardDescription>
                  The editors have requested revisions for your manuscript. Please review the feedback below and upload a corrected version.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-md border border-orange-100">
                    <h4 className="font-semibold text-sm mb-2">Editor&apos;s Feedback:</h4>
                    <p className="text-sm text-muted-foreground">
                        {/* Find the last history item that might contain the decision comment */}
                        {submission.history.find(h => h.status === "REVISION_REQUESTED")?.comment || "Please check your email for detailed feedback."}
                    </p>
                </div>
                
                <Separator className="bg-orange-200" />
                
                <div>
                    <h4 className="font-semibold mb-2">Upload Revision</h4>
                    <RevisionUploadForm submissionId={submission.id} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
            {/* Timeline / History */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                        {submission.history.map((item) => (
                            <div key={item.id} className="relative flex items-start group">
                                <div className="absolute left-0 h-5 w-5 rounded-full border-2 border-slate-300 bg-white group-hover:border-blue-500 transition-colors" />
                                <div className="ml-8">
                                    <p className="text-sm font-medium">{item.status.replace("_", " ")}</p>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                    {item.comment && (
                                        <p className="text-xs text-muted-foreground bg-slate-50 p-2 rounded border">
                                            {item.comment}
                                        </p>
                                    )}
                                </div>
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
