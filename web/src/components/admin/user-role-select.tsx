"use client";

import { useState } from "react";
import { UserRole } from "@prisma/client";
import { updateUserRole } from "@/app/actions/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface UserRoleSelectProps {
  userId: string;
  currentRole: UserRole;
  currentUserId: string;
}

export function UserRoleSelect({ userId, currentRole, currentUserId }: UserRoleSelectProps) {
  const [role, setRole] = useState<UserRole>(currentRole);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRoleChange(newRole: UserRole) {
    if (userId === currentUserId && newRole !== "ADMIN") {
        const confirm = window.confirm("Warning: You are about to remove your own Admin privileges. You will lose access to this page. Continue?");
        if (!confirm) return;
    }

    setIsLoading(true);
    // Optimistic update
    setRole(newRole);

    try {
      await updateUserRole(userId, newRole);
      toast.success("Role updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
      setRole(currentRole); // Revert on error
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Select 
      value={role} 
      onValueChange={(value) => handleRoleChange(value as UserRole)}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="AUTHOR">Author</SelectItem>
        <SelectItem value="REVIEWER">Reviewer</SelectItem>
        <SelectItem value="EDITOR">Editor</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
