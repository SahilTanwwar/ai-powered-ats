-- Safe migration for Users.role -> enum_Users_role (ADMIN, RECRUITER)

-- 1) Normalize existing values to enum-compatible strings
UPDATE "Users"
SET "role" = UPPER("role")
WHERE "role" IS NOT NULL;

-- 2) Drop default before changing type to avoid cast errors
ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT;

-- 3) Create enum type if needed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Users_role') THEN
    CREATE TYPE "enum_Users_role" AS ENUM ('ADMIN', 'RECRUITER');
  END IF;
END$$;

-- 4) Convert column to enum
ALTER TABLE "Users"
ALTER COLUMN "role" TYPE "enum_Users_role"
USING ("role"::"enum_Users_role");

-- 5) Set default and enforce not null
ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'RECRUITER';
ALTER TABLE "Users" ALTER COLUMN "role" SET NOT NULL;
