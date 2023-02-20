/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `giver_id` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `taker_id` on the `Offer` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `giverId` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `giverItemId` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `takerId` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `takerItemId` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_giver_id_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_taker_id_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "owner_id",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "giver_id",
DROP COLUMN "taker_id",
ADD COLUMN     "giverId" INTEGER NOT NULL,
ADD COLUMN     "giverItemId" INTEGER NOT NULL,
ADD COLUMN     "takerId" INTEGER NOT NULL,
ADD COLUMN     "takerItemId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_giverItemId_fkey" FOREIGN KEY ("giverItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_takerId_fkey" FOREIGN KEY ("takerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_takerItemId_fkey" FOREIGN KEY ("takerItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
