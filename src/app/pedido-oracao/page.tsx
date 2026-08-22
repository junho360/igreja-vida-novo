'use client'

import { useState } from 'react'

export default function PedidoOracaoPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form)

    const res = await fetch('/api/pedido-oracao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setStatus(res.ok ? 'sent' : 'error')
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Pedido de Oração</h1>
        <p className="mt-2 text-gray-600">
          Compartilhe o seu pedido de oração. A nossa comunidade ora por você.
        </p>

        {status === 'sent' ? (
          <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
            <p className="text-green-800 font-semibold">
              Pedido enviado com sucesso!
            </p>
            <p className="mt-1 text-sm text-green-600">
              Oramos por você. Deus abençoe!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mail (opcional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="telefone"
                className="block text-sm font-medium text-gray-700"
              >
                Telefone (opcional)
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="mensagem"
                className="block text-sm font-medium text-gray-700"
              >
                Pedido de Oração
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Compartilhe o seu pedido..."
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-md bg-primary px-4 py-2 text-white font-semibold hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar Pedido'}
            </button>
            {status === 'error' && (
              <p className="text-sm text-red-600">
                Erro ao enviar. Tente novamente.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
