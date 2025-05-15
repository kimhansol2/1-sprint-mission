-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PRICE_UPDATED', 'COMMENT_CREATED');

-- CreateTable
CREATE TABLE "Notificastion" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "payload" JSONB NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notificastion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notificastion" ADD CONSTRAINT "Notificastion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
