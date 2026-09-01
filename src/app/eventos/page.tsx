import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getConfigs } from '@/lib/configuracoes'
import InscricaoForm from '@/components/public/inscricao-form'

export const metadata = { title: 'Eventos - Igreja Vida' }

export default async function EventosPage() {
  const [eventos, cfg] = await Promise.all([
    prisma.evento.findMany({
      where: { publicado: true },
      orderBy: { data: 'asc' },
      include: { ministerio: true },
    }),
    getConfigs(['nome_igreja', 'cidade', 'pix', 'pix_inscricao']),
  ])

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Eventos</h1>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-gray-600">
            Fique por dentro de tudo o que acontece na igreja.
          </p>
          <Link
            href="/inscricoes/acompanhar"
            className="text-sm font-medium text-primary hover:underline"
          >
            Acompanhar inscrição
          </Link>
        </div>
        <div className="mt-8 space-y-8">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {evento.titulo}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {evento.data.toLocaleDateString('pt-BR')} às{' '}
                {evento.data.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {evento.dataFim && (
                  <>
                    {' '}
                    — {evento.dataFim.toLocaleDateString('pt-BR')} às{' '}
                    {evento.dataFim.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </>
                )}
              </p>
              {evento.local && (
                <p className="mt-1 text-sm text-gray-500">{evento.local}</p>
              )}
              {evento.ministerio && (
                <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {evento.ministerio.nome}
                </span>
              )}
              {evento.descricao && (
                <p className="mt-3 text-sm text-gray-600">{evento.descricao}</p>
              )}
              {evento.inscricaoInicio && (
                <p className="mt-2 text-xs text-gray-500">
                  Inscrições:{' '}
                  {evento.inscricaoInicio.toLocaleDateString('pt-BR')} às{' '}
                  {evento.inscricaoInicio.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {evento.inscricaoFim && (
                    <>
                      {' '}
                      até {evento.inscricaoFim.toLocaleDateString(
                        'pt-BR'
                      )} às{' '}
                      {evento.inscricaoFim.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </>
                  )}
                </p>
              )}
              {evento.valor != null && evento.valor > 0 && (
                <p className="mt-2 text-sm font-semibold text-primary">
                  Valor: R$ {evento.valor.toFixed(2)}
                </p>
              )}
              <div className="mt-4">
                <InscricaoForm
                  eventoId={evento.id}
                  valor={evento.valor ?? 0}
                  nomeIgreja={cfg.nome_igreja}
                  cidade={cfg.cidade}
                  pix={cfg.pix_inscricao || cfg.pix}
                  inscricaoInicio={evento.inscricaoInicio?.toISOString()}
                  inscricaoFim={evento.inscricaoFim?.toISOString()}
                />
              </div>
            </div>
          ))}
          {eventos.length === 0 && (
            <p className="text-gray-500">
              Nenhum evento disponível no momento.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
