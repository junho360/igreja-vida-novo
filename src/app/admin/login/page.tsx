'use client'

import { getCsrfToken, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const enviando = useRef(false)

  useEffect(() => {
    getCsrfToken().then(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (enviando.current) return
    enviando.current = true
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    try {
      const result = await signIn('credentials', {
        email: form.get('email') as string,
        senha: form.get('senha') as string,
        redirect: false,
      })
      if (result?.error) {
        setError('E-mail ou senha inválidos.')
      } else {
        router.replace('/admin')
        router.refresh()
      }
    } catch {
      setError('Não foi possível conectar. Tente novamente.')
    } finally {
      setLoading(false)
      enviando.current = false
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Igreja Vida
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Área Administrativa
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              autoComplete="username"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              required
              autoComplete="current-password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {loading && (
            <p className="text-sm text-gray-500">
              Entrando, aguarde um instante...
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-white font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
