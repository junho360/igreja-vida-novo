const { createClient } = require('@libsql/client')
const client = createClient({
  url: 'https://igreja-vida-junho360.aws-us-east-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN
})
async function main() {
  await client.execute('DELETE FROM DestaqueHome')

  const destaques = [
    { titulo: 'Culto de Domingo', subtitulo: 'Culto principal da semana', horario: 'Domingos 18h30', local: 'Templo Principal', icone: '⛪', ordem: 1 },
    { titulo: 'Capacitando', subtitulo: 'Ensino e preparação', horario: 'Terças 20h', local: 'Templo Principal', icone: '📖', ordem: 2 },
  ]

  for (const d of destaques) {
    await client.execute({
      sql: "INSERT INTO DestaqueHome (id, titulo, subtitulo, horario, local, icone, ordem, ativo, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))",
      args: ['d' + Date.now() + Math.random().toString(36).slice(2), d.titulo, d.subtitulo, d.horario, d.local, d.icone, d.ordem]
    })
  }
  console.log('Destaques inserted')

  const check = await client.execute("SELECT titulo, horario FROM DestaqueHome")
  console.log(JSON.stringify(check.rows))
}
main()

