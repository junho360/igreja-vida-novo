'use client'

import { useEffect, useState } from 'react'

interface Mensagem {
  id: string
  nome: string
  email: string
  telefone: string | null
  assunto: string
  mensagem: string
  resposta: string | null
  lida: boolean
  respondida: boolean
  createdAt: string
}

export default function AdminMensagensPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [filtro, setFiltro] = useState<
    'todos' | 'nao_lida' | 'lida' | 'respondida'
  >('todos')
  const [busca, setBusca] = useState('')
  const [expandida, setExpandida] = useState<string | null>(null)
  const [respostaTexto, setRespostaTexto] = useState('')
  const [enviando, setEnviando] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    id: string
    emailEnviado: boolean
    telefone: string | null
    resposta: string
  } | null>(null)

  useEffect(() => {
    fetch('/api/admin/mensagens')
      .then((r) => r.json())
      .then(setMensagens)
  }, [])

  async function marcarLida(id: string) {
    await fetch('/api/admin/mensagens', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, lida: true, respondida: false }),
    })
    setMensagens(mensagens.map((m) => (m.id === id ? { ...m, lida: true } : m)))
  }

  async function enviarResposta(id: string) {
    if (!respostaTexto.trim()) return
    setEnviando(id)
    const res = await fetch('/api/admin/mensagens', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        lida: true,
        respondida: true,
        resposta: respostaTexto.trim(),
      }),
    })
    const data = await res.json()
    setMensagens(
      mensagens.map((m) =>
        m.id === id
          ? { ...m, lida: true, respondida: true, resposta: data.resposta }
          : m
      )
    )
    setFeedback({
      id,
      emailEnviado: data.emailEnviado,
      telefone: data.telefone,
      resposta: data.resposta,
    })
    setRespostaTexto('')
    setEnviando(null)
  }

  const filtradas = mensagens.filter((m) => {
    if (filtro === 'nao_lida' && m.lida) return false
    if (filtro === 'lida' && (!m.lida || m.respondida)) return false
    if (filtro === 'respondida' && !m.respondida) return false
    if (busca) {
      const q = busca.toLowerCase()
      return (
        m.nome.toLowerCase().includes(q) ||
        m.assunto.toLowerCase().includes(q) ||
        m.mensagem.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      )
    }
    return true
  })

  const naoLidas = mensagens.filter((m) => !m.lida).length
  const respondidas = mensagens.filter((m) => m.respondida).length

  function formatPhone(phone: string) {
    return phone.replace(/\D/g, '')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mensagens de Contato</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setFiltro('todos')}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${filtro === 'todos' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Todas ({mensagens.length})
        </button>
        <button
          onClick={() => setFiltro('nao_lida')}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${filtro === 'nao_lida' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
        >
          Não lidas ({naoLidas})
        </button>
        <button
          onClick={() => setFiltro('lida')}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${filtro === 'lida' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}
        >
          Lidas ({mensagens.length - naoLidas - respondidas})
        </button>
        <button
          onClick={() => setFiltro('respondida')}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${filtro === 'respondida' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
        >
          Respondidas ({respondidas})
        </button>
        <input
          type="text"
          placeholder="Buscar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="ml-auto rounded-md border px-3 py-1.5 text-sm"
        />
      </div>

      <div className="mt-6 space-y-3">
        {filtradas.length === 0 && (
          <p className="text-gray-500 text-sm">Nenhuma mensagem encontrada.</p>
        )}
        {filtradas.map((msg) => {
          const expandir = expandida === msg.id
          return (
            <div
              key={msg.id}
              className={`rounded-lg border bg-white shadow-sm transition ${msg.respondida ? 'border-green-200' : msg.lida ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}`}
            >
              <button
                type="button"
                onClick={() => {
                  setExpandida(expandir ? null : msg.id)
                  if (!msg.lida) marcarLida(msg.id)
                }}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{msg.nome}</p>
                      {!msg.lida && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                      {msg.respondida && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Respondida
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-700 mt-0.5">
                      {msg.assunto}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {msg.mensagem}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </button>

              {expandir && (
                <div className="border-t px-4 pb-4 pt-3">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                    <span>{msg.email}</span>
                    {msg.telefone && <span>{msg.telefone}</span>}
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {msg.mensagem}
                  </p>

                  {msg.resposta && (
                    <div className="mt-4 rounded-md bg-green-50 border border-green-200 p-3">
                      <p className="text-xs font-semibold text-green-700 mb-1">
                        Resposta enviada:
                      </p>
                      <p className="text-sm text-green-800 whitespace-pre-wrap">
                        {msg.resposta}
                      </p>
                    </div>
                  )}

                  {!msg.respondida && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Responder
                      </label>
                      <textarea
                        rows={3}
                        value={respostaTexto}
                        onChange={(e) => setRespostaTexto(e.target.value)}
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Digite sua resposta..."
                      />
                      <button
                        onClick={() => enviarResposta(msg.id)}
                        disabled={!respostaTexto.trim() || enviando === msg.id}
                        className="mt-2 rounded-md bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {enviando === msg.id
                          ? 'Enviando...'
                          : 'Enviar resposta'}
                      </button>
                    </div>
                  )}

                  {feedback && feedback.id === msg.id && msg.respondida && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium ${feedback.emailEnviado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                      >
                        {feedback.emailEnviado
                          ? '✓ Email enviado'
                          : '✗ Email não enviado'}
                      </span>
                      {feedback.telefone && (
                        <a
                          href={`https://wa.me/55${formatPhone(feedback.telefone)}?text=${encodeURIComponent(feedback.resposta)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Enviar no WhatsApp
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
