import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { IssueActions } from "@/components/editor/issue-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const issue = await prisma.issue.findUnique({
    where: { id },
    include: {
      submissions: {
        include: {
          author: { select: { name: true } },
        },
      },
    },
  });

  if (!issue) {
    redirect("/dashboard/editor/issues");
  }

  // Fetch accepted submissions that are NOT yet in an issue
  const acceptedSubmissions = await prisma.submission.findMany({
    where: {
      status: "ACCEPTED",
      issueId: null,
    },
    select: {
      id: true,
      title: true,
      author: {
        select: { name: true },
      },
    },
  });

  return (
    <div className="container py-8 space-y-8">
      <div>
        <Link
          href="/dashboard/editor/issues"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Issues
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Vol {issue.volume}, No {issue.number} ({issue.year})
            </h1>
            {issue.title && <p className="text-xl text-primary mt-1">{issue.title}</p>}
          </div>
          <div className="flex items-center gap-4">
            <Badge className="text-lg" variant={issue.isPublished ? "default" : "secondary"}>
              {issue.isPublished ? "Published" : "Draft"}
            </Badge>
            <IssueActions 
                issueId={issue.id} 
                isPublished={issue.isPublished}
                acceptedSubmissions={acceptedSubmissions} 
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Table of Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issue.submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    No articles in this issue yet.
                  </TableCell>
                </TableRow>
              ) : (
                issue.submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.title}</TableCell>
                    <TableCell>{sub.author.name}</TableCell>
                    <TableCell>
                      <Link 
                        href={`/dashboard/editor/submission/${sub.id}`}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" /> View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
