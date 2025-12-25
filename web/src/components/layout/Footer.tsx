import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-slate-50">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand / Info */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">JITTED</h3>
            <p className="text-sm text-slate-600 max-w-xs">
              Journal of Issues in Technical Teacher Education. A publication of the Directorate of Research, Innovation and Development, Federal College of Education (Technical) Potiskum.
            </p>
            <div className="text-sm text-slate-500">
              <p>P.M.B 1013, Potiskum, Yobe State, Nigeria.</p>
              <p>Email: dridfcetp@gmail.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-primary">Editorial Board</Link></li>
              <li><Link href="/guidelines" className="hover:text-primary">Submission Guidelines</Link></li>
              <li><Link href="/archives" className="hover:text-primary">Past Issues</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>

          {/* Sponsors / Funding */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Funded by</h4>
            <div className="flex flex-col items-start gap-2">
              <div className="relative h-10 w-32">
                 {/* Using the funder logo as requested */}
                <Image 
                  src="/images/funder-logo.png" 
                  alt="TETFund Logo" 
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-xs text-slate-500">
                With support from the Tertiary Education Trust Fund (TETFund).
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JITTED. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
