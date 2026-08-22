import Link from 'next/link'
import { getConfigs } from '@/lib/configuracoes'

export default async function Footer() {
  const cfg = await getConfigs([
    'endereco',
    'telefone',
    'email',
    'instagram',
    'youtube',
  ])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Igreja Vida</h3>
            <p className="mt-2 text-sm text-gray-400">
              Uma comunidade de fé, amor e esperança.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Links</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/ministerios"
                  className="hover:text-white transition-colors"
                >
                  Ministérios
                </Link>
              </li>
              <li>
                <Link
                  href="/devocionais"
                  className="hover:text-white transition-colors"
                >
                  Devocionais
                </Link>
              </li>
              <li>
                <Link
                  href="/estudos"
                  className="hover:text-white transition-colors"
                >
                  Estudos
                </Link>
              </li>
              <li>
                <Link
                  href="/pregacoes"
                  className="hover:text-white transition-colors"
                >
                  Pregações
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Contato</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-400">
              {cfg.endereco && (
                <li>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(cfg.endereco)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    {cfg.endereco}
                  </a>
                </li>
              )}
              {cfg.telefone && (
                <li>
                  <a
                    href={`https://wa.me/${cfg.telefone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                    {cfg.telefone}
                  </a>
                </li>
              )}
              {cfg.email && (
                <li>
                  <a
                    href={`mailto:${cfg.email}`}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    {cfg.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Igreja Vida. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  )
}
