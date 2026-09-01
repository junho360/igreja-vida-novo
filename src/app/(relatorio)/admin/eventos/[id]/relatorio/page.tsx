'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'

interface Inscricao {
  id: string
  nome: string
  nomeConvidado: string | null
  email: string
  telefone: string | null
  valor: number
  status: string
  comprovante: string | null
  lote: { nome: string } | null
  createdAt: string
}

interface Evento {
  id: string
  titulo: string
  data: string
  dataFim: string | null
  local: string | null
  valor: number | null
}

export default function RelatorioEventoPage() {
  const params = useParams()
  const eventoId = params.id as string
  const [evento, setEvento] = useState<Evento | null>(null)
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [filtro, setFiltro] = useState<'todos' | 'confirmado' | 'pendente'>(
    'todos'
  )
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/admin/eventos/${eventoId}`)
      .then((r) => r.json())
      .then(setEvento)

    fetch(`/api/admin/eventos/${eventoId}/relatorio`)
      .then((r) => r.json())
      .then(setInscricoes)
  }, [eventoId])

  function handlePrint() {
    window.print()
  }

  const filtradas = inscricoes.filter((i) => {
    if (filtro === 'confirmado' && i.status !== 'confirmado') return false
    if (filtro === 'pendente' && i.status !== 'pendente') return false
    return true
  })

  const pagas = inscricoes.filter((i) => i.status === 'confirmado')
  const pendentes = inscricoes.filter((i) => i.status === 'pendente')
  const arrecadado = pagas.reduce((s, i) => s + i.valor, 0)

  if (!evento) return <div className="p-8">Carregando...</div>

  return (
    <div className="report-page">
      <div className="no-print py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4">
          <div>
            <a
              href="/admin/eventos"
              className="text-sm text-primary hover:underline"
            >
              &larr; Voltar
            </a>
            <h1 className="text-xl font-bold text-gray-900">
              Relatório — {evento.titulo}
            </h1>
            <p className="text-sm text-gray-500">
              {new Date(evento.data).toLocaleDateString('pt-BR')} ·{' '}
              {filtradas.length} pessoas
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as typeof filtro)}
              className="rounded-md border px-3 py-1.5 text-sm"
            >
              <option value="todos">Todos ({inscricoes.length})</option>
              <option value="confirmado">Pagos ({pagas.length})</option>
              <option value="pendente">Pendentes ({pendentes.length})</option>
            </select>
            <button
              onClick={handlePrint}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
            >
              🖨️ Imprimir
            </button>
          </div>
        </div>
      </div>

      <div ref={printRef} className="mx-auto max-w-4xl px-4 py-6 print:px-0">
        <div className="hidden print:block mb-6 text-center border-b pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img
              src="/logo.jpg"
              alt="Igreja Vida"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-lg font-bold">Igreja Vida</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-700">
            {evento.titulo}
          </h1>
          <p className="text-sm text-gray-600">
            {new Date(evento.data).toLocaleDateString('pt-BR')}
            {evento.local && ` · ${evento.local}`}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Relatório gerado em {new Date().toLocaleDateString('pt-BR')} às{' '}
            {new Date().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4 print:gap-2">
          <div className="rounded border bg-gray-50 p-3 print:bg-white print:border-gray-300 text-center">
            <p className="text-xs text-gray-500">Pagos</p>
            <p className="text-xl font-bold text-green-700">{pagas.length}</p>
          </div>
          <div className="rounded border bg-gray-50 p-3 print:bg-white print:border-gray-300 text-center">
            <p className="text-xs text-gray-500">Pendentes</p>
            <p className="text-xl font-bold text-yellow-700">
              {pendentes.length}
            </p>
          </div>
          <div className="rounded border bg-gray-50 p-3 print:bg-white print:border-gray-300 text-center">
            <p className="text-xs text-gray-500">Arrecadado</p>
            <p className="text-xl font-bold text-primary">
              R$ {arrecadado.toFixed(2)}
            </p>
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 print:bg-gray-200">
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-bold uppercase">
                #
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-bold uppercase">
                Nome
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-bold uppercase">
                Email
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-bold uppercase">
                Telefone
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-bold uppercase">
                Lote
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-bold uppercase">
                Valor
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center text-xs font-bold uppercase">
                Status
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center text-xs font-bold uppercase print:w-16">
                ✓
              </th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((item, idx) => (
              <tr
                key={item.id}
                className={
                  item.status === 'confirmado'
                    ? 'bg-green-50/50 print:bg-green-50'
                    : 'bg-yellow-50/50 print:bg-yellow-50'
                }
              >
                <td className="border border-gray-300 px-3 py-2 text-gray-500">
                  {idx + 1}
                </td>
                <td className="border border-gray-300 px-3 py-2 font-medium">
                  {item.nome}
                  {item.nomeConvidado && (
                    <div className="text-xs font-normal text-gray-600">
                      + convidado: {item.nomeConvidado}
                    </div>
                  )}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-gray-600">
                  {item.email}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-gray-600">
                  {item.telefone ?? '—'}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-gray-600">
                  {item.lote?.nome ?? '—'}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {item.valor > 0 ? `R$ ${item.valor.toFixed(2)}` : 'Grátis'}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${
                      item.status === 'confirmado'
                        ? 'bg-green-200 text-green-800'
                        : item.status === 'pendente'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {item.status === 'confirmado'
                      ? 'PAGO'
                      : item.status === 'pendente'
                        ? 'PENDENTE'
                        : 'CANCELADO'}
                  </span>
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center print:w-16">
                  <span className="inline-block h-5 w-5 rounded border-2 border-gray-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtradas.length === 0 && (
          <p className="mt-4 text-center text-gray-500">
            Nenhuma inscrição para este filtro.
          </p>
        )}

        <div className="hidden print:block mt-8 text-xs text-gray-400 text-center border-t pt-3">
          Igreja Vida — Relatório de inscrições
        </div>
      </div>
    </div>
  )
}
