'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NovaCelulaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    await fetch('/api/admin/celulas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: form.get('nome'),
        descricao: form.get('descricao'),
        lider: form.get('lider'),
        horario: form.get('horario'),
        local: form.get('local'),
        telefone: form.get('telefone'),
        ordem: form.get('ordem'),
        ativo: form.get('ativo'),
      }),
    })

    router.push('/admin/celulas')
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Nova Célula</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700"
          >
            Nome *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="lider"
              className="block text-sm font-medium text-gray-700"
            >
              Líder
            </label>
            <input
              type="text"
              id="lider"
              name="lider"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
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
              placeholder="Sexta 19:30"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefone
            </label>
            <input
              type="text"
              id="telefone"
              name="telefone"
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
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <a
            href="/admin/celulas"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
