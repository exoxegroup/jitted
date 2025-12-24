import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, FileText } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";
  
  // If no query, just show the search bar
  let results: {
    id: string;
    title: string;
    abstract: string;
    keywords: string | null;
    author: { name: string | null };
    issue: { volume: number; number: number; year: number } | null;
  }[] = [];
  
  if (query) {
    results = await prisma.submission.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { abstract: { contains: query, mode: "insensitive" } },
          { keywords: { contains: query, mode: "insensitive" } },
          { 
            author: { 
              name: { contains: query, mode: "insensitive" } 
            } 
          }
        ],
      },
      include: {
        author: { select: { name: true } },
        issue: { select: { volume: true, number: true, year: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
  }

  async function searchAction(formData: FormData) {
    "use server";
    const q = formData.get("q") as string;
    if (q) {
      redirect(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Search Journal</h1>
        <p className="text-muted-foreground">
          Find articles by title, author, keyword, or abstract.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full">
        <form action={searchAction} className="flex gap-2">
          <Input 
            name="q" 
            placeholder="Search term..." 
            defaultValue={query}
            className="flex-1"
          />
          <Button type="submit">
            <SearchIcon className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {query && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold">
              Results for &quot;{query}&quot;
            </h2>
            <span className="text-muted-foreground text-sm">
              {results.length} found
            </span>
          </div>

          <div className="grid gap-4">
            {results.length > 0 ? (
              results.map((article) => (
                <Card key={article.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-4">
                      <Link href={`/article/${article.id}`} className="hover:underline">
                        <CardTitle className="text-xl text-primary">{article.title}</CardTitle>
                      </Link>
                      {article.issue && (
                        <Badge variant="outline" className="shrink-0">
                          Vol {article.issue.volume}, No {article.issue.number}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-foreground mb-2">
                      {article.author.name}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {article.abstract}
                    </p>
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <Link href={`/article/${article.id}`}>
                        Read more <FileText className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No articles found matching your criteria.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
