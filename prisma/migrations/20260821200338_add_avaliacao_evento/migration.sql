-- AlterTable
ALTER TABLE "Evento" ADD COLUMN "dataPlanejamentoInicio" DATETIME;

-- CreateTable
CREATE TABLE "EventoAvaliacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventoId" TEXT NOT NULL,
    "custo" REAL,
    "receita" REAL,
    "presenca" INTEGER,
    "satisfacao" INTEGER,
    "pros" TEXT,
    "contras" TEXT,
    "melhorias" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EventoAvaliacao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SugestaoEvento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "EventoAvaliacao_eventoId_key" ON "EventoAvaliacao"("eventoId");
