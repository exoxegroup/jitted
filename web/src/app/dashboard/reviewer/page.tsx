import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, CheckCircle, Clock } from "lucide-react";

export default async function ReviewerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "REVIEWER") {
    // If admin/editor tries to access, they might want to see it too, but strict role is better for now
    // Or redirect to their respective dashboards
    redirect("/dashboard");
  }

  const reviews = await prisma.review.findMany({
    where: {
      reviewerId: session.user.id,
    },
    include: {
      submission: {
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
          // Explicitly NOT selecting author to maintain blind review
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingCount = reviews.filter((r) => !r.score).length;
  const completedCount = reviews.filter((r) => r.score).length;

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviewer Dashboard</h1>
          <p className="text-muted-foreground">Manage your assigned reviews.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Manuscripts</CardTitle>
          <CardDescription>
            List of papers assigned to you for peer review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No reviews assigned yet.
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium max-w-[400px] truncate">
                      {review.submission.title}
                    </TableCell>
                    <TableCell>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={review.score ? "default" : "outline"}>
                        {review.score ? "Completed" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/reviewer/submission/${review.submission.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          {review.score ? "View" : "Review"}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
