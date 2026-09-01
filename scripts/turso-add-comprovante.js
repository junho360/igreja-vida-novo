const { createClient } = require('@libsql/client')

const isTurso = process.argv.includes('--turso')

const client = createClient(
  isTurso
    ? {
        url: 'https://igreja-vida-junho360.aws-us-east-1.turso.io',
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : { url: 'file:./dev.db' }
)

async function main() {
  for (const col of ['comprovanteDados', 'comprovanteMime']) {
    try {
      await client.execute(`ALTER TABLE Inscricao ADD COLUMN ${col} TEXT`)
      console.log(`${col} added`)
    } catch (e) {
      console.log(`${col}:`, String(e.message).split('\n')[0])
    }
  }
}

main()