import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, ArrowRight, User } from "lucide-react";
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
      <section className="relative py-12 md:py-24 bg-[#e8f4f1] text-slate-900 overflow-hidden">
        {/* Background Pattern - subtle geometric or gradient if needed, keeping it clean for now */}
        
        <div className="container relative z-10 flex flex-col md:flex-row items-center gap-12 animate__animated animate__fadeInUp">
          
          {/* Left Column: Text and CTAs */}
          <div className="flex-1 text-center md:text-left space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Journal of Issues in <span className="text-primary">Technical Teacher Education</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
              A peer-reviewed publication of Federal College of Education (Technical) Potiskum, Yobe State - Nigeria.
              <span className="block mt-2 text-slate-500 text-base">PMB 1013, Potiskum.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Button size="lg" className="text-base h-12 px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105" asChild>
                <Link href="/archives">Browse Archives</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base h-12 px-8 border-slate-300 hover:bg-white hover:text-primary transition-all hover:scale-105" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Journal Cover "Sample" */}
          <div className="flex-1 w-full max-w-md relative flex justify-center">
             <div className="relative group perspective-1000">
                <div className="relative w-[280px] h-[400px] md:w-[320px] md:h-[460px] rounded-r-2xl rounded-l-sm shadow-2xl transition-transform duration-500 transform group-hover:rotate-y-6 group-hover:scale-105 bg-white border-l-4 border-l-slate-200">
                    {/* Spine Effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-300 to-slate-100 rounded-l-sm z-20"></div>
                    
                    {/* Cover Image */}
                    <img 
                        src="/images/jitted-design.png" 
                        alt="JITTED Journal Cover" 
                        className="w-full h-full object-cover rounded-r-2xl pl-1 shadow-inner"
                    />
                    
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-r-2xl pointer-events-none z-10"></div>
                </div>
                
                {/* Shadow/Reflection */}
                <div className="absolute -bottom-8 left-4 right-4 h-4 bg-black/20 blur-xl rounded-full transform scale-x-90"></div>
             </div>
          </div>

        </div>
      </section>

      {/* Call for Papers & Latest Issue Section - Restored Card Design */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Call for Papers - Spans 2 columns */}
            <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10 space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Call for Papers</h2>
                        <p className="text-primary font-semibold text-lg">Vol. 4 No. 1</p>
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed max-w-2xl">
                        The Editorial Board invites interested scholars to submit original research papers. 
                        Focus areas include advancements in technical education, innovative teaching methods, and vocational training.
                    </p>

                    <div className="flex flex-wrap gap-4 items-center pt-2">
                        <div className="inline-flex items-center text-green-700 font-medium bg-green-100 px-4 py-1.5 rounded-full border border-green-200 shadow-sm">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-green-600 mr-2 animate-pulse"></span>
                            Now Accepting Submissions
                        </div>
                        <Link href="/guidelines" className="text-slate-900 font-medium hover:text-primary underline underline-offset-4 decoration-slate-300 hover:decoration-primary transition-all">
                            View Submission Guidelines
                        </Link>
                    </div>
                </div>
            </div>

            {/* Latest Issue - Spans 1 column */}
            <div className="md:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-md flex flex-col h-full">
                <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                    <h3 className="font-bold text-slate-900 text-lg">Latest Issue</h3>
                    <span className="text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded border">{issueLabel}</span>
                </div>
                
                <div className="space-y-6 flex-1">
                    {latestArticles.length > 0 ? (
                        latestArticles.map((article) => (
                            <div key={article.id} className="group">
                                <Link href={`/article/${article.id}`}>
                                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-primary transition-colors mb-1">
                                        {article.title}
                                    </h4>
                                </Link>
                                <p className="text-xs text-slate-500 flex items-center">
                                    <User className="w-3 h-3 mr-1" />
                                    {article.displayAuthor || article.author.name}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 italic">No articles published yet.</p>
                    )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-200">
                    <Link href={issueLink} className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 hover:translate-x-1 transition-transform">
                        View Full Table of Contents <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </div>
            </div>

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
