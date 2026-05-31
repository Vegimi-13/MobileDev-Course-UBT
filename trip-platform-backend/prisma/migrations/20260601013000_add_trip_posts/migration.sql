CREATE TABLE "TripPost" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "imageUrl" TEXT,
    "tripId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripPost_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TripPost_tripId_createdAt_idx" ON "TripPost"("tripId", "createdAt");

ALTER TABLE "TripPost" ADD CONSTRAINT "TripPost_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TripPost" ADD CONSTRAINT "TripPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
