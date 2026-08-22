import { getConfigs } from '@/lib/configuracoes'
import PixButton from '@/components/public/pix-button'

export const metadata = { title: 'Dízimos e Ofertas - Igreja Vida' }

export default async function PixPage() {
  const cfg = await getConfigs(['pix', 'nome_igreja', 'cidade'])

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-center text-3xl font-bold text-primary">
        Dízimos e Ofertas
      </h1>
      <p className="mb-8 text-center text-gray-600">
        Contribua para a obra de Deus. Sua generosidade faz a diferença!
      </p>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Como doar via PIX
        </h2>
        <ol className="mb-6 list-decimal space-y-2 pl-5 text-gray-600">
          <li>Abra o aplicativo do seu banco</li>
          <li>
            Escolha a opção <strong>Pagar com PIX</strong>
          </li>
          <li>Escaneie o QR Code abaixo ou copie a chave</li>
          <li>Confirme o valor e envie</li>
        </ol>

        {cfg.pix && (
          <div className="flex flex-col items-center">
            <PixButton
              pix={cfg.pix}
              nome={cfg.nome_igreja}
              cidade={cfg.cidade}
            />
          </div>
        )}

        {!cfg.pix && (
          <p className="text-center text-gray-500">
            Chave PIX não configurada.
          </p>
        )}
      </div>
    </div>
  )
}
