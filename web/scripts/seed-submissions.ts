import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Find the admin user to assign as author
  const user = await prisma.user.findUnique({
    where: { email: "ilyas.alkali@gmail.com" },
  });

  if (!user) {
    console.error("User not found. Please run the app and register first.");
    process.exit(1);
  }

  console.log(`Seeding submissions for author: ${user.name}`);

  const submissions = [
    {
      title: "The Impact of AI on Modern Education Systems in Nigeria",
      abstract: "This study explores how Artificial Intelligence is reshaping the educational landscape in Nigeria, focusing on tertiary institutions.",
      keywords: "AI, Education, Nigeria, Technology",
      status: "ACCEPTED",
    },
    {
      title: "Sustainable Agriculture: A Case Study of Northern Nigeria",
      abstract: "An in-depth analysis of sustainable farming practices adopted by smallholder farmers in Northern Nigeria to combat climate change.",
      keywords: "Agriculture, Sustainability, Climate Change, Northern Nigeria",
      status: "ACCEPTED",
    },
    {
      title: "Cybersecurity Challenges in the Nigerian Fintech Sector",
      abstract: "A review of the emerging cybersecurity threats facing financial technology companies in Nigeria and proposed mitigation strategies.",
      keywords: "Fintech, Cybersecurity, Banking, Fraud",
      status: "ACCEPTED",
    },
    {
      title: "Renewable Energy Adoption: Barriers and Opportunities",
      abstract: "Investigating the slow adoption rate of renewable energy sources in rural communities despite government incentives.",
      keywords: "Renewable Energy, Solar, Policy, Rural Development",
      status: "SUBMITTED", // One in submitted state to show in the main dashboard
    },
  ];

  for (const sub of submissions) {
    // Check if it already exists to avoid duplicates
    const existing = await prisma.submission.findFirst({
      where: { title: sub.title },
    });

    if (!existing) {
      await prisma.submission.create({
        data: {
          title: sub.title,
          abstract: sub.abstract,
          keywords: sub.keywords,
          status: sub.status as any,
          authorId: user.id,
          fileUrl: "https://example.com/dummy-pdf.pdf", // Dummy URL
        },
      });
      console.log(`Created submission: ${sub.title} [${sub.status}]`);
    } else {
      console.log(`Skipping existing submission: ${sub.title}`);
    }
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
