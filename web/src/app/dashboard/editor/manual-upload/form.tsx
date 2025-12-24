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

  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setDebugLog([]); // Clear previous logs
    addLog("Starting submission process...");
    
    if (!file) {
      addLog("Error: No file selected");
      toast.error("Please upload a PDF file");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading publication...");
    addLog(`File selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

    try {
      // 1. Upload File
      addLog("Step 1: Uploading file to API...");
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      addLog(`Upload API Response Status: ${uploadRes.status}`);

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        addLog(`Upload API Error Body: ${errorText}`);
        let errorMessage = "Upload failed";
        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // ignore json parse error
        }
        throw new Error(errorMessage);
      }
      
      const uploadData = await uploadRes.json();
      addLog(`File uploaded successfully. URL: ${uploadData.url}`);
      const { url } = uploadData;

      // 2. Prepare Data (split keywords)
      addLog("Step 2: Preparing submission data...");
      const keywordsArray = values.manualKeywords 
        ? values.manualKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
        : [];

      // 3. Submit Data
      addLog("Step 3: Submitting metadata to server action...");
      const result = await manualUploadAction({
        ...values,
        manualKeywords: keywordsArray,
        fileUrl: url,
        issueId: undefined, // Ensuring we use the manual text
      });

      if (result.error) {
        addLog(`Server Action Error: ${result.error}`);
        if (result.issues) {
             addLog(`Validation Issues: ${JSON.stringify(result.issues)}`);
        }
        toast.error(result.error, { id: toastId });
      } else {
        addLog("Success: Publication created!");
        toast.success("Publication created successfully", { id: toastId });
        router.push("/dashboard/editor");
        router.refresh();
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      addLog(`CRITICAL ERROR: ${msg}`);
      console.error(error);
      toast.error(msg, { id: toastId });
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

        {debugLog.length > 0 && (
          <div className="mt-8 p-4 bg-slate-900 text-green-400 rounded-md font-mono text-xs overflow-auto max-h-[300px]">
              <h4 className="font-bold border-b border-green-800 mb-2 pb-1 text-white">Debug Log</h4>
              {debugLog.map((log, i) => (
                  <div key={i} className="mb-1 border-b border-slate-800 pb-1 last:border-0">{log}</div>
              ))}
          </div>
        )}
      </form>
    </Form>
  );
}
