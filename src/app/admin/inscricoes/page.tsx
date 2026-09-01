'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import InscricaoActions from '@/components/admin/inscricao-actions'

interface Inscricao {
  id: string
  nome: string
  nomeConvidado: string | null
  email: string
  telefone: string | null
  valor: number
  status: string
  comprovante: string | null
  createdAt: string
}

interface Evento {
  id: string
  titulo: string
  data: string
  valor: number | null
  inscricoes: Inscricao[]
}

export default function AdminInscricoesPage() {
  const [eventos, setEventos] = useState<Evento[]>([])

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/admin/inscricoes')
    if (res.ok) setEventos(await res.json())
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 20000)
    return () => clearInterval(interval)
  }, [fetchData])

  const totalInscricoes = eventos.reduce((s, e) => s + e.inscricoes.length, 0)
  const pendentes = eventos.reduce(
    (s, e) => s + e.inscricoes.filter((i) => i.status === 'pendente').length,
    0
  )
  const confirmadas = eventos.reduce(
    (s, e) => s + e.inscricoes.filter((i) => i.status === 'confirmado').length,
    0
  )
  const canceladas = eventos.reduce(
    (s, e) => s + e.inscricoes.filter((i) => i.status === 'cancelado').length,
    0
  )
  const totalArrecadado = eventos.reduce(
    (s, e) =>
      s +
      e.inscricoes
        .filter((i) => i.status === 'confirmado')
        .reduce((s2, i) => s2 + i.valor, 0),
    0
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Inscrições</h1>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Auto-atualizando
          </span>
        </div>
        <Link
          href="/admin/eventos/novo"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          + Novo Evento
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Total inscrições
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalInscricoes}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Pagas</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {confirmadas}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Aguardando pagamento
          </p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendentes}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Canceladas
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">{canceladas}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Arrecadado
          </p>
          <p className="text-2xl font-bold text-primary mt-1">
            R$ {totalArrecadado.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {eventos.map((evento) => {
          const pagas = evento.inscricoes.filter(
            (i) => i.status === 'confirmado'
          )
          const naoPagas = evento.inscricoes.filter(
            (i) => i.status === 'pendente'
          )
          const canceladasEvento = evento.inscricoes.filter(
            (i) => i.status === 'cancelado'
          )
          const arrecadado = pagas.reduce((s, i) => s + i.valor, 0)

          return (
            <div
              key={evento.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {evento.titulo}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(evento.data).toLocaleDateString('pt-BR')}
                      {evento.valor != null && evento.valor > 0 && (
                        <> · R$ {evento.valor.toFixed(2)}</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-green-700 font-medium">
                      {pagas.length} pagas
                    </span>
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700 font-medium">
                      {naoPagas.length} pendentes
                    </span>
                    {canceladasEvento.length > 0 && (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-red-700 font-medium">
                        {canceladasEvento.length} canceladas
                      </span>
                    )}
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">
                      R$ {arrecadado.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {evento.inscricoes.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Telefone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Comprovante
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {evento.inscricoes.map((item) => (
                      <InscricaoActions
                        key={item.id}
                        item={item}
                        onStatusChange={fetchData}
                      />
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-6 py-4 text-sm text-gray-500">
                  Nenhuma inscrição.
                </p>
              )}
            </div>
          )
        })}
      </div>

      {eventos.length === 0 && (
        <p className="mt-8 text-center text-gray-500">
          Nenhum evento ainda. Crie um evento para começar.
        </p>
      )}
    </div>
  )
}
