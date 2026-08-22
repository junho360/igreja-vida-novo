import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '@/generated/prisma/client'

const isTurso = !!(
  process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN
)

const tursoUrl = isTurso
  ? process.env.TURSO_DATABASE_URL!.replace('libsql://', 'https://')
  : undefined

const adapter = new PrismaLibSql({
  url: isTurso ? tursoUrl! : (process.env.DATABASE_URL ?? 'file:./dev.db'),
  authToken: isTurso ? process.env.TURSO_AUTH_TOKEN! : undefined,
})

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
