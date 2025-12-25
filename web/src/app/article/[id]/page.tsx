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

            <div className="flex flex-col gap-4 text-sm text-muted-foreground mt-6">
                {(() => {
                    // Combine main author and other authors
                    const allAuthors = [
                        {
                            name: article.displayAuthor || article.author.name,
                            affiliation: (article.displayAffiliation || article.author.affiliation || "").trim()
                        },
                        ...otherAuthors.map(a => ({
                            name: a.name,
                            affiliation: (a.affiliation || "").trim()
                        }))
                    ];

                    // Group by affiliation
                    const groups: { affiliation: string, authors: string[] }[] = [];
                    const affiliationIndex = new Map<string, number>();

                    allAuthors.forEach(author => {
                        const aff = author.affiliation;
                        // If affiliation is empty, treat as unique to avoid grouping unrelated people under "no affiliation"
                        // OR group them if that's desired. Usually empty affiliation means unknown.
                        // Let's treat empty affiliation as a group for now to be consistent, but maybe unique is safer?
                        // If I treat it as a key "", they will group. 
                        // Let's assume grouping is fine for empty too, or maybe we want to keep them separate?
                        // If 2 authors have no affiliation, grouping them as "Name 1, Name 2" with no affiliation text below is fine.
                        
                        if (aff && affiliationIndex.has(aff)) {
                            const index = affiliationIndex.get(aff)!;
                            groups[index].authors.push(author.name);
                        } else if (aff) {
                            groups.push({ affiliation: aff, authors: [author.name] });
                            affiliationIndex.set(aff, groups.length - 1);
                        } else {
                            // No affiliation - keep separate or group?
                            // Let's keep separate to be safe, as "No Affiliation" isn't a shared property usually.
                            // But wait, if they are separate, they just show up as names.
                            // Let's just add them as a new group without recording in index (so they don't merge)
                            groups.push({ affiliation: "", authors: [author.name] });
                        }
                    });

                    return groups.map((group, idx) => (
                        <div key={idx} className="flex flex-col">
                            <div className="flex items-start gap-2 font-medium text-foreground">
                                <User className="h-4 w-4 shrink-0 mt-1" />
                                <span>{group.authors.join(", ")}</span>
                            </div>
                            {group.affiliation && (
                                <div className="ml-6 text-slate-600">
                                    {group.affiliation}
                                </div>
                            )}
                        </div>
                    ));
                })()}
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Published: {new Date(article.publishedAt || article.updatedAt).toLocaleDateString()}</span>
            </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-4">Abstract</h2>
                    <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap text-justify">
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
                        <div className="text-sm text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-100">
                             <div className="space-y-2">
                                {article.references.split('\n').filter(r => r.trim().length > 0).map((ref, i) => (
                                    <p key={i} className="pl-8 -indent-8 text-justify">
                                        {ref}
                                    </p>
                                ))}
                            </div>
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
