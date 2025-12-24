import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ArchivesPage() {
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

  return (
    <div className="container py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Archives</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse past volumes and issues of the Journal of Information Technology and Teacher Education.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {issues.map((issue) => (
          <Link key={issue.id} href={`/archives/${issue.id}`} className="group">
            <Card className="h-full transition-shadow hover:shadow-lg border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{issue.year}</Badge>
                    <span className="text-sm text-muted-foreground">{issue._count.submissions} Articles</span>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  Volume {issue.volume}, Issue {issue.number}
                </CardTitle>
                {issue.title && (
                  <CardDescription className="font-medium text-foreground/80 mt-2">
                    {issue.title}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                    Click to view table of contents
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {issues.length === 0 && (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No published issues found.</p>
            </div>
        )}
      </div>
    </div>
  );
}
