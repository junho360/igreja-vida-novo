import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EstudoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const estudo = await prisma.estudo.findUnique({
    where: { id },
  })

  if (!estudo || !estudo.publicado) notFound()

  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/estudos"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Voltar para Estudos
        </Link>

        {estudo.categoria && (
          <span className="mt-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {estudo.categoria}
          </span>
        )}

        <h1 className="mt-4 text-3xl font-bold text-foreground">
          {estudo.titulo}
        </h1>

        {estudo.descricao && (
          <p className="mt-3 text-lg text-gray-500">{estudo.descricao}</p>
        )}

        {estudo.conteudo && (
          <div
            className="prose prose-lg prose-headings:text-foreground prose-a:text-primary max-w-none mt-8"
            dangerouslySetInnerHTML={{ __html: estudo.conteudo }}
          />
        )}
      </div>
    </div>
  )
}
