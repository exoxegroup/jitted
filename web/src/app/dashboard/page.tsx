"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, LayoutDashboard, Shield } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Redirect authors to author dashboard
  if (session?.user?.role === "AUTHOR") {
    router.push("/dashboard/author");
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAdmin = session?.user?.role === "ADMIN";
  const isEditor = session?.user?.role === "EDITOR";
  const canPublish = isAdmin || isEditor;

  return (
    <div className="container py-12 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{session?.user?.name}</div>
            <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            <p className="text-xs text-muted-foreground mt-1 capitalize px-2 py-1 bg-primary/10 text-primary rounded inline-block">
              {session?.user?.role?.toLowerCase()}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {canPublish && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/20" onClick={() => router.push('/dashboard/editor/manual-upload')}>
            <CardHeader>
              <UploadCloud className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Manual Publication</CardTitle>
              <CardDescription>
                Upload and publish articles manually without the peer-review process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Upload Article</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/editor')}>
            <CardHeader>
              <LayoutDashboard className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Editorial Dashboard</CardTitle>
              <CardDescription>
                Manage submissions, assign reviewers, and track issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Go to Dashboard</Button>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/admin/users')}>
              <CardHeader>
                <Shield className="h-8 w-8 text-red-500 mb-2" />
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage registered users and their roles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Manage Users</Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
