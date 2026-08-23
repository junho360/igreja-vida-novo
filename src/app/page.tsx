import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getConfigs } from '@/lib/configuracoes'

export default async function HomePage() {
  const [eventos, devocionais, destaques, cfg] = await Promise.all([
    prisma.evento.findMany({
      take: 3,
      where: { publicado: true, data: { gte: new Date() } },
      orderBy: { data: 'asc' },
      include: { ministerio: true },
    }),
    prisma.devocional.findMany({
      take: 1,
      where: { publicado: true, publicadoEm: { lte: new Date() } },
      orderBy: { publicadoEm: 'desc' },
    }),
    prisma.destaqueHome.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
    }),
    getConfigs(['horario_funcionamento', 'endereco', 'telefone']),
  ])

  return (
    <div>
      <section className="bg-primary text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Bem-vindo à Igreja Vida
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Uma comunidade de fé, amor e esperança. Venha nos visitar e faça
            parte da nossa família.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/contato"
              className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-accent-light transition-colors"
            >
              Entre em Contato
            </Link>
            <Link
              href="/pregacoes"
              className="rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-white/20 transition-colors"
            >
              Assistir Pregações
            </Link>
            <Link
              href="/pedido-oracao"
              className="rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-white/20 transition-colors"
            >
              Pedido de Oração
            </Link>
          </div>
        </div>
      </section>

      {destaques.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground">Destaques</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destaques.map((destaque) => (
                <div
                  key={destaque.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="h-1 bg-accent" />
                  <div className="p-6">
                    {destaque.icone && (
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                        {destaque.icone}
                      </span>
                    )}
                    <h3
                      className={`text-lg font-semibold text-primary ${destaque.icone ? 'mt-4' : ''}`}
                    >
                      {destaque.titulo}
                    </h3>
                    {destaque.subtitulo && (
                      <p className="mt-2 text-sm text-gray-500">
                        {destaque.subtitulo}
                      </p>
                    )}
                    {(destaque.horario || destaque.local) && (
                      <div className="mt-4 space-y-1 text-sm text-gray-600">
                        {destaque.horario && (
                          <p className="font-medium">{destaque.horario}</p>
                        )}
                        {destaque.local && <p>{destaque.local}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">
            Próximos Eventos
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventos.map((evento) => (
              <Link
                key={evento.id}
                href="/eventos"
                className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {evento.titulo}
                </h3>
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
                <p className="mt-1 text-sm text-gray-500">{evento.local}</p>
                {evento.ministerio && (
                  <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {evento.ministerio.nome}
                  </span>
                )}
                {evento.inscricaoInicio && (
                  <p className="mt-2 text-xs text-gray-500">
                    Inscrições:{' '}
                    {evento.inscricaoInicio.toLocaleDateString('pt-BR')}
                    {evento.inscricaoFim &&
                      ` até ${evento.inscricaoFim.toLocaleDateString('pt-BR')}`}
                  </p>
                )}
                <span className="mt-3 inline-block text-sm font-medium text-primary">
                  Inscreva-se →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">
            Devocional do Dia
          </h2>
          <div className="mt-6">
            {devocionais.length > 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm max-w-2xl">
                <h3 className="text-lg font-semibold text-foreground">
                  {devocionais[0].titulo}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {devocionais[0].publicadoEm?.toLocaleDateString('pt-BR')}
                </p>
                <p className="mt-3 text-sm text-gray-600 whitespace-pre-line">
                  {devocionais[0].conteudo}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Nenhum devocional disponível.</p>
            )}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/devocionais"
              className="text-sm font-semibold text-primary hover:text-primary-light transition-colors"
            >
              Ver todos os devocionais →
            </Link>
          </div>
        </div>
      </section>

      {(cfg.horario_funcionamento || cfg.endereco || cfg.telefone) && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Visite-nos</h2>
            <div className="mt-6 space-y-2 text-gray-600">
              {cfg.horario_funcionamento && (
                <p className="text-lg font-medium text-primary">
                  {cfg.horario_funcionamento}
                </p>
              )}
              {cfg.endereco && (
                <p>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(cfg.endereco)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors underline decoration-gray-300 underline-offset-2"
                  >
                    {cfg.endereco}
                  </a>
                </p>
              )}
              {cfg.telefone && (
                <p>
                  <a
                    href={`https://wa.me/${cfg.telefone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors underline decoration-gray-300 underline-offset-2"
                  >
                    {cfg.telefone}
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">Contribuições</h2>
          <p className="mt-2 text-gray-600">Dízimos e ofertas via PIX</p>
          <div className="mt-6">
            <Link
              href="/pix"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-light transition-colors"
            >
              Fazer uma doação
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
