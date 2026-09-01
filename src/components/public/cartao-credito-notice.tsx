'use client'

import { useEffect, useState } from 'react'

export default function CartaoCreditoNotice({
  contato,
  contatoNome,
  eventoId,
  inscricaoInicio,
  inscricaoFim,
}: {
  contato: string
  contatoNome?: string
  eventoId: string
  inscricaoInicio?: string | null
  inscricaoFim?: string | null
}) {
  const [vagasEsgotadas, setVagasEsgotadas] = useState(false)

  useEffect(() => {
    fetch(`/api/eventos/${eventoId}/lotes`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setVagasEsgotadas(!!d.todosEsgotados)
      })
      .catch(() => {})
  }, [eventoId])

  const now = new Date()
  const fim = inscricaoFim ? new Date(inscricaoFim) : null
  const encerradaPorData = fim ? now > fim : false
  const encerrada = encerradaPorData || vagasEsgotadas || false

  const nome = contatoNome || 'o responsável'

  return (
    <p className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">
      {encerrada ? (
        <>
          As inscrições para este evento foram encerradas:{' '}
          {encerradaPorData && vagasEsgotadas
            ? 'o prazo chegou ao fim e todas as vagas já foram preenchidas.'
            : vagasEsgotadas
              ? 'todas as vagas já foram preenchidas.'
              : 'o prazo chegou ao fim.'}{' '}
          Para outras formas de pagamento, fale com <strong>{nome}</strong> no{' '}
          <strong>{contato}</strong>.
        </>
      ) : (
        <>
          Você também pode pagar no cartão de crédito! Para combinar, é só
          chamar <strong>{nome}</strong> no <strong>{contato}</strong>.
        </>
      )}
    </p>
  )
}
