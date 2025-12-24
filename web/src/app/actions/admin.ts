"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

export async function updateUserRole(userId: string, newRole: UserRole) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw new Error("Failed to update user role");
  }
}
