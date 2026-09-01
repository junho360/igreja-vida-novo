const { createClient } = require('@libsql/client')
const client = createClient({
  url: 'https://igreja-vida-junho360.aws-us-east-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN
})
async function main() {
  await client.execute({
    sql: 'INSERT INTO Configuracao (id, chave, valor, descricao, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    args: [crypto.randomUUID(), 'contato_cartao', '', 'Contato para pagamento em cartão de crédito', new Date().toISOString(), new Date().toISOString()]
  })
  console.log('contato_cartao config added')
}
main()