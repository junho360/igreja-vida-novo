const { createClient } = require('@libsql/client')
const client = createClient({
  url: 'https://igreja-vida-junho360.aws-us-east-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN
})
async function main() {
  await client.execute({
    sql: 'INSERT INTO Configuracao (id, chave, valor, descricao, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    args: [crypto.randomUUID(), 'pix_inscricao', '', 'Chave PIX para inscrições em eventos', new Date().toISOString(), new Date().toISOString()]
  })
  console.log('pix_inscricao config added')
  const r = await client.execute("SELECT chave, valor, descricao FROM Configuracao ORDER BY chave")
  console.log(JSON.stringify(r.rows))
}
main()