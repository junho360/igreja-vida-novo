'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NovaPregacaoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(e.currentTarget)

    const res = await fetch('/api/admin/pregacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: form.get('titulo'),
        descricao: form.get('descricao'),
        urlYoutube: form.get('urlYoutube'),
        data: form.get('data'),
        pregador: form.get('pregador'),
        duracao: form.get('duracao'),
        publicado: form.get('publicado') === 'true',
      }),
    })

    if (!res.ok) {
      setError('Erro ao salvar pregação. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/admin/pregacoes')
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Nova Pregação</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="titulo"
            className="block text-sm font-medium text-gray-700"
          >
            Título *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="urlYoutube"
            className="block text-sm font-medium text-gray-700"
          >
            URL YouTube *
          </label>
          <input
            type="url"
            id="urlYoutube"
            name="urlYoutube"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="pregador"
              className="block text-sm font-medium text-gray-700"
            >
              Pregador
            </label>
            <input
              type="text"
              id="pregador"
              name="pregador"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="duracao"
              className="block text-sm font-medium text-gray-700"
            >
              Duração
            </label>
            <input
              type="text"
              id="duracao"
              name="duracao"
              placeholder="45:00"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="data"
            className="block text-sm font-medium text-gray-700"
          >
            Data
          </label>
          <input
            type="date"
            id="data"
            name="data"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-gray-700"
          >
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="publicado"
            name="publicado"
            value="true"
            className="rounded border-gray-300"
          />
          <label htmlFor="publicado" className="text-sm text-gray-700">
            Publicado
          </label>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <a
            href="/admin/pregacoes"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
