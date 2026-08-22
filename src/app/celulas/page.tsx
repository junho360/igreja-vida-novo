import { prisma } from '@/lib/prisma'

export const metadata = { title: 'Células - Igreja Vida' }

export default async function CelulasPage() {
  const celulas = await prisma.celula.findMany({
    where: { ativo: true },
    orderBy: { ordem: 'asc' },
  })

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Células</h1>
        <p className="mt-2 text-gray-600">
          Conecte-se com outros membros e cresça na fé em comunidade.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {celulas.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {c.nome}
              </h2>
              {c.lider && (
                <p className="mt-1 text-sm text-gray-500">Líder: {c.lider}</p>
              )}
              {c.horario && (
                <p className="mt-1 text-sm text-gray-500">{c.horario}</p>
              )}
              {c.local && (
                <p className="mt-1 text-sm text-gray-500">{c.local}</p>
              )}
              {c.descricao && (
                <p className="mt-3 text-sm text-gray-600">{c.descricao}</p>
              )}
              {c.telefone && (
                <a
                  href={`https://wa.me/${c.telefone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary-light transition-colors"
                >
                  Contato via WhatsApp
                </a>
              )}
            </div>
          ))}
          {celulas.length === 0 && (
            <p className="text-gray-500">
              Nenhuma célula disponível no momento.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
