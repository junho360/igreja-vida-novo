-- CreateTable
CREATE TABLE "LoteInscricao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "eventoId" TEXT NOT NULL,
    CONSTRAINT "LoteInscricao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
