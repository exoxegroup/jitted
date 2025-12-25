import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ManualCollectionPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  const collectionName = decodeURIComponent(group);

  const submissions = await prisma.submission.findMany({
    where: { 
        manualIssueText: collectionName,
        status: "PUBLISHED" 
    },
    orderBy: { title: "asc" },
    include: {
      author: { select: { name: true, affiliation: true } },
    },
  });

  if (submissions.length === 0) {
    notFound();
  }

  // Use the date of the most recent submission as the collection date
  const latestDate = submissions.reduce((latest, sub) => {
      const subDate = sub.publishedAt || sub.createdAt;
      return subDate > latest ? subDate : latest;
  }, new Date(0));

  return (
    <div className="container py-12 space-y-8 max-w-4xl mx-auto">
      <Link
        href="/archives"
        className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Archives
      </Link>

      <div className="space-y-4 border-b pb-8">
        <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">
            {collectionName}
            </h1>
            <Badge variant="secondary" className="text-lg">Collection</Badge>
        </div>
        <p className="text-muted-foreground">
            Last updated: {latestDate.toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        {submissions.map((article) => (
          <Card key={article.id} className="group hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Link href={`/article/${article.id}`}>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                        {article.displayAuthor || article.author.name}
                    </span>
                    {(article.displayAffiliation || article.author.affiliation) && (
                        <span> • {article.displayAffiliation || article.author.affiliation}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-2">
                    {article.abstract}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/article/${article.id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Abstract
                        </Link>
                    </Button>
                    {article.fileUrl && (
                        <Button size="sm" asChild>
                            <a href={`/api/download/${article.id}`} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                PDF
                            </a>
                        </Button>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
