-- AlterTable
ALTER TABLE "IncidentReport" ADD COLUMN     "assignedToId" TEXT;

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");

-- CreateIndex
CREATE INDEX "EventRegistration_userId_idx" ON "EventRegistration"("userId");

-- CreateIndex
CREATE INDEX "IncidentReport_reporterId_idx" ON "IncidentReport"("reporterId");

-- CreateIndex
CREATE INDEX "IncidentReport_assignedToId_idx" ON "IncidentReport"("assignedToId");

-- CreateIndex
CREATE INDEX "IncidentReport_category_idx" ON "IncidentReport"("category");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- AddForeignKey
ALTER TABLE "IncidentReport" ADD CONSTRAINT "IncidentReport_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
