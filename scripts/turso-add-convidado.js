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
  try {
    await client.execute('ALTER TABLE Evento ADD COLUMN valorComConvidado REAL')
    console.log('valorComConvidado added')
  } catch (e) {
    console.log('valorComConvidado:', String(e.message).split('\n')[0])
  }
  try {
    await client.execute('ALTER TABLE Evento ADD COLUMN valorSemConvidado REAL')
    console.log('valorSemConvidado added')
  } catch (e) {
    console.log('valorSemConvidado:', String(e.message).split('\n')[0])
  }
}

main()