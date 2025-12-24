import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Calendar, User } from "lucide-react";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.submission.findUnique({
    where: { 
        id,
        status: "PUBLISHED" 
    },
    include: {
      author: { select: { name: true, affiliation: true } },
      issue: true,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="mb-8">
        {article.issue && (
            <Link
            href={`/archives/${article.issue.id}`}
            className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors mb-4"
            >
            <ArrowLeft className="h-4 w-4" /> Back to Issue
            </Link>
        )}
      </div>

      <article className="space-y-8">
        <header className="space-y-4 border-b pb-8">
            <div className="flex gap-2 mb-4">
                <Badge variant="outline">Original Research</Badge>
                {article.issue && (
                    <Badge variant="secondary">
                        Vol {article.issue.volume}, No {article.issue.number} ({article.issue.year})
                    </Badge>
                )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
                {article.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-foreground">{article.author.name}</span>
                    {article.author.affiliation && (
                        <span>({article.author.affiliation})</span>
                    )}
                </div>
                <div className="hidden md:block">•</div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Published: {new Date(article.updatedAt).toLocaleDateString()}</span>
                </div>
            </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-4">Abstract</h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        {article.abstract}
                    </p>
                </section>
                
                {article.keywords && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Keywords</h2>
                        <div className="flex flex-wrap gap-2">
                            {article.keywords.split(",").map((keyword, i) => (
                                <Badge key={i} variant="secondary" className="px-3 py-1">
                                    {keyword.trim()}
                                </Badge>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <aside className="md:col-span-1 space-y-6">
                <div className="p-6 bg-slate-50 rounded-lg border space-y-4">
                    <h3 className="font-bold">Download</h3>
                    {article.fileUrl ? (
                        <Button className="w-full" size="lg" asChild>
                            <a href={article.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </a>
                        </Button>
                    ) : (
                        <p className="text-sm text-muted-foreground">PDF not available.</p>
                    )}
                </div>

                <div className="p-6 rounded-lg border space-y-4">
                    <h3 className="font-bold">Citation</h3>
                    <div className="text-xs font-mono bg-slate-100 p-3 rounded">
                        {article.author.name} ({article.issue?.year}). {article.title}. 
                        JITTED, {article.issue?.volume}({article.issue?.number}).
                    </div>
                </div>
            </aside>
        </div>
      </article>
    </div>
  );
}
