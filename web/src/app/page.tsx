import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/jitted-design.png')] opacity-10 bg-cover bg-center animate__animated animate__pulse animate__slower animate__infinite" />
        <div className="container relative z-10 flex flex-col items-center text-center space-y-8 animate__animated animate__fadeInUp">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary-foreground backdrop-blur-xl">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Now Accepting Submissions for Vol. 4 No. 1
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl">
            Journal of Issues in Technical Teacher Education
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Advancing knowledge through high-quality research in Science, Vocational, and Technology Teacher Education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="text-base transition-transform hover:scale-105" asChild>
              <Link href="/guidelines">Submit Article</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base text-black border-white hover:bg-white/10 hover:text-white transition-transform hover:scale-105" asChild>
              <Link href="/archives">Browse Archives</Link>
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

      {/* Call for Papers Section */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6 flex-1">
              <h2 className="text-3xl font-bold tracking-tight">Call for Papers: 2025 Series</h2>
              <p className="text-slate-600 text-lg">
                The Editorial Board invites interested scholars to submit original research papers for Vol. 4 No. 1. 
                Focus areas include advancements in technical education, innovative teaching methods, and vocational training.
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Submission Deadline: September 2025
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Publication Date: January 2026
                </li>
              </ul>
              <Button asChild>
                <Link href="/guidelines">View Guidelines</Link>
              </Button>
            </div>
            <div className="flex-1 w-full max-w-md">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Issue</CardTitle>
                  <CardDescription>Vol. 3 No. 1 (2024)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm line-clamp-2 hover:underline cursor-pointer">
                      The Use of Mobile Phones in Educational Processes: Health Implications
                    </h4>
                    <p className="text-xs text-muted-foreground">Shitu Teslim</p>
                  </div>
                  <div className="border-t pt-2 space-y-2">
                    <h4 className="font-semibold text-sm line-clamp-2 hover:underline cursor-pointer">
                      Incorporating Multiple Intelligence Methods to Drive Effective Education Reform
                    </h4>
                    <p className="text-xs text-muted-foreground">Ari Idi</p>
                  </div>
                  <Button variant="link" className="px-0" asChild>
                    <Link href="/archives/vol-3-no-1">View Full Table of Contents &rarr;</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
