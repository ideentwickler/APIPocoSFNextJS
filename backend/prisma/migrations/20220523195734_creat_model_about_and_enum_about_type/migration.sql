-- CreateEnum
CREATE TYPE "AboutType" AS ENUM ('About', 'Legal');

-- CreateTable
CREATE TABLE "abouts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "content" TEXT,
    "type" "AboutType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "abouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "abouts_title_key" ON "abouts"("title");

-- AddForeignKey
ALTER TABLE "abouts" ADD CONSTRAINT "abouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
