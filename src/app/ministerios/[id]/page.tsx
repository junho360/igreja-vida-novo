import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import GaleriaFotos from '@/components/public/galeria-fotos'

function youtubeEmbed(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default async function MinisterioDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const ministerio = await prisma.ministerio.findUnique({
    where: { id },
    include: { galeria: { orderBy: { ordem: 'asc' } } },
  })

  if (!ministerio || !ministerio.ativo) notFound()

  const embedUrl = ministerio.videoUrl
    ? youtubeEmbed(ministerio.videoUrl)
    : null
  const imagens = ministerio.galeria.filter((g) => g.tipo === 'imagem')
  const videos = ministerio.galeria.filter((g) => g.tipo === 'video')

  const todasFotos = [
    ...(ministerio.imagem
      ? [{ id: 'capa', url: ministerio.imagem, titulo: null }]
      : []),
    ...imagens.map((g) => ({ id: g.id, url: g.url, titulo: g.titulo })),
  ]

  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/ministerios"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Voltar para Ministérios
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-foreground">
          {ministerio.nome}
        </h1>

        {ministerio.responsavel && (
          <p className="mt-2 text-sm text-gray-500">
            Responsável: {ministerio.responsavel}
          </p>
        )}

        {ministerio.descricao && (
          <p className="mt-4 text-gray-600">{ministerio.descricao}</p>
        )}

        {ministerio.conteudo && (
          <div
            className="prose prose-lg prose-headings:text-foreground prose-a:text-primary max-w-none mt-6"
            dangerouslySetInnerHTML={{ __html: ministerio.conteudo }}
          />
        )}

        {todasFotos.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Fotos
            </h2>
            <GaleriaFotos fotos={todasFotos} />
          </div>
        )}

        {embedUrl && (
          <div className="mt-6 aspect-video">
            <iframe
              src={embedUrl}
              className="h-full w-full rounded-md"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        {videos.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Vídeos</h2>
            {videos.map((vid) => {
              const vEmbed = youtubeEmbed(vid.url)
              return vEmbed ? (
                <div key={vid.id}>
                  <div className="aspect-video">
                    <iframe
                      src={vEmbed}
                      className="h-full w-full rounded-md"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                  {vid.titulo && (
                    <p className="mt-1 text-sm text-gray-500">{vid.titulo}</p>
                  )}
                </div>
              ) : null
            })}
          </div>
        )}
      </div>
    </div>
  )
}
