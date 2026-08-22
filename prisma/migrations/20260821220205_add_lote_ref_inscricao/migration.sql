-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Inscricao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "valor" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "comprovante" TEXT,
    "loteId" TEXT,
    "eventoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inscricao_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "LoteInscricao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Inscricao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Inscricao" ("comprovante", "createdAt", "email", "eventoId", "id", "nome", "status", "telefone", "updatedAt", "valor") SELECT "comprovante", "createdAt", "email", "eventoId", "id", "nome", "status", "telefone", "updatedAt", "valor" FROM "Inscricao";
DROP TABLE "Inscricao";
ALTER TABLE "new_Inscricao" RENAME TO "Inscricao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
