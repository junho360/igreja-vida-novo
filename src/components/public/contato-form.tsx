'use client'

import { useState } from 'react'

export default function ContatoForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form)

    const res = await fetch('/api/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setStatus(res.ok ? 'sent' : 'error')
  }

  if (status === 'sent') {
    return (
      <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-green-800 font-semibold">
          Mensagem enviada com sucesso!
        </p>
        <p className="mt-1 text-sm text-green-600">Retornaremos em breve.</p>
      </div>
    )
  }

  return (
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
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label
          htmlFor="telefone"
          className="block text-sm font-medium text-gray-700"
        >
          Telefone
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
          htmlFor="assunto"
          className="block text-sm font-medium text-gray-700"
        >
          Assunto
        </label>
        <input
          type="text"
          id="assunto"
          name="assunto"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label
          htmlFor="mensagem"
          className="block text-sm font-medium text-gray-700"
        >
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-md bg-primary px-4 py-2 text-white font-semibold hover:bg-primary-light transition-colors disabled:opacity-50"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-red-600">Erro ao enviar. Tente novamente.</p>
      )}
    </form>
  )
}
