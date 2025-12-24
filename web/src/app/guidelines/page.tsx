import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileText, AlertCircle } from "lucide-react";

export default function GuidelinesPage() {
  return (
    <div className="container py-12 space-y-12">
      <section className="max-w-4xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Author Guidelines</h1>
        <p className="text-lg text-slate-700">
          Please review the following guidelines carefully before submitting your manuscript. 
          Compliance with these standards ensures a smooth review and publication process.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Guidelines */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Manuscript Formatting
            </h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span><strong>Title Page:</strong> Must include article title, author(s) name, affiliation, email, and phone number.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span><strong>Length:</strong> Maximum of 15 pages (A4) or 12 pages (Foolscap), including references.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span><strong>Typography:</strong> Times New Roman, 12pt font size.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span><strong>Spacing:</strong> 1.5 line spacing.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span><strong>Abstract:</strong> Maximum of 250 words on a separate sheet.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-primary" />
              Submission Policy
            </h2>
            <div className="prose text-slate-700">
              <p>
                <strong>Originality:</strong> All articles must be the original work of the author(s). 
                Plagiarism is strictly prohibited.
              </p>
              <p className="mt-2">
                <strong>Exclusivity:</strong> Only articles not published elsewhere should be submitted.
              </p>
            </div>
          </section>

           <section className="space-y-4">
            <h2 className="text-2xl font-bold">Review Process</h2>
            <div className="bg-slate-50 p-6 rounded-lg border space-y-4">
              <p className="text-slate-700">
                JITTED follows a rigorous peer-review process. The typical timeline is <strong>12 weeks</strong>:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-2">
                <li><strong>Submission & Vetting</strong> (Weeks 1-4)</li>
                <li><strong>Peer Review</strong> (Weeks 5-7)</li>
                <li><strong>Author Corrections</strong> (Week 8)</li>
                <li><strong>Production & Publication</strong> (Weeks 9-12)</li>
              </ol>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Assessment Fee</p>
                <p className="text-2xl font-bold text-slate-900">₦5,000.00</p>
              </div>
              <p className="text-xs text-slate-500">
                Payable upon submission. Proof of payment required.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Ready to Submit?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Ensure your manuscript meets all guidelines before proceeding.
              </p>
              <Button className="w-full" asChild>
                <Link href="/login">Start Submission</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
