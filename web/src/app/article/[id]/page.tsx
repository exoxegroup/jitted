import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Calendar, User, BookOpen } from "lucide-react";

import { ShareButtons } from "@/components/ShareButtons";

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

  // Parse other authors if JSON
  const otherAuthors = article.otherAuthors 
    ? (typeof article.otherAuthors === 'string' ? JSON.parse(article.otherAuthors) : article.otherAuthors) as Array<{name: string, affiliation: string}>
    : [];

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="mb-8">
        {article.issue ? (
            <Link
            href={`/archives/${article.issue.id}`}
            className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors mb-4"
            >
            <ArrowLeft className="h-4 w-4" /> Back to Issue
            </Link>
        ) : article.manualIssueText ? (
            <Link
            href={`/archives/manual/${encodeURIComponent(article.manualIssueText)}`}
            className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors mb-4"
            >
            <ArrowLeft className="h-4 w-4" /> Back to Collection
            </Link>
        ) : (
             <Link
            href={`/archives`}
            className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors mb-4"
            >
            <ArrowLeft className="h-4 w-4" /> Back to Archives
            </Link>
        )}
      </div>

      <article className="space-y-8">
        <header className="space-y-4 border-b pb-8">
            <div className="flex gap-2 mb-4">
                <Badge variant="outline">Original Research</Badge>
                {article.issue ? (
                    <Badge variant="secondary">
                        Vol {article.issue.volume}, No {article.issue.number} ({article.issue.year})
                    </Badge>
                ) : article.manualIssueText ? (
                     <Badge variant="secondary">
                        Collection
                    </Badge>
                ) : (
                     <Badge variant="secondary">
                        Recent Publication
                    </Badge>
                )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
                {article.title}
            </h1>

            {/* Manual Issue Text if exists */}
            {article.manualIssueText && (
                <div className="p-4 bg-slate-50 border rounded-md text-sm text-slate-700 italic">
                    <BookOpen className="inline-block w-4 h-4 mr-2" />
                    {article.manualIssueText}
                </div>
            )}

            <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-4">
                {/* Main Author */}
                <div className="flex items-center gap-2 font-medium text-foreground">
                    <User className="h-4 w-4" />
                    <span>{article.displayAuthor || article.author.name}</span>
                </div>
                {(article.displayAffiliation || article.author.affiliation) && (
                    <div className="ml-6 text-slate-600">
                        {article.displayAffiliation || article.author.affiliation}
                    </div>
                )}

                {/* Other Authors */}
                {otherAuthors.length > 0 && (
                    <div className="mt-2 space-y-2 ml-6 border-l-2 pl-4 border-slate-200">
                        {otherAuthors.map((author, idx) => (
                            <div key={idx} className="mb-2">
                                <div className="font-medium text-foreground">{author.name}</div>
                                <div className="text-slate-600">{author.affiliation}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>Published: {new Date(article.publishedAt || article.updatedAt).toLocaleDateString()}</span>
                </div>
            </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-4">Abstract</h2>
                    <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {article.abstract}
                    </p>
                </section>
                
                {/* Keywords - Support both legacy comma-separated and new string array */}
                {(article.keywords || (article.manualKeywords && article.manualKeywords.length > 0)) && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Keywords</h2>
                        <ul className="list-disc list-inside space-y-1 text-slate-700">
                             {/* Legacy CSV keywords */}
                            {article.keywords?.split(",").map((keyword, i) => (
                                <li key={`legacy-${i}`}>
                                    {keyword.trim()}
                                </li>
                            ))}
                            {/* New Array keywords */}
                            {article.manualKeywords?.map((keyword, i) => (
                                <li key={`manual-${i}`}>
                                    {keyword}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                 {/* References */}
                {article.references && (
                    <section>
                        <h2 className="text-xl font-bold mb-4">References</h2>
                        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-slate-100">
                             <ul className="list-disc list-outside ml-4 space-y-2">
                                {article.references.split('\n').filter(r => r.trim().length > 0).map((ref, i) => (
                                    <li key={i}>{ref}</li>
                                ))}
                            </ul>
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
                        <div className="text-sm text-muted-foreground text-center">
                            No PDF available
                        </div>
                    )}
                </div>

                {/* Share Buttons */}
                <ShareButtons title={article.title} />
            </aside>
        </div>
      </article>
    </div>
  );
}
