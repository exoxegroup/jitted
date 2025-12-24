"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { publishArticle, publishIssue } from "@/app/actions/publication";
import { Loader2, Plus, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

interface IssueActionsProps {
  issueId: string;
  isPublished: boolean;
  acceptedSubmissions: { id: string; title: string; author: { name: string | null } }[];
}

export function IssueActions({ issueId, isPublished, acceptedSubmissions }: IssueActionsProps) {
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string>("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const router = useRouter();

  const handleAddArticle = async () => {
    if (!selectedSubmission) return;
    setLoading(true);
    try {
      await publishArticle(selectedSubmission, issueId);
      setAddDialogOpen(false);
      setSelectedSubmission("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to add article");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishIssue = async () => {
    if (!confirm("Are you sure? This will make the issue visible to the public.")) return;
    setLoading(true);
    try {
      await publishIssue(issueId);
      router.refresh();
    } catch (error) {
        console.error(error);
        alert("Failed to publish issue");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Article
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Article to Issue</DialogTitle>
            <DialogDescription>
              Select an accepted submission to include in this issue.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedSubmission} onValueChange={setSelectedSubmission}>
              <SelectTrigger>
                <SelectValue placeholder="Select a submission..." />
              </SelectTrigger>
              <SelectContent>
                {acceptedSubmissions.length === 0 ? (
                    <SelectItem value="none" disabled>No accepted submissions available</SelectItem>
                ) : (
                    acceptedSubmissions.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                        {sub.title} (by {sub.author.name})
                    </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleAddArticle} disabled={loading || !selectedSubmission}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add to Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!isPublished && (
        <Button onClick={handlePublishIssue} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Globe className="mr-2 h-4 w-4" />
          )}
          Publish Issue
        </Button>
      )}
    </div>
  );
}
