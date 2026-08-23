'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NovoDestaquePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    const res = await fetch('/api/admin/destaques', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: form.get('titulo'),
        subtitulo: form.get('subtitulo'),
        horario: form.get('horario'),
        local: form.get('local'),
        icone: form.get('icone'),
        ordem: form.get('ordem'),
        ativo: form.get('ativo'),
      }),
    })

    if (!res.ok) {
      setError('Erro ao salvar')
      setLoading(false)
      return
    }

    router.push('/admin/destaques')
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Novo Destaque</h1>
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
            placeholder="Culto de Domingo"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="subtitulo"
            className="block text-sm font-medium text-gray-700"
          >
            Subtítulo
          </label>
          <input
            type="text"
            id="subtitulo"
            name="subtitulo"
            placeholder="Uma experiência de fé para toda a família"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="horario"
              className="block text-sm font-medium text-gray-700"
            >
              Horário
            </label>
            <input
              type="text"
              id="horario"
              name="horario"
              placeholder="Domingos 18h30"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="local"
              className="block text-sm font-medium text-gray-700"
            >
              Local
            </label>
            <input
              type="text"
              id="local"
              name="local"
              placeholder="Templo Principal"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="icone"
              className="block text-sm font-medium text-gray-700"
            >
              Ícone
            </label>
            <input
              type="text"
              id="icone"
              name="icone"
              placeholder="🎵 ou 🙏"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="ordem"
              className="block text-sm font-medium text-gray-700"
            >
              Ordem
            </label>
            <input
              type="number"
              id="ordem"
              name="ordem"
              defaultValue="0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="ativo"
            name="ativo"
            value="true"
            defaultChecked
            className="rounded border-gray-300"
          />
          <label htmlFor="ativo" className="text-sm text-gray-700">
            Ativo
          </label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <a
            href="/admin/destaques"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
