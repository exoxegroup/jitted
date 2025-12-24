import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Seed Editor
  const editorEmail = "editor@jitted.com";
  const existingEditor = await prisma.user.findUnique({ where: { email: editorEmail } });
  if (!existingEditor) {
    await prisma.user.create({
      data: {
        name: "Dr. Editor Chief",
        email: editorEmail,
        password: hashedPassword,
        role: "EDITOR",
        affiliation: "FCE(T) Potiskum",
      },
    });
    console.log("Created Editor: editor@jitted.com / password123");
  } else {
    console.log("Editor already exists");
  }

  // Seed Reviewer
  const reviewerEmail = "reviewer@jitted.com";
  const existingReviewer = await prisma.user.findUnique({ where: { email: reviewerEmail } });
  if (!existingReviewer) {
    await prisma.user.create({
      data: {
        name: "Prof. Reviewer",
        email: reviewerEmail,
        password: hashedPassword,
        role: "REVIEWER",
        affiliation: "University of Lagos",
      },
    });
    console.log("Created Reviewer: reviewer@jitted.com / password123");
  } else {
    console.log("Reviewer already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
