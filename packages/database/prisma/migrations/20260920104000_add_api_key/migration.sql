-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "api_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tenants_api_key_key" ON "tenants"("api_key");

