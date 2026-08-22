import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function EstudosPage() {
  const estudos = await prisma.estudo.findMany({
    where: { publicado: true },
    orderBy: { ordem: 'asc' },
  })

  const categorias = [
    ...new Set(estudos.map((e) => e.categoria).filter(Boolean)),
  ]

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Estudos</h1>
        <p className="mt-2 text-gray-600">
          Material de discipulado e ensino para o seu crescimento espiritual.
        </p>

        {categorias.map((categoria) => (
          <div key={categoria} className="mt-8">
            <h2 className="text-xl font-semibold text-foreground">
              {categoria}
            </h2>
            <div className="mt-4 space-y-4">
              {estudos
                .filter((e) => e.categoria === categoria)
                .map((estudo) => (
                  <Link
                    key={estudo.id}
                    href={`/estudos/${estudo.id}`}
                    className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-foreground">
                      {estudo.titulo}
                    </h3>
                    {estudo.descricao && (
                      <p className="mt-1 text-sm text-gray-500">
                        {estudo.descricao}
                      </p>
                    )}
                    <span className="mt-3 inline-block text-sm font-medium text-primary">
                      Ler mais →
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        ))}

        {estudos.length === 0 && (
          <p className="mt-8 text-gray-500">
            Nenhum estudo disponível no momento.
          </p>
        )}
      </div>
    </div>
  )
}
