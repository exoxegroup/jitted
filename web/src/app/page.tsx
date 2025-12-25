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
      <section className="relative py-12 md:py-20 bg-slate-50 text-slate-900 overflow-hidden">
        {/* Background Image - Adjusted opacity for visibility on light theme */}
        <div className="absolute inset-0 bg-[url('/images/jitted-design.png')] opacity-15 bg-cover bg-center animate__animated animate__pulse animate__slower animate__infinite" />
        
        {/* Overlay gradient to ensure text readability */}
        <div className="absolute inset-0 bg-white/60"></div>

        <div className="container relative z-10 flex flex-col items-center text-center space-y-8 animate__animated animate__fadeInUp">
          
           <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-4xl pt-4 text-slate-900">
             Journal of Issues in Technical Teacher Education (JITTED)
           </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto font-medium">
             A publication of Federal College of Education (Technical) Potiskum PMB 1013. Potiskum, Yobe State - Nigeria.
           </p>

          {/* Call for Papers Card (Moved Up) */}
          <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl p-8 mb-8 text-left grid md:grid-cols-2 gap-8 items-center shadow-xl hover:shadow-2xl transition-all">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Call for Papers: Vol. 4 No. 1</h2>
              <p className="text-slate-600">
                The Editorial Board invites interested scholars to submit original research papers for Vol. 4 No. 1. 
                Focus areas include advancements in technical education, innovative teaching methods, and vocational training.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                 <div className="inline-flex items-center text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    Now Accepting Submissions
                 </div>
                 <Link href="/guidelines" className="text-primary hover:text-primary/80 underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all self-center">
                    View Guidelines
                 </Link>
              </div>
            </div>
            
            {/* Latest Issue Preview */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 shadow-inner">
                <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                    <h3 className="font-semibold text-slate-900">Latest Issue</h3>
                    <span className="text-xs text-slate-500 font-medium">{issueLabel}</span>
                </div>
                <div className="space-y-4">
                    {latestArticles.length > 0 ? (
                        latestArticles.map((article) => (
                            <div key={article.id} className="space-y-1 group">
                                <Link href={`/article/${article.id}`}>
                                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h4>
                                </Link>
                                <p className="text-xs text-slate-500">{article.displayAuthor || article.author.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 italic">No articles published yet.</p>
                    )}
                    
                    <Link href={issueLink} className="inline-block text-xs font-semibold text-primary hover:text-primary/80 mt-2 hover:translate-x-1 transition-transform">
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
