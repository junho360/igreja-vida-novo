import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '@/generated/prisma/client'

const isProduction = process.env.NODE_ENV === 'production'
const hasTurso = !!(
  process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN
)

function getTursoUrl(): string {
  const url = process.env.TURSO_DATABASE_URL!
  return url.replace('libsql://', 'https://')
}

const adapter = new PrismaLibSql({
  url:
    isProduction && hasTurso
      ? getTursoUrl()
      : (process.env.DATABASE_URL ?? 'file:./dev.db'),
  authToken:
    isProduction && hasTurso ? process.env.TURSO_AUTH_TOKEN! : undefined,
})

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
