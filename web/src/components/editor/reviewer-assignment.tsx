"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignReviewer } from "@/app/actions/editor";
import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  affiliation: string | null;
}

export function ReviewerAssignment({
  submissionId,
  reviewers,
}: {
  submissionId: string;
  reviewers: User[];
}) {
  const [selectedReviewer, setSelectedReviewer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAssign = async () => {
    if (!selectedReviewer) return;
    setLoading(true);
    try {
      await assignReviewer(submissionId, selectedReviewer);
      setSelectedReviewer("");
      router.refresh();
    } catch (error) {
        // In a real app, use toast
        alert(error instanceof Error ? error.message : "Failed to assign reviewer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <div className="w-[300px]">
        <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
          <SelectTrigger>
            <SelectValue placeholder="Select a reviewer..." />
          </SelectTrigger>
          <SelectContent>
            {reviewers.map((reviewer) => (
              <SelectItem key={reviewer.id} value={reviewer.id}>
                {reviewer.name} ({reviewer.affiliation || "No affiliation"})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleAssign} disabled={!selectedReviewer || loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="mr-2 h-4 w-4" />
        )}
        Assign
      </Button>
    </div>
  );
}
