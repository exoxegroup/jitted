"use client";

import { Button } from "@/components/ui/button";
import { vetSubmission } from "@/app/actions/editor";
import { useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function VettingButtons({ submissionId }: { submissionId: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleVet = async (action: "APPROVE" | "REJECT") => {
    setLoading(action);
    try {
      await vetSubmission(submissionId, action);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-4">
      <Button
        onClick={() => handleVet("APPROVE")}
        disabled={!!loading}
        className="bg-green-600 hover:bg-green-700"
      >
        {loading === "APPROVE" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4" />
        )}
        Accept for Review
      </Button>
      <Button
        onClick={() => handleVet("REJECT")}
        variant="destructive"
        disabled={!!loading}
      >
        {loading === "REJECT" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="mr-2 h-4 w-4" />
        )}
        Reject Submission
      </Button>
    </div>
  );
}
