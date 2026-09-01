'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { generatePixPayload } from '@/lib/pix'
import WhatsAppButton from '@/components/public/whatsapp-button'

interface Lote {
  id: string
  nome: string
  valor: number
  quantidade: number
  inscritos: number
  vagasRestantes: number
  esgotado: boolean
}

interface LotesResponse {
  lotes: Lote[]
  loteDisponivel: Lote | null
  valorCheio: number
  todosEsgotados: boolean
}

interface InscricaoFormProps {
  eventoId: string
  valor: number
  valorComConvidado?: number | null
  valorSemConvidado?: number | null
  nomeIgreja?: string
  cidade?: string
  pix?: string
  contatoCartao?: string
  contatoCartaoNome?: string
  whatsapp?: string
  inscricaoInicio?: string | null
  inscricaoFim?: string | null
}

type Step = 'form' | 'pix' | 'enviado'

export default function InscricaoForm({
  eventoId,
  valor,
  valorComConvidado = null,
  valorSemConvidado = null,
  nomeIgreja = 'Igreja Vida',
  cidade = 'Sao Paulo',
  pix = '',
  contatoCartao = '',
  contatoCartaoNome = '',
  whatsapp = '',
  inscricaoInicio,
  inscricaoFim,
}: InscricaoFormProps) {
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [temConvidado, setTemConvidado] = useState(false)
  const [inscricao, setInscricao] = useState<{
    id: string
    valor: number
  } | null>(null)
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    nomeConvidado: '',
  })
  const [lotesData, setLotesData] = useState<LotesResponse | null>(null)

  const now = new Date()
  const inicio = inscricaoInicio ? new Date(inscricaoInicio) : null
  const fim = inscricaoFim ? new Date(inscricaoFim) : null

  const inscricoesAbertas = (!inicio || now >= inicio) && (!fim || now <= fim)
  const inscricoesEncerradas = fim && now > fim

  const pixPayload = useMemo(
    () => generatePixPayload(pix, nomeIgreja, cidade, inscricao?.valor),
    [pix, nomeIgreja, cidade, inscricao?.valor]
  )

  useEffect(() => {
    fetch(`/api/eventos/${eventoId}/lotes`)
      .then((r) =>
        r.ok
          ? r.json()
          : {
              lotes: [],
              loteDisponivel: null,
              valorCheio: 0,
              todosEsgotados: false,
            }
      )
      .then(setLotesData)
      .catch(() =>
        setLotesData({
          lotes: [],
          loteDisponivel: null,
          valorCheio: 0,
          todosEsgotados: false,
        })
      )
  }, [eventoId])

  const loteAtual = lotesData?.loteDisponivel
  const temDoisValores = valorComConvidado != null && valorSemConvidado != null
  const valorFinal = temDoisValores
    ? temConvidado
      ? valorComConvidado!
      : valorSemConvidado!
    : loteAtual
      ? loteAtual.valor
      : valor

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/inscricoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        eventoId,
        temConvidado,
        loteId: temDoisValores ? null : (loteAtual?.id ?? null),
      }),
    })

    const data = await res.json()
    if (res.ok) {
      setInscricao(data)
      setStep('pix')
    }
    setLoading(false)
  }

  if (step === 'enviado') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <h3 className="text-lg font-semibold text-green-800">
          Comprovante enviado!
        </h3>
        <p className="mt-2 text-sm text-green-700">
          Seu comprovante foi enviado com sucesso. Aguarde a confirmação do
          admin.
        </p>
        {whatsapp && inscricao && (
          <div className="mt-4">
            <WhatsAppButton
              numero={whatsapp}
              mensagem={`Olá! Acabei de me inscrever no evento e enviar o comprovante de pagamento.\n\nNome: ${form.nome}\nConvidado: ${form.nomeConvidado ? `Sim - ${form.nomeConvidado}` : 'Não'}\nInscrição: ${inscricao.id}\nValor: R$ ${inscricao.valor.toFixed(2)}\n\nComprovante: ${window.location.origin}/api/inscricoes/${inscricao.id}/comprovante`}
            />
          </div>
        )}
        <a
          href="/inscricoes/acompanhar"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          Acompanhar sua inscrição →
        </a>
      </div>
    )
  }

  if (step === 'pix' && inscricao) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground">
          Inscrição realizada!
        </h3>
        {inscricao.valor > 0 ? (
          <>
            <p className="mt-2 text-sm text-gray-600">
              Para confirmar sua inscrição, realize o pagamento via PIX no valor
              de <strong>R$ {inscricao.valor.toFixed(2)}</strong>.
            </p>
            {contatoCartao && (
              <p className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">
                Você também pode pagar no cartão de crédito. Entre em contato{' '}
                {contatoCartaoNome && (
                  <>
                    com <strong>{contatoCartaoNome}</strong>:{' '}
                  </>
                )}
                <strong>{contatoCartao}</strong>
              </p>
            )}
            <div className="mt-4 flex flex-col items-center">
              <InscricaoQrCode payload={pixPayload} />
              <p className="mt-3 text-xs text-gray-500">
                Chave PIX (copia e cola):
              </p>
              <p className="font-mono text-sm text-foreground break-all">
                {pixPayload}
              </p>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(pixPayload)}
                className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light transition-colors"
              >
                Copiar chave PIX
              </button>
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            Sua inscrição é gratuita. Nenhum pagamento necessário.
          </p>
        )}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-700">
            Já pagou? Envie o comprovante:
          </p>
          <UploadComprovante
            inscricaoId={inscricao.id}
            whatsapp={whatsapp}
            nome={form.nome}
            nomeConvidado={form.nomeConvidado}
            onComplete={() => setStep('enviado')}
          />
        </div>
      </div>
    )
  }

  if (!inscricoesAbertas) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <p className="text-sm font-medium text-gray-700">
          {inscricoesEncerradas
            ? 'Inscrições encerradas.'
            : 'Inscrições ainda não abertas.'}
        </p>
        {inicio && (
          <p className="mt-1 text-xs text-gray-500">
            Abrem: {inicio.toLocaleDateString('pt-BR')} às{' '}
            {inicio.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
        {fim && (
          <p className="mt-1 text-xs text-gray-500">
            Encerram: {fim.toLocaleDateString('pt-BR')} às{' '}
            {fim.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {temDoisValores ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Forma de inscrição
          </p>
          <label className="flex items-center gap-2 rounded-lg border border-gray-300 p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input
              type="radio"
              name="temConvidado"
              checked={!temConvidado}
              onChange={() => setTemConvidado(false)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm text-gray-700">
              Inscrição individual (sem convidado) - R${' '}
              {valorSemConvidado!.toFixed(2)}
            </span>
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-gray-300 p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input
              type="radio"
              name="temConvidado"
              checked={temConvidado}
              onChange={() => setTemConvidado(true)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm text-gray-700">
              Inscrição dupla (com convidado - pessoa de fora da igreja) - R${' '}
              {valorComConvidado!.toFixed(2)}
            </span>
          </label>
          {temConvidado && (
            <div className="ml-1">
              <label
                htmlFor="nomeConvidado"
                className="block text-sm font-medium text-gray-700"
              >
                Nome do convidado *
              </label>
              <input
                type="text"
                id="nomeConvidado"
                required
                value={form.nomeConvidado}
                onChange={(e) =>
                  setForm({ ...form, nomeConvidado: e.target.value })
                }
                placeholder="Nome da pessoa que vai com você"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
        </div>
      ) : (
        lotesData &&
        lotesData.lotes.length > 0 && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            {loteAtual ? (
              <>
                <p className="text-sm font-semibold text-primary">
                  {loteAtual.nome}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {loteAtual.vagasRestantes} vaga
                  {loteAtual.vagasRestantes !== 1 ? 's' : ''} restante
                  {loteAtual.vagasRestantes !== 1 ? 's' : ''}
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-gray-600">Valor cheio</p>
            )}
            <p className="text-lg font-bold text-foreground mt-1">
              R$ {valorFinal.toFixed(2)}
            </p>
          </div>
        )
      )}

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
          required
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
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
          type="text"
          id="telefone"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50 transition-colors"
      >
        {loading
          ? 'Inscrevendo...'
          : valorFinal > 0
            ? `Inscrever - R$ ${valorFinal.toFixed(2)}`
            : 'Inscrever-se (Gratuito)'}
      </button>
    </form>
  )
}

function UploadComprovante({
  inscricaoId,
  whatsapp,
  nome,
  nomeConvidado,
  onComplete,
}: {
  inscricaoId: string
  whatsapp?: string
  nome: string
  nomeConvidado?: string
  onComplete: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return

    if (
      !['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(
        f.type
      )
    ) {
      setError('Tipo não permitido. Use foto (JPG/PNG) ou PDF.')
      setFile(null)
      setPreview(null)
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 5MB.')
      setFile(null)
      setPreview(null)
      return
    }

    setError('')
    setFile(f)
    if (f.type.startsWith('image/')) {
      if (preview) URL.revokeObjectURL(preview)
      setPreview(URL.createObjectURL(f))
    } else {
      setPreview(null)
    }
  }

  function handleReset() {
    setFile(null)
    setPreview(null)
  }

  async function handleUpload() {
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('comprovante', file)

    const res = await fetch(`/api/inscricoes/${inscricaoId}/comprovante`, {
      method: 'POST',
      body: formData,
    })

    const data = res.headers.get('content-type')?.includes('application/json')
      ? await res.json()
      : { error: 'Erro ao enviar' }

    if (res.ok) {
      onComplete()
    } else {
      setError(data.error || 'Erro ao enviar')
    }
    setUploading(false)
  }

  return (
    <div className="mt-3 space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={handleSelect}
      />
      {!file ? (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="block w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-center text-sm font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors"
        >
          📎 Escolher comprovante (foto ou PDF)
        </button>
      ) : (
        <>
          {preview ? (
            <img
              src={preview}
              alt="Prévia do comprovante"
              className="mx-auto max-h-48 rounded-md border border-gray-200"
            />
          ) : (
            <p className="text-sm text-gray-600">📄 {file.name}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {uploading ? 'Enviando...' : 'Confirmar e enviar'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={uploading}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Trocar
            </button>
          </div>
        </>
      )}
      <p className="text-xs text-gray-400">JPG, PNG ou PDF. Máximo 5MB.</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-800">
        <p className="font-semibold">Não consegue tirar print?</p>
        <p className="mt-0.5">
          No app do seu banco: abra o comprovante → toque em
          &quot;Compartilhar&quot; → salve como PDF. Depois escolha o arquivo
          aqui.
        </p>
      </div>
      {whatsapp && (
        <div className="border-t border-gray-200 pt-3">
          <p className="mb-2 text-xs text-gray-500">
            Não conseguiu anexar? Envie o comprovante direto no nosso WhatsApp:
          </p>
          <WhatsAppButton
            numero={whatsapp}
            mensagem={`Olá! Fiz a inscrição ${inscricaoId} e quero enviar o comprovante de pagamento.\n\nNome: ${nome}\nConvidado: ${nomeConvidado ? `Sim - ${nomeConvidado}` : 'Não'}`}
          />
        </div>
      )}
    </div>
  )
}

function InscricaoQrCode({ payload }: { payload: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    import('qrcode-generator').then((mod) => {
      const qrcode = mod.default
      const qr = qrcode(0, 'M')
      qr.addData(payload)
      qr.make()
      const moduleCount = qr.getModuleCount()
      const cellSize = 10
      const margin = 4
      const size = moduleCount * cellSize + margin * 2
      const canvas = canvasRef.current!
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = '#000000'
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            ctx.fillRect(
              margin + col * cellSize,
              margin + row * cellSize,
              cellSize,
              cellSize
            )
          }
        }
      }
    })
  }, [payload])

  return (
    <canvas
      ref={canvasRef}
      className="block"
      style={{ width: 200, height: 200, imageRendering: 'pixelated' }}
    />
  )
}
