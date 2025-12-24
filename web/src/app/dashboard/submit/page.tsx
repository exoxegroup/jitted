"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload, FileText, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const submissionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  abstract: z.string().min(20, "Abstract must be at least 20 characters"),
  keywords: z.string().optional(),
  coAuthors: z.string().optional(),
});

export default function NewSubmissionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof submissionSchema>>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      title: "",
      abstract: "",
      keywords: "",
      coAuthors: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast.error("Invalid file type", {
            description: "Please upload a PDF file.",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const uploadFile = async () => {
    if (!file) return null;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });
        
        if (!res.ok) throw new Error("Upload failed");
        
        const data = await res.json();
        setUploadedUrl(data.url);
        return data.url;
    } catch (error) {
        toast.error("Upload Error", {
            description: "Failed to upload manuscript. Please try again.",
        });
        return null;
    } finally {
        setUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof submissionSchema>) => {
    setIsSubmitting(true);
    
    try {
        // Upload file first if not already uploaded
        let fileUrl = uploadedUrl;
        if (!fileUrl && file) {
            fileUrl = await uploadFile();
            if (!fileUrl) {
                setIsSubmitting(false);
                return;
            }
        } else if (!fileUrl) {
            toast.error("File Required", {
                description: "Please upload your manuscript PDF.",
            });
            setIsSubmitting(false);
            return;
        }

        const payload = {
            ...values,
            fileUrl,
            status: "SUBMITTED"
        };

        const res = await fetch("/api/submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Submission failed");

        toast.success("Success!", {
            description: "Your manuscript has been submitted successfully.",
        });
        
        router.push("/dashboard/author");
        router.refresh();
    } catch (error) {
        toast.error("Error", {
            description: "Failed to submit manuscript. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) setStep(s => s + 1);
  };

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">New Submission</h1>
        <p className="text-muted-foreground">Submit your research article for review.</p>
      </div>

      <div className="grid gap-6">
        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-4">
            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-slate-200'}`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-slate-200'}`} />
        </div>

        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {step === 1 && (
                        <>
                            <CardHeader>
                                <CardTitle>Step 1: Article Metadata</CardTitle>
                                <CardDescription>Enter the details of your manuscript.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Article Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter the full title of your paper" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="abstract"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Abstract</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Paste your abstract here (max 500 words)..." className="min-h-[150px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="keywords"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Keywords (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Technology, Education, AI" {...field} />
                                        </FormControl>
                                        <FormDescription>Comma separated list of keywords.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button type="button" onClick={nextStep}>Next: Authors</Button>
                            </CardFooter>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <CardHeader>
                                <CardTitle>Step 2: Authors</CardTitle>
                                <CardDescription>List any co-authors for this paper.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="coAuthors"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Co-Authors</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Dr. John Doe (University of X), Jane Smith (Institute Y)..." 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            List names and affiliations. You are automatically listed as the corresponding author.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                                <Button type="button" onClick={() => setStep(3)}>Next: Upload</Button>
                            </CardFooter>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <CardHeader>
                                <CardTitle>Step 3: Manuscript Upload</CardTitle>
                                <CardDescription>Upload your full paper in PDF format.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors">
                                    <input 
                                        type="file" 
                                        id="file-upload" 
                                        className="hidden" 
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <span className="font-medium text-lg">Click to upload PDF</span>
                                        <span className="text-sm text-muted-foreground">Max file size: 10MB</span>
                                    </label>
                                </div>
                                
                                {file && (
                                    <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-md border">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => { setFile(null); setUploadedUrl(null); }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                                <Button type="submit" disabled={isSubmitting || !file}>
                                    {isSubmitting || uploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Manuscript"
                                    )}
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </form>
            </Form>
        </Card>
      </div>
    </div>
  );
}
