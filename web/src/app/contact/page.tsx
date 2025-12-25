import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container py-12 space-y-12">
      <section className="max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
        <p className="text-lg text-slate-700">
          Have questions about the submission process or the journal? We are here to help.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="Inquiry about..." />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea id="message" placeholder="Type your message here..." className="min-h-[150px]" />
                </div>
                <Button className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Office Address</h3>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Office of the Editor-in-Chief</p>
                <p className="text-slate-600">Directorate of Research, Innovations and Development</p>
                <p className="text-slate-600">Federal College of Education (Technical)</p>
                <p className="text-slate-600">P.M.B 1013, Potiskum, Yobe State, Nigeria</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Email</p>
                <a href="mailto:dridfcetp@gmail.com" className="text-primary hover:underline">
                  dridfcetp@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Phone</p>
                <p className="text-slate-600">07035165582 (Chairman)</p>
                <p className="text-slate-600">08162872840 (Secretary)</p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="aspect-video w-full rounded-lg bg-slate-100 border flex items-center justify-center text-slate-400">
             <span className="flex items-center gap-2">
               <MapPin className="h-4 w-4" />
               Google Maps Embed Placeholder
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}
