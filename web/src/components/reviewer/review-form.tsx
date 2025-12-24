"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { submitReview } from "@/app/actions/reviewer";
import { Loader2, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReviewFormProps {
  reviewId: string;
  existingReview?: {
    score: number | null;
    feedback: string | null;
    recommendation: string | null;
  };
}

export function ReviewForm({ reviewId, existingReview }: ReviewFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [score, setScore] = useState<string>(
    existingReview?.score?.toString() || ""
  );
  const [recommendation, setRecommendation] = useState<string>(
    existingReview?.recommendation || ""
  );
  const [feedback, setFeedback] = useState<string>(
    existingReview?.feedback || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!score || !feedback || !recommendation) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await submitReview(reviewId, {
        score: parseInt(score),
        feedback,
        recommendation,
      });
      setSuccess(true);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (success || (existingReview?.score && !loading)) {
    // If just submitted or already submitted (and not currently submitting)
    // Actually, if existingReview is present, we might want to allow editing?
    // For now, let's assume if it's submitted, it's done or editable.
    // Let's just show the form as editable but with a success message if just submitted.
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your review has been submitted successfully.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="score">Score (1-5)</Label>
        <Select value={score} onValueChange={setScore}>
          <SelectTrigger>
            <SelectValue placeholder="Select a score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 - Poor</SelectItem>
            <SelectItem value="2">2 - Fair</SelectItem>
            <SelectItem value="3">3 - Good</SelectItem>
            <SelectItem value="4">4 - Very Good</SelectItem>
            <SelectItem value="5">5 - Excellent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recommendation">Recommendation</Label>
        <Select value={recommendation} onValueChange={setRecommendation}>
          <SelectTrigger>
            <SelectValue placeholder="Select recommendation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACCEPT">Accept</SelectItem>
            <SelectItem value="REVISION">Request Revision</SelectItem>
            <SelectItem value="REJECT">Reject</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback">Detailed Feedback</Label>
        <Textarea
          id="feedback"
          placeholder="Provide detailed feedback for the author..."
          className="min-h-[200px]"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Your feedback will be shared with the author (your identity will remain anonymous).
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Review
      </Button>
    </form>
  );
}
