"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Submission {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AuthorDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/submissions")
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "secondary";
      case "SUBMITTED": return "default"; // Blue
      case "UNDER_REVIEW": return "warning"; // Yellow/Orange
      case "ACCEPTED": return "success"; // Green
      case "REJECTED": return "destructive"; // Red
      default: return "outline";
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Author Dashboard</h1>
          <p className="text-muted-foreground">Manage your manuscript submissions.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/submit">
            <Plus className="mr-2 h-4 w-4" />
            New Submission
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Submissions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{submissions.filter(s => s.status !== 'DRAFT').length}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{submissions.filter(s => s.status === 'UNDER_REVIEW').length}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Required</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{submissions.filter(s => s.status === 'REVISION_REQUESTED').length}</div>
            </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <Card>
        <CardHeader>
            <CardTitle>My Manuscripts</CardTitle>
            <CardDescription>A list of all your submissions and their current status.</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="text-center py-8">Loading submissions...</div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-medium">No submissions yet</h3>
                    <p className="text-muted-foreground mb-4">Start by submitting your first research paper.</p>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/submit">Start Submission</Link>
                    </Button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Date Submitted</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.map((sub) => (
                            <TableRow key={sub.id}>
                                <TableCell className="font-medium">{sub.title}</TableCell>
                                <TableCell>{format(new Date(sub.createdAt), "MMM d, yyyy")}</TableCell>
                                <TableCell>{format(new Date(sub.updatedAt), "MMM d, yyyy")}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                        {sub.status.replace("_", " ").toLowerCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/dashboard/author/submission/${sub.id}`}>View</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
