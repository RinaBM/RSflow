-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_tradingAccountId_fkey";

-- AlterTable
ALTER TABLE "Trade" ALTER COLUMN "tradingAccountId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_tradingAccountId_fkey" FOREIGN KEY ("tradingAccountId") REFERENCES "TradingAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
