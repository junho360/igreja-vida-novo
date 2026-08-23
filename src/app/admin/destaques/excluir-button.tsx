'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ExcluirDestaqueButton({
  id,
  titulo,
}: {
  id: string
  titulo: string
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Excluir o destaque "${titulo}"?`)) return
    setDeleting(true)

    const res = await fetch(`/api/admin/destaques/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      alert('Erro ao excluir')
      setDeleting(false)
      return
    }

    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {deleting ? 'Excluindo...' : 'Excluir'}
    </button>
  )
}
