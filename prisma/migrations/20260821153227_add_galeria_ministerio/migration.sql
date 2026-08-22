-- CreateTable
CREATE TABLE "GaleriaMinisterio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "titulo" TEXT,
    "ministerioId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GaleriaMinisterio_ministerioId_fkey" FOREIGN KEY ("ministerioId") REFERENCES "Ministerio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
