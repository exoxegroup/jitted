import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreateIssueDialog } from "@/components/editor/create-issue-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";

export default async function IssuesPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const issues = await prisma.issue.findMany({
    orderBy: [
      { year: "desc" },
      { volume: "desc" },
      { number: "desc" },
    ],
    include: {
      _count: {
        select: { submissions: true },
      },
    },
  });

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issue Management</h1>
          <p className="text-muted-foreground">
            Create and manage journal volumes and issues.
          </p>
        </div>
        <CreateIssueDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {issues.map((issue) => (
          <Card key={issue.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    Vol {issue.volume}, No {issue.number} ({issue.year})
                  </CardTitle>
                  {issue.title && (
                    <CardDescription className="mt-1 font-medium text-primary">
                      {issue.title}
                    </CardDescription>
                  )}
                </div>
                <Badge variant={issue.isPublished ? "default" : "secondary"}>
                  {issue.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                <span>{issue._count.submissions} Articles</span>
                <span>Created {new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/dashboard/editor/issues/${issue.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Manage Content
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        {issues.length === 0 && (
            <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No issues created yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}
