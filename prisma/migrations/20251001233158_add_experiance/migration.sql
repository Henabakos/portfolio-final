/*
  Warnings:

  - You are about to drop the column `color` on the `education` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `education` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "education" DROP COLUMN "color",
DROP COLUMN "icon",
ADD COLUMN     "logo" TEXT;

-- AlterTable
ALTER TABLE "experience" DROP COLUMN "color",
ADD COLUMN     "logo" TEXT;
