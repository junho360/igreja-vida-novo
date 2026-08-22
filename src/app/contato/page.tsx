import { getConfigs } from '@/lib/configuracoes'
import ContatoForm from '@/components/public/contato-form'

export default async function ContatoPage() {
  const cfg = await getConfigs(['telefone', 'email', 'endereco'])

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Contato</h1>
        <p className="mt-2 text-gray-600">
          Entre em contato conosco. Teremos prazer em responder!
        </p>

        {(cfg.telefone || cfg.email || cfg.endereco) && (
          <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600 space-y-1">
            {cfg.telefone && (
              <p>
                Telefone:{' '}
                <a
                  href={`https://wa.me/${cfg.telefone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {cfg.telefone}
                </a>
              </p>
            )}
            {cfg.email && (
              <p>
                E-mail:{' '}
                <a
                  href={`mailto:${cfg.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {cfg.email}
                </a>
              </p>
            )}
            {cfg.endereco && (
              <p>
                Endereço:{' '}
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(cfg.endereco)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {cfg.endereco}
                </a>
              </p>
            )}
          </div>
        )}

        <ContatoForm />
      </div>
    </div>
  )
}
