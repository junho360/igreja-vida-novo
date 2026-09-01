'use client'

import { useState, useEffect, useCallback } from 'react'
import WhatsAppButton from '@/components/public/whatsapp-button'
import UploadComprovantePublic from '@/components/public/upload-comprovante'

interface Inscricao {
  id: string
  nome: string
  nomeConvidado?: string | null
  email: string
  valor: number
  status: string
  comprovante?: string | null
  lote?: { nome: string } | null
  evento: { titulo: string; data: string }
  createdAt: string
}

const statusLabel: Record<string, string> = {
  pendente: 'Pendente de pagamento',
  confirmado: 'Confirmada',
  cancelado: 'Cancelada',
}

const statusColor: Record<string, string> = {
  pendente: 'text-yellow-600',
  confirmado: 'text-green-600',
  cancelado: 'text-red-600',
}

export default function AcompanharInscricoes() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [whatsapp, setWhatsapp] = useState('')

  const fetchInscricoes = useCallback(async (searchEmail: string) => {
    const res = await fetch(
      `/api/inscricoes/buscar?email=${encodeURIComponent(searchEmail)}`
    )
    if (res.ok) {
      const data = await res.json()
      setInscricoes(data.inscricoes ?? [])
      setWhatsapp(data.whatsapp ?? '')
    }
  }, [])

  useEffect(() => {
    if (inscricoes.length === 0 || !email) return
    const interval = setInterval(() => fetchInscricoes(email), 15000)
    return () => clearInterval(interval)
  }, [inscricoes.length, email, fetchInscricoes])

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInscricoes([])

    const res = await fetch(
      `/api/inscricoes/buscar?email=${encodeURIComponent(email)}`
    )
    const data = await res.json()

    if (res.ok) {
      setInscricoes(data.inscricoes ?? [])
      setWhatsapp(data.whatsapp ?? '')
      if (data.inscricoes?.length === 0)
        setError('Nenhuma inscrição encontrada para este email.')
    } else {
      setError(data.error || 'Erro ao buscar')
    }
    setLoading(false)
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">
          Acompanhar Inscrição
        </h1>
        <p className="mt-2 text-gray-600">
          Informe o email usado na inscrição para verificar o status e enviar o
          comprovante.
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex gap-3">
          <input
            type="email"
            required
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50 transition-colors"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-gray-500">{error}</p>}

        <div className="mt-8 space-y-4">
          {inscricoes.length > 0 && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Atualizando automaticamente...
            </p>
          )}
          {inscricoes.map((insc) => (
            <div
              key={insc.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {insc.evento.titulo}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(insc.evento.data).toLocaleDateString('pt-BR')} ·{' '}
                    {insc.nome}
                  </p>
                  {insc.nomeConvidado && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      + convidado: {insc.nomeConvidado}
                    </p>
                  )}
                  {insc.lote && (
                    <p className="mt-0.5 text-xs text-primary font-medium">
                      {insc.lote.nome}
                    </p>
                  )}
                  <p className="mt-1">
                    <span
                      className={`text-sm font-medium ${statusColor[insc.status] ?? 'text-gray-600'}`}
                    >
                      {statusLabel[insc.status] ?? insc.status}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">
                    {insc.valor > 0
                      ? `R$ ${insc.valor.toFixed(2)}`
                      : 'Gratuito'}
                  </p>
                </div>
              </div>

              {insc.comprovante && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-green-600">
                    Comprovante enviado
                  </span>
                  <a
                    href={`/api/inscricoes/${insc.id}/comprovante`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Ver comprovante
                  </a>
                </div>
              )}

              {insc.status === 'pendente' &&
                insc.valor > 0 &&
                !insc.comprovante && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-400">Chave PIX:</p>
                    <p className="font-mono text-xs text-gray-600 break-all">
                      inscricao-{insc.id}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(`inscricao-${insc.id}`)
                      }
                      className="mt-1 text-xs text-primary hover:underline"
                    >
                      Copiar chave
                    </button>
                    <UploadComprovante
                      inscricaoId={insc.id}
                      inscricaoNome={insc.nome}
                      nomeConvidado={insc.nomeConvidado}
                      whatsapp={whatsapp}
                    />
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function UploadComprovante({
  inscricaoId,
  inscricaoNome,
  nomeConvidado,
  whatsapp,
}: {
  inscricaoId: string
  inscricaoNome: string
  nomeConvidado?: string | null
  whatsapp: string
}) {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="mt-3 space-y-2">
        <p className="text-sm text-green-600">
          Comprovante enviado com sucesso! Aguarde a confirmação.
        </p>
        {whatsapp && (
          <WhatsAppButton
            numero={whatsapp}
            mensagem={`Olá! Enviei o comprovante da minha inscrição.\n\nNome: ${inscricaoNome}\nConvidado: ${nomeConvidado ? `Sim - ${nomeConvidado}` : 'Não'}\nInscrição: ${inscricaoId}\n\nComprovante: ${window.location.origin}/api/inscricoes/${inscricaoId}/comprovante`}
          />
        )}
      </div>
    )
  }

  return (
    <div className="mt-3">
      <p className="text-sm font-medium text-gray-700">
        Envie o comprovante de pagamento:
      </p>
      <UploadComprovantePublic
        inscricaoId={inscricaoId}
        onUploaded={() => setSent(true)}
      />
    </div>
  )
}
