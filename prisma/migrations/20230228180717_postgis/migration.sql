/*
  Warnings:

  - You are about to drop the column `lat` on the `UserLocation` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `UserLocation` table. All the data in the column will be lost.
  - Added the required column `coords` to the `UserLocation` table without a default value. This is not possible if the table is not empty.

*/

DROP EXTENSION if exists postgis;
CREATE EXTENSION postgis;

-- AlterTable
ALTER TABLE "UserLocation" DROP COLUMN "lat",
DROP COLUMN "lng",
ADD COLUMN     "coords" geometry(Point, 4326) NOT NULL;

-- CreateIndex
CREATE INDEX "location_idx" ON "UserLocation" USING GIST ("coords");
