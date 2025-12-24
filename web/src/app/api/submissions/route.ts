import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const submissionSchema = z.object({
  title: z.string().min(1),
  abstract: z.string().min(1),
  keywords: z.string().optional(),
  fileUrl: z.string().optional(),
  coAuthors: z.string().optional(),
  status: z.enum(["DRAFT", "SUBMITTED"]).optional(),
});

import { sendSubmissionReceivedEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = submissionSchema.parse(body);

    const submission = await prisma.submission.create({
      data: {
        ...data,
        authorId: session.user.id,
        status: data.status || "DRAFT",
        history: {
            create: {
                status: data.status || "DRAFT",
                changedBy: session.user.id,
                comment: "Initial creation"
            }
        }
      },
    });

    // Send email only if submitted
    if (data.status === "SUBMITTED" && session.user.email) {
        await sendSubmissionReceivedEmail(session.user.email, session.user.name || "Author", data.title);
    }

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ message: "Invalid data", errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    try {
      // If author, return their submissions
      // If admin/editor, return all (TODO: Filter logic later)
      
      const submissions = await prisma.submission.findMany({
        where: {
            authorId: session.user.id
        },
        orderBy: {
            updatedAt: 'desc'
        }
      });
  
      return NextResponse.json(submissions);
    } catch (error) {
      return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
