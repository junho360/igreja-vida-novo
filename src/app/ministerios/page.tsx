import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export default async function MinisteriosPage() {
  const ministerios = await prisma.ministerio.findMany({
    where: { ativo: true },
    orderBy: { nome: 'asc' },
    include: { galeria: { orderBy: { ordem: 'asc' } } },
  })

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Ministérios</h1>
        <p className="mt-2 text-gray-600">
          Conheça as frentes de atuação da nossa igreja.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ministerios.map((ministerio) => {
            const imagens = ministerio.galeria.filter(
              (g) => g.tipo === 'imagem'
            )
            const videos = ministerio.galeria.filter((g) => g.tipo === 'video')
            const totalItens =
              imagens.length + videos.length + (ministerio.videoUrl ? 1 : 0)
            const imgSrc =
              ministerio.imagem || (imagens.length > 0 ? imagens[0].url : null)

            return (
              <Link
                key={ministerio.id}
                href={`/ministerios/${ministerio.id}`}
                className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
              >
                <div className="aspect-video relative w-full overflow-hidden bg-gray-100">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={ministerio.nome}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/5">
                      <span className="text-5xl opacity-30">⛪</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-foreground">
                    {ministerio.nome}
                  </h2>
                  {ministerio.responsavel && (
                    <p className="mt-1 text-xs text-gray-500">
                      Responsável: {ministerio.responsavel}
                    </p>
                  )}
                  {ministerio.descricao && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {ministerio.descricao}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    {totalItens > 0 && (
                      <span className="text-xs text-gray-400">
                        {imagens.length > 0 &&
                          `${imagens.length} foto${imagens.length > 1 ? 's' : ''}`}
                        {imagens.length > 0 && videos.length > 0 && ' · '}
                        {videos.length > 0 &&
                          `${videos.length} vídeo${videos.length > 1 ? 's' : ''}`}
                        {ministerio.videoUrl &&
                          (imagens.length > 0 || videos.length > 0
                            ? ' · '
                            : '') + '1 vídeo'}
                      </span>
                    )}
                    <span className="text-sm font-medium text-primary">
                      Ver mais →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        {ministerios.length === 0 && (
          <p className="text-gray-500">
            Nenhum ministério disponível no momento.
          </p>
        )}
      </div>
    </div>
  )
}
