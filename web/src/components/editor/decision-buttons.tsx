"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { makeDecision } from "@/app/actions/editor";
import { useState } from "react";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function DecisionButtons({ submissionId }: { submissionId: string }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [decision, setDecision] = useState<"ACCEPT" | "REJECT" | "REVISION" | null>(null);
  const [comment, setComment] = useState("");
  const router = useRouter();

  const handleDecisionClick = (type: "ACCEPT" | "REJECT" | "REVISION") => {
    setDecision(type);
    setOpen(true);
  };

  const submitDecision = async () => {
    if (!decision) return;
    setLoading(true);
    try {
      await makeDecision(submissionId, decision, comment);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => handleDecisionClick("ACCEPT")}
          className="bg-green-600 hover:bg-green-700 w-full"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Accept Submission
        </Button>
        <Button
          onClick={() => handleDecisionClick("REVISION")}
          className="bg-orange-500 hover:bg-orange-600 w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Request Revision
        </Button>
        <Button
          onClick={() => handleDecisionClick("REJECT")}
          variant="destructive"
          className="w-full"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Reject Submission
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Decision: {decision}</DialogTitle>
            <DialogDescription>
              This action will update the submission status and notify the author.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Add a comment for the author (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitDecision} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
