'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NovoDevocionalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    await fetch('/api/admin/devocionais', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: form.get('titulo'),
        conteudo: form.get('conteudo'),
        publicado: form.get('publicado'),
        publicadoEm: form.get('publicado') ? new Date().toISOString() : null,
      }),
    })

    router.push('/admin/devocionais')
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Novo Devocional</h1>
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
            htmlFor="conteudo"
            className="block text-sm font-medium text-gray-700"
          >
            Conteúdo *
          </label>
          <textarea
            id="conteudo"
            name="conteudo"
            rows={8}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="publicado"
            name="publicado"
            value="true"
            className="rounded border-gray-300"
          />
          <label htmlFor="publicado" className="text-sm text-gray-700">
            Publicar imediatamente
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
            href="/admin/devocionais"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
