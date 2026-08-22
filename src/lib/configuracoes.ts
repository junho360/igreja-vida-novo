import { prisma } from '@/lib/prisma'

const defaults: Record<string, string> = {
  nome_igreja: 'Igreja Vida',
  cidade: 'Sao Paulo',
}

export async function getConfig(chave: string): Promise<string | null> {
  const config = await prisma.configuracao.findUnique({ where: { chave } })
  return config?.valor ?? defaults[chave] ?? null
}

export async function getConfigs(
  chaves: string[]
): Promise<Record<string, string>> {
  const configs = await prisma.configuracao.findMany({
    where: { chave: { in: chaves } },
  })
  const map: Record<string, string> = {}
  for (const c of configs) map[c.chave] = c.valor
  for (const k of chaves) {
    if (!map[k] && defaults[k]) map[k] = defaults[k]
  }
  return map
}
