import { prisma } from '@/lib/prisma'

export default async function PregacoesPage() {
  const pregacoes = await prisma.preGacao.findMany({
    orderBy: { data: 'desc' },
  })

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Pregações</h1>
        <p className="mt-2 text-gray-600">
          Assista às mensagens pregadas na nossa igreja.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {pregacoes.map((preg) => (
            <div
              key={preg.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {preg.titulo}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {preg.pregador} · {preg.data?.toLocaleDateString('pt-BR')} ·{' '}
                {preg.duracao}
              </p>
              {preg.descricao && (
                <p className="mt-3 text-sm text-gray-600">{preg.descricao}</p>
              )}
              <a
                href={preg.urlYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                Assistir no YouTube →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
