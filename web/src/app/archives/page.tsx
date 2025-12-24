import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ArchivesPage() {
  // Fetch issues with counts
  const issues = await prisma.issue.findMany({
    where: { isPublished: true },
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

  // Fetch manual submissions
  const manualSubmissions = await prisma.submission.findMany({
    where: {
      status: "PUBLISHED",
      issueId: null,
      manualIssueText: { not: null },
    },
    select: {
      manualIssueText: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: 'desc',
    }
  });

  // Group manual submissions
  const manualGroups = manualSubmissions.reduce((acc, curr) => {
    const key = curr.manualIssueText!;
    if (!acc[key]) {
      acc[key] = {
        name: key,
        count: 0,
        latestDate: curr.publishedAt,
      };
    }
    acc[key].count++;
    if (curr.publishedAt && acc[key].latestDate && curr.publishedAt > acc[key].latestDate!) {
        acc[key].latestDate = curr.publishedAt;
    }
    return acc;
  }, {} as Record<string, { name: string; count: number; latestDate: Date | null }>);

  const sortedManualGroups = Object.values(manualGroups).sort((a, b) => {
      if (a.latestDate && b.latestDate) return b.latestDate.getTime() - a.latestDate.getTime();
      return 0;
  });

  return (
    <div className="container py-12 space-y-12 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Archives</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse past volumes and issues. Select an issue to view its articles.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Standard Issues */}
        {issues.map((issue) => (
          <Link key={issue.id} href={`/archives/${issue.id}`} className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                   <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <BookOpen className="h-6 w-6" />
                   </div>
                   <Badge variant="outline" className="font-mono">
                      {issue._count.submissions} Articles
                   </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Vol. {issue.volume} No. {issue.number} ({issue.year})
                </CardTitle>
                {issue.title && (
                  <CardDescription className="line-clamp-2">
                    {issue.title}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                 <p className="text-sm font-medium text-muted-foreground group-hover:text-primary/80 transition-colors flex items-center">
                    View Collection &rarr;
                 </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Manual Collections */}
        {sortedManualGroups.map((group) => (
          <Link key={group.name} href={`/archives/manual/${encodeURIComponent(group.name)}`} className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 border-primary/10 hover:border-primary/30 bg-slate-50/50">
               <CardHeader>
                <div className="flex justify-between items-start mb-4">
                   <div className="h-10 w-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                      <Layers className="h-6 w-6" />
                   </div>
                   <Badge variant="secondary" className="font-mono">
                      {group.count} Articles
                   </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {group.name}
                </CardTitle>
                {group.latestDate && (
                  <CardDescription>
                    Last Updated: {group.latestDate.toLocaleDateString()}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                 <p className="text-sm font-medium text-muted-foreground group-hover:text-primary/80 transition-colors flex items-center">
                    View Collection &rarr;
                 </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
       
       {issues.length === 0 && sortedManualGroups.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
                No published issues found.
            </div>
        )}
    </div>
  );
}
