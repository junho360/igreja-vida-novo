import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const isProduction = !!process.env.TURSO_DATABASE_URL

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: isProduction
      ? process.env.TURSO_DATABASE_URL!
      : process.env.DATABASE_URL!,
  },
  ...(isProduction
    ? {
        adapter: async () => {
          const { PrismaLibSql } = await import('@prisma/adapter-libsql')
          return new PrismaLibSql({
            url: process.env.TURSO_DATABASE_URL!,
            authToken: process.env.TURSO_AUTH_TOKEN!,
          })
        },
      }
    : {}),
})
