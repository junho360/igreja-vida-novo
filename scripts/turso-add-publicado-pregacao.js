const { createClient } = require('@libsql/client')
const client = createClient({
  url: 'https://igreja-vida-junho360.aws-us-east-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN
})
async function main() {
  await client.execute("ALTER TABLE PreGacao ADD COLUMN publicado INTEGER NOT NULL DEFAULT 0")
  console.log('publicado column added')
  const r = await client.execute("UPDATE PreGacao SET publicado = 1")
  console.log('Updated', r.rowsAffected, 'pregacoes to publicado=1')
  const check = await client.execute("SELECT titulo, publicado FROM PreGacao")
  console.log(JSON.stringify(check.rows))
}
main()
