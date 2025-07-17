/*
  Warnings:

  - You are about to drop the column `invoiceNumber` on the `Invoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceReference]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoiceReference` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Invoice_invoiceNumber_key";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "invoiceNumber",
ADD COLUMN     "invoiceReference" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceReference_key" ON "Invoice"("invoiceReference");
