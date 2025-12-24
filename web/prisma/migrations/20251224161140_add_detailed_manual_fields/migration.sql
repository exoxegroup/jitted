-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "manualIssueText" TEXT,
ADD COLUMN     "manualKeywords" TEXT[],
ADD COLUMN     "otherAuthors" JSONB,
ADD COLUMN     "references" TEXT;
