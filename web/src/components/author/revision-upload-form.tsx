"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, CheckCircle, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { submitRevision } from "@/app/actions/author";
import { useRouter } from "next/navigation";

interface RevisionUploadFormProps {
  submissionId: string;
}

export function RevisionUploadForm({ submissionId }: RevisionUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async () => {
    if (!file) return;

    setUploading(true);
    setIsSubmitting(true);

    try {
      // 1. Upload File
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const fileUrl = data.url;

      // 2. Submit Revision
      await submitRevision(submissionId, fileUrl);

      toast.success("Success", {
        description: "Revision submitted successfully.",
      });

      setFile(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to submit revision.",
      });
    } finally {
      setUploading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
        <input
          type="file"
          id="revision-upload"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isSubmitting}
        />
        <label
          htmlFor="revision-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Upload className="h-5 w-5" />
          </div>
          <span className="font-medium">Click to upload revised PDF</span>
          <span className="text-xs text-muted-foreground">Max file size: 10MB</span>
        </label>
      </div>

      {file && (
        <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-md border">
          <FileText className="h-5 w-5 text-primary" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setFile(null)}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!file || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Revision...
          </>
        ) : (
          "Submit Revision"
        )}
      </Button>
    </div>
  );
}
