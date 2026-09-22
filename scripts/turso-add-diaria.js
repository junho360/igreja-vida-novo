const { createClient } = require('@libsql/client')

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function main() {
  const statements = [
    'ALTER TABLE "Evento" ADD COLUMN "temDiaria" BOOLEAN NOT NULL DEFAULT false',
    'ALTER TABLE "Evento" ADD COLUMN "diariaValor" REAL',
    'ALTER TABLE "Inscricao" ADD COLUMN "diaDiaria" TEXT',
  ]

  for (const sql of statements) {
    try {
      await client.execute(sql)
      console.log('OK:', sql.split('"')[3])
    } catch (e) {
      console.log('SKIP:', sql.split('"')[3], '-', String(e.message).split('\n')[0])
    }
  }
}

main()
