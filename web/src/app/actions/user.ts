"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string; password?: string }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { name, password } = data;

  if (!name || name.trim().length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }

  const updateData: any = { name };

  if (password && password.trim().length > 0) {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    updateData.password = hashedPassword;
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });
    
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw new Error("Failed to update profile");
  }
}
