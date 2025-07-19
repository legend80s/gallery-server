/*
  Warnings:

  - You are about to drop the column `authorId` on the `UIConfig` table. All the data in the column will be lost.
  - Added the required column `userId` to the `UIConfig` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UIConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isColumnLayout" BOOLEAN NOT NULL DEFAULT false,
    "isFooterVisible" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "UIConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UIConfig" ("id", "isColumnLayout", "isFooterVisible") SELECT "id", "isColumnLayout", "isFooterVisible" FROM "UIConfig";
DROP TABLE "UIConfig";
ALTER TABLE "new_UIConfig" RENAME TO "UIConfig";
CREATE UNIQUE INDEX "UIConfig_userId_key" ON "UIConfig"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
