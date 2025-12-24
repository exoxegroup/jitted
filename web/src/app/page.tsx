import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch latest 2 published articles, sorted by publication date descending
  const latestArticles = await prisma.submission.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 2,
    include: {
      issue: true,
      author: {
        select: { name: true }
      }
    }
  });

  // Determine the issue label for the latest articles
  let issueLabel = "Recent Publications";
  let issueLink = "/archives";

  if (latestArticles.length > 0) {
      const first = latestArticles[0];
      if (first.issue) {
          issueLabel = `Vol. ${first.issue.volume} No. ${first.issue.number} (${first.issue.year})`;
      } else if (first.manualIssueText) {
          issueLabel = first.manualIssueText;
      }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/jitted-design.png')] opacity-10 bg-cover bg-center animate__animated animate__pulse animate__slower animate__infinite" />
        <div className="container relative z-10 flex flex-col items-center text-center space-y-8 animate__animated animate__fadeInUp">
          
           <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-4xl pt-4">
             Journal of Issues in Technical Teacher Education (JITTED)
           </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
             A publication of Federal College of Education (Technical) Potiskum PMB 1013. Potiskum, Yobe State - Nigeria.
           </p>

          {/* Call for Papers Card (Moved Up) */}
          <div className="w-full max-w-4xl bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8 text-left grid md:grid-cols-2 gap-8 items-center hover:bg-white/10 transition-colors">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Call for Papers: Vol. 4 No. 1</h2>
              <p className="text-slate-300">
                The Editorial Board invites interested scholars to submit original research papers for Vol. 4 No. 1. 
                Focus areas include advancements in technical education, innovative teaching methods, and vocational training.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                 <div className="inline-flex items-center text-green-400 font-medium">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    Now Accepting Submissions
                 </div>
                 <Link href="/guidelines" className="text-primary-foreground hover:text-white underline underline-offset-4 decoration-primary/50 hover:decoration-white transition-all">
                    View Guidelines
                 </Link>
              </div>
            </div>
            
            {/* Latest Issue Preview */}
            <div className="bg-slate-950/50 rounded-lg p-6 border border-white/5">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                    <h3 className="font-semibold text-white">Latest Issue</h3>
                    <span className="text-xs text-slate-400">{issueLabel}</span>
                </div>
                <div className="space-y-4">
                    {latestArticles.length > 0 ? (
                        latestArticles.map((article) => (
                            <div key={article.id} className="space-y-1">
                                <Link href={`/article/${article.id}`}>
                                    <h4 className="text-sm font-medium text-slate-200 line-clamp-2 hover:text-white transition-colors">
                                        {article.title}
                                    </h4>
                                </Link>
                                <p className="text-xs text-slate-500">{article.displayAuthor || article.author.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 italic">No articles published yet.</p>
                    )}
                    
                    <Link href={issueLink} className="inline-block text-xs text-primary-foreground hover:text-white mt-2">
                        View Full Table of Contents →
                    </Link>
                </div>
            </div>
          </div>

 
         
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="text-base transition-transform hover:scale-105" asChild>
              <Link href="/archives">Browse Archives</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base text-black border-white hover:bg-white/10 hover:text-white transition-transform hover:scale-105" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About / Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg bg-slate-50 hover:shadow-xl transition-shadow duration-300 animate__animated animate__fadeInUp animate__delay-1s">
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Academic Excellence</CardTitle>
                <CardDescription>
                  Peer-reviewed research fostering innovation in technical education.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-lg bg-slate-50 hover:shadow-xl transition-shadow duration-300 animate__animated animate__fadeInUp animate__delay-1s">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Global Community</CardTitle>
                <CardDescription>
                  Connecting scholars, researchers, and educators from around the world.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-lg bg-slate-50 hover:shadow-xl transition-shadow duration-300 animate__animated animate__fadeInUp animate__delay-1s">
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Digital Access</CardTitle>
                <CardDescription>
                  Easy online submission and open access to published research.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
