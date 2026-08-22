'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Evento {
  id: string
  titulo: string
  data: string
  dataFim: string | null
  valor: number | null
  inscricoesConfirmadas: number
}

interface Avaliacao {
  custo: number | null
  receita: number | null
  presenca: number | null
  satisfacao: number | null
  pros: string | null
  contras: string | null
  melhorias: string | null
}

interface Sugestao {
  titulo: string
  categoria: string
  prioridade: 'alta' | 'media' | 'baixa'
}

export default function AvaliarEventoPage() {
  const params = useParams()
  const router = useRouter()
  const eventoId = params.id as string

  const [evento, setEvento] = useState<Evento | null>(null)
  const [avaliacao, setAvaliacao] = useState<Avaliacao>({
    custo: null,
    receita: null,
    presenca: null,
    satisfacao: null,
    pros: null,
    contras: null,
    melhorias: null,
  })
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([])
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    fetch(`/api/admin/eventos/${eventoId}`)
      .then((r) => r.json())
      .then(setEvento)

    fetch(`/api/admin/eventos/${eventoId}/avaliacao`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.id) {
          setAvaliacao({
            custo: d.custo,
            receita: d.receita,
            presenca: d.presenca,
            satisfacao: d.satisfacao,
            pros: d.pros,
            contras: d.contras,
            melhorias: d.melhorias,
          })
        }
      })

    fetch(`/api/admin/eventos/${eventoId}/sugestoes`)
      .then((r) => r.json())
      .then(setSugestoes)
  }, [eventoId])

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    setMensagem('')

    try {
      const res = await fetch(`/api/admin/eventos/${eventoId}/avaliacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avaliacao),
      })

      if (res.ok) {
        setMensagem('Avaliação salva com sucesso!')
        const novoRes = await fetch(`/api/admin/eventos/${eventoId}/sugestoes`)
        setSugestoes(await novoRes.json())
      }
    } finally {
      setSalvando(false)
    }
  }

  const prioridadeCor: Record<string, string> = {
    alta: 'bg-red-100 text-red-700',
    media: 'bg-yellow-100 text-yellow-700',
    baixa: 'bg-green-100 text-green-700',
  }

  const categoriaIcone: Record<string, string> = {
    custo: 'R$',
    qualidade: '★',
    divulgacao: '📢',
    logistica: '📍',
    infraestrutura: '🔧',
    geral: '📋',
  }

  if (!evento) return <div className="p-8">Carregando...</div>

  const custoPessoa =
    avaliacao.presenca && avaliacao.custo
      ? (avaliacao.custo / avaliacao.presenca).toFixed(2)
      : '—'

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-primary hover:underline mb-4"
        >
          ← Voltar
        </button>

        <h1 className="text-2xl font-bold text-foreground">Avaliar Evento</h1>
        <p className="text-gray-600 mt-1">{evento.titulo}</p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-lg border bg-white p-4 text-center">
            <p className="text-xs text-gray-500">Inscritos confirmados</p>
            <p className="text-2xl font-bold text-foreground">
              {evento.inscricoesConfirmadas}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 text-center">
            <p className="text-xs text-gray-500">Valor inscrição</p>
            <p className="text-2xl font-bold text-foreground">
              {evento.valor ? `R$ ${evento.valor.toFixed(2)}` : 'Grátis'}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 text-center">
            <p className="text-xs text-gray-500">Receita total</p>
            <p className="text-2xl font-bold text-foreground">
              R$ {avaliacao.receita?.toFixed(2) ?? '—'}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 text-center">
            <p className="text-xs text-gray-500">Custo/participante</p>
            <p className="text-2xl font-bold text-foreground">
              R$ {custoPessoa}
            </p>
          </div>
        </div>

        <form onSubmit={handleSalvar} className="mt-8 space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Indicadores
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custo total (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={avaliacao.custo ?? ''}
                  onChange={(e) =>
                    setAvaliacao({
                      ...avaliacao,
                      custo: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receita total (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={avaliacao.receita ?? ''}
                  onChange={(e) =>
                    setAvaliacao({
                      ...avaliacao,
                      receita: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presença real
                </label>
                <input
                  type="number"
                  value={avaliacao.presenca ?? ''}
                  onChange={(e) =>
                    setAvaliacao({
                      ...avaliacao,
                      presenca: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Satisfação (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={avaliacao.satisfacao ?? ''}
                  onChange={(e) =>
                    setAvaliacao({
                      ...avaliacao,
                      satisfacao: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Avaliação
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prós
                </label>
                <textarea
                  rows={3}
                  value={avaliacao.pros ?? ''}
                  onChange={(e) =>
                    setAvaliacao({ ...avaliacao, pros: e.target.value || null })
                  }
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="O que funcionou bem..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contras
                </label>
                <textarea
                  rows={3}
                  value={avaliacao.contras ?? ''}
                  onChange={(e) =>
                    setAvaliacao({
                      ...avaliacao,
                      contras: e.target.value || null,
                    })
                  }
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="O que pode melhorar..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Melhorias para próximo evento
                </label>
                <textarea
                  rows={3}
                  value={avaliacao.melhorias ?? ''}
                  onChange={(e) =>
                    setAvaliacao({
                      ...avaliacao,
                      melhorias: e.target.value || null,
                    })
                  }
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Ações concretas para o próximo evento..."
                />
              </div>
            </div>
          </div>

          {mensagem && <p className="text-sm text-green-600">{mensagem}</p>}

          <button
            type="submit"
            disabled={salvando}
            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Salvar avaliação'}
          </button>
        </form>

        {sugestoes.length > 0 && (
          <div className="mt-8 rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Sugestões baseadas no histórico
            </h2>
            <div className="space-y-3">
              {sugestoes.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-md border p-3"
                >
                  <span className="text-lg">
                    {categoriaIcone[s.categoria] ?? '📋'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{s.titulo}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${prioridadeCor[s.prioridade]}`}
                  >
                    {s.prioridade}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
