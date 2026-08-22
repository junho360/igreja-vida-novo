import { prisma } from '@/lib/prisma'

export default async function DevocionaisPage() {
  const devocionais = await prisma.devocional.findMany({
    where: { publicado: true, publicadoEm: { lte: new Date() } },
    orderBy: { publicadoEm: 'desc' },
  })

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Devocionais</h1>
        <p className="mt-2 text-gray-600">
          Textos para fortalecer a sua fé no dia a dia.
        </p>
        <div className="mt-8 space-y-6">
          {devocionais.map((dev) => (
            <article
              key={dev.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {dev.titulo}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {dev.publicadoEm?.toLocaleDateString('pt-BR')}
              </p>
              <p className="mt-4 text-gray-600 whitespace-pre-line">
                {dev.conteudo}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
