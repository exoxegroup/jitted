"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { manualUploadAction } from "@/app/actions/manual-upload";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadCloud, Plus, Trash2 } from "lucide-react";

const otherAuthorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  affiliation: z.string().min(1, "Affiliation is required"),
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  // Issue can be ID (if selecting) or Manual Text. For now, enforcing manual text as per request
  // issueId: z.string().optional(),
  manualIssueText: z.string().min(5, "Issue details must be at least 5 characters").max(200, "Issue details cannot exceed 200 characters"),
  
  displayAuthor: z.string().min(1, "Main Author name is required"),
  displayAffiliation: z.string().optional(),
  
  publishedAt: z.string().optional(),
  
  otherAuthors: z.array(otherAuthorSchema).optional(),
  references: z.string().optional(),
  manualKeywords: z.string().optional(), // We'll split this string into array before sending
});

export function ManualUploadForm({ issues }: { issues: any[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      abstract: "",
      manualIssueText: "",
      displayAuthor: "",
      displayAffiliation: "",
      publishedAt: new Date().toISOString().split('T')[0],
      otherAuthors: [],
      references: "",
      manualKeywords: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "otherAuthors",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!file) {
      toast.error("Please upload a PDF file.");
      return;
    }

    try {
      setUploading(true);

      // 1. Upload file to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const { url } = await uploadRes.json();
      
      // 2. Submit metadata + file URL
      const result = await manualUploadAction({
        ...data,
        manualKeywords: data.manualKeywords ? data.manualKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0) : [],
        fileUrl: url,
      });

      if (result.error) {
        toast.error(result.error);
        // Show validation issues if any
        if (result.issues) {
            console.error(result.issues);
        }
      } else {
        toast.success("Article published manually!");
        router.push("/dashboard/editor");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Publication Title" {...field} />
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
                  <Textarea placeholder="Publication Abstract" className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

           <FormField
            control={form.control}
            name="manualIssueText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Details (5 - 200 characters)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g. Journal of Issues in Technical Teacher Education, Vol. 4 No. 1, pp 12-25, 2025. ISSN: 1234-5678..." 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Full citation details for the issue. Must be between 5 and 200 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Authors */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Authors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="displayAuthor"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Main Author Name</FormLabel>
                    <FormControl>
                    <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="displayAffiliation"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Main Author Affiliation</FormLabel>
                    <FormControl>
                    <Input placeholder="University of XYZ" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            {/* Other Authors Dynamic Fields */}
            <div className="space-y-4">
                <FormLabel>Other Authors</FormLabel>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col md:flex-row gap-4 items-end border p-4 rounded-md bg-slate-50">
                        <FormField
                            control={form.control}
                            name={`otherAuthors.${index}.name`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="text-xs">Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Author Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`otherAuthors.${index}.affiliation`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="text-xs">Affiliation</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Affiliation" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ name: "", affiliation: "" })}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Co-Author
                </Button>
            </div>
        </div>

        {/* Metadata */}
        <div className="space-y-4">
             <h3 className="text-lg font-medium">Metadata</h3>
             
             <FormField
                control={form.control}
                name="manualKeywords"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                    <Input placeholder="Education, Technology, Science (Comma separated)" {...field} />
                    </FormControl>
                    <FormDescription>Separate keywords with commas.</FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="references"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>References</FormLabel>
                    <FormControl>
                    <Textarea 
                        placeholder="Paste references here..." 
                        className="min-h-[200px] font-mono text-sm" 
                        {...field} 
                    />
                    </FormControl>
                    <FormDescription>References will be displayed as bullet points.</FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Publication Date</FormLabel>
                    <FormControl>
                    <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <FormItem>
          <FormLabel>PDF File</FormLabel>
          <FormControl>
            <div className="flex items-center gap-4">
              <Input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
            </div>
          </FormControl>
          <FormDescription>
            Upload the final PDF version of the publication.
          </FormDescription>
        </FormItem>

        <Button type="submit" disabled={uploading} className="w-full md:w-auto">
            {uploading ? (
                <>
                    <UploadCloud className="mr-2 h-4 w-4 animate-bounce" />
                    Uploading...
                </>
            ) : (
                "Publish Manually"
            )}
        </Button>
      </form>
    </Form>
  );
}
