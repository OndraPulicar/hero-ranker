/*
  Warnings:

  - Made the column `passwordHash` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- Legacy users did not have a password. Assign a valid but unusable password
-- hash so those accounts cannot authenticate with a shared default password.
UPDATE "User"
SET "passwordHash" = '$2b$12$Zd588Ww9UdAoB88HjPpRWO4KvU0V9U3gs07fsTmn4BtkbGKuwBpMC'
WHERE "passwordHash" IS NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;
